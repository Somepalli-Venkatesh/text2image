import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ImageEditor = ({ imageSrc, onSave, onCancel }) => {
  const baseCanvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  const containerRef = useRef(null);

  // Enhanced state management
  const [editorState, setEditorState] = useState({
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    editorZoom: 1,
    pan: { x: 0, y: 0 },
    lastPos: null,
    editorMode: "none",
    isDrawing: false,
    flipH: false,
    flipV: false,
    drawColor: "#ff0000",
    brushSize: 2,
    isEraser: false,
    opacity: 100,
    brushHardness: 100,
    shapeTool: "none", // "rectangle", "circle", "line", "none"
    currentShape: null,
    filters: {
      sepia: 0,
      grayscale: 0,
      invert: 0,
    },
  });

  // Separate state for undo/redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [annotationText, setAnnotationText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load image into the base canvas with enhanced error handling
  useEffect(() => {
    const baseCanvas = baseCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    const img = new Image();

    img.src = imageSrc;
    img.onload = () => {
      try {
        baseCanvas.width = img.width;
        baseCanvas.height = img.height;
        drawingCanvas.width = img.width;
        drawingCanvas.height = img.height;
        drawBaseImage(img);
        saveToUndoStack();
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
    img.onerror = () => {
      console.error("Error loading image source");
    };
  }, [
    imageSrc,
    editorState.rotation,
    editorState.brightness,
    editorState.contrast,
    editorState.saturation,
    editorState.blur,
    editorState.flipH,
    editorState.flipV,
    editorState.filters,
  ]);

  // Enhanced base image drawing with all transformations
  const drawBaseImage = (img) => {
    const canvas = baseCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((editorState.rotation * Math.PI) / 180);
    ctx.scale(editorState.flipH ? -1 : 1, editorState.flipV ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Apply filters
    ctx.filter = `brightness(${editorState.brightness}%) 
                  contrast(${editorState.contrast}%) 
                  saturate(${editorState.saturation}%) 
                  blur(${editorState.blur}px)
                  sepia(${editorState.filters.sepia}%)
                  grayscale(${editorState.filters.grayscale}%)
                  invert(${editorState.filters.invert}%)`;

    ctx.globalAlpha = editorState.opacity / 100;
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };

  // Shape drawing functions
  const drawShape = (e) => {
    if (!editorState.shapeTool || editorState.shapeTool === "none") return;

    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x =
      (e.clientX - rect.left) / editorState.editorZoom - editorState.pan.x;
    const y =
      (e.clientY - rect.top) / editorState.editorZoom - editorState.pan.y;

    if (!editorState.currentShape) {
      setEditorState((prev) => ({
        ...prev,
        currentShape: { startX: x, startY: y, endX: x, endY: y },
      }));
      return;
    }

    // Clear previous preview
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw new preview
    ctx.strokeStyle = editorState.drawColor;
    ctx.lineWidth = editorState.brushSize;
    ctx.beginPath();

    const { startX, startY } = editorState.currentShape;

    switch (editorState.shapeTool) {
      case "rectangle":
        ctx.rect(startX, startY, x - startX, y - startY);
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(x - startX, 2) + Math.pow(y - startY, 2)
        );
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        break;
      case "line":
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        break;
      default:
        break;
    }

    ctx.stroke();
  };

  const finishShape = () => {
    if (!editorState.currentShape) return;

    const canvas = drawingCanvasRef.current;
    const ctx = canvas.getContext("2d");

    // Save the final shape
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, imageData]);
    setRedoStack([]);

    setEditorState((prev) => ({
      ...prev,
      currentShape: null,
    }));
  };

  // Enhanced drawing functionality with brush size and eraser
  const startDrawing = (e) => {
    if (editorState.editorMode !== "draw") return;

    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x =
      (e.clientX - rect.left) / editorState.editorZoom - editorState.pan.x;
    const y =
      (e.clientY - rect.top) / editorState.editorZoom - editorState.pan.y;

    const ctx = canvas.getContext("2d");

    if (editorState.isEraser) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = editorState.drawColor;
    }

    ctx.lineWidth = editorState.brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Apply brush hardness
    ctx.globalAlpha = editorState.brushHardness / 100;

    setEditorState((prev) => ({
      ...prev,
      isDrawing: true,
      lastPos: { x, y },
    }));
  };

  const draw = (e) => {
    if (!editorState.isDrawing || editorState.editorMode !== "draw") return;

    const canvas = drawingCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x =
      (e.clientX - rect.left) / editorState.editorZoom - editorState.pan.x;
    const y =
      (e.clientY - rect.top) / editorState.editorZoom - editorState.pan.y;

    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();

    setEditorState((prev) => ({
      ...prev,
      lastPos: { x, y },
    }));
  };

  const stopDrawing = () => {
    if (editorState.editorMode !== "draw") return;

    const ctx = drawingCanvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    setEditorState((prev) => ({
      ...prev,
      isDrawing: false,
      lastPos: null,
    }));

    saveToUndoStack();
  };

  // Enhanced undo/redo functionality
  const saveToUndoStack = () => {
    const drawingCanvas = drawingCanvasRef.current;
    const imageData = drawingCanvas
      .getContext("2d")
      .getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);

    setUndoStack((prev) => [...prev, imageData]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const drawingCanvas = drawingCanvasRef.current;
    const ctx = drawingCanvas.getContext("2d");

    const currentState = ctx.getImageData(
      0,
      0,
      drawingCanvas.width,
      drawingCanvas.height
    );
    setRedoStack((prev) => [...prev, currentState]);

    const newUndoStack = [...undoStack];
    const lastState = newUndoStack.pop();
    ctx.putImageData(lastState, 0, 0);

    setUndoStack(newUndoStack);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const drawingCanvas = drawingCanvasRef.current;
    const ctx = drawingCanvas.getContext("2d");

    const currentState = ctx.getImageData(
      0,
      0,
      drawingCanvas.width,
      drawingCanvas.height
    );
    setUndoStack((prev) => [...prev, currentState]);

    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    ctx.putImageData(nextState, 0, 0);

    setRedoStack(newRedoStack);
  };

  // Reset function
  const resetEditor = () => {
    setEditorState({
      rotation: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      editorZoom: 1,
      pan: { x: 0, y: 0 },
      lastPos: null,
      editorMode: "none",
      isDrawing: false,
      flipH: false,
      flipV: false,
      drawColor: "#ff0000",
      brushSize: 2,
      isEraser: false,
      opacity: 100,
      brushHardness: 100,
      shapeTool: "none",
      currentShape: null,
      filters: {
        sepia: 0,
        grayscale: 0,
        invert: 0,
      },
    });

    const drawingCanvas = drawingCanvasRef.current;
    const ctx = drawingCanvas.getContext("2d");
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    setUndoStack([]);
    setRedoStack([]);
  };

  // Enhanced UI components with animations
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-[95vw] aspect-square mx-auto p-6 bg-gradient-to-br from-blue-900 via-gray-800 to-black rounded-xl shadow-2xl"
    >
      {/* Enhanced Toolbar */}
      <div className="flex flex-col space-y-4 mb-6">
        <motion.div
          className="flex justify-between items-center flex-wrap gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditorState((prev) => ({
                  ...prev,
                  rotation: prev.rotation - 15,
                }))
              }
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
            >
              Rotate Left
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditorState((prev) => ({
                  ...prev,
                  rotation: prev.rotation + 15,
                }))
              }
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
            >
              Rotate Right
            </motion.button>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditorState((prev) => ({
                  ...prev,
                  editorZoom: Math.min(prev.editorZoom + 0.2, 3),
                }))
              }
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
            >
              Zoom In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditorState((prev) => ({
                  ...prev,
                  editorZoom: Math.max(prev.editorZoom - 0.2, 0.5),
                }))
              }
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
            >
              Zoom Out
            </motion.button>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditorState((prev) => ({ ...prev, flipH: !prev.flipH }))
              }
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
            >
              Flip H
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setEditorState((prev) => ({ ...prev, flipV: !prev.flipV }))
              }
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
            >
              Flip V
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetEditor}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
          >
            Reset All
          </motion.button>
        </motion.div>

        {/* Enhanced Controls */}
        <motion.div
          className="flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="flex items-center text-white">
            Brightness:
            <input
              type="range"
              min="50"
              max="150"
              value={editorState.brightness}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  brightness: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Contrast:
            <input
              type="range"
              min="50"
              max="150"
              value={editorState.contrast}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  contrast: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Saturation:
            <input
              type="range"
              min="50"
              max="150"
              value={editorState.saturation}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  saturation: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Blur:
            <input
              type="range"
              min="0"
              max="10"
              value={editorState.blur}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  blur: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Brush Size:
            <input
              type="range"
              min="1"
              max="20"
              value={editorState.brushSize}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  brushSize: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Brush Hardness:
            <input
              type="range"
              min="1"
              max="100"
              value={editorState.brushHardness}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  brushHardness: Number(e.target.value),
                }))
              }
              className="ml-2"
            />
          </label>
        </motion.div>

        {/* Advanced Filters */}
        <motion.div
          className="flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="flex items-center text-white">
            Sepia:
            <input
              type="range"
              min="0"
              max="100"
              value={editorState.filters.sepia}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    sepia: Number(e.target.value),
                  },
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Grayscale:
            <input
              type="range"
              min="0"
              max="100"
              value={editorState.filters.grayscale}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    grayscale: Number(e.target.value),
                  },
                }))
              }
              className="ml-2"
            />
          </label>

          <label className="flex items-center text-white">
            Invert:
            <input
              type="range"
              min="0"
              max="100"
              value={editorState.filters.invert}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    invert: Number(e.target.value),
                  },
                }))
              }
              className="ml-2"
            />
          </label>
        </motion.div>

        {/* Drawing Tools */}
        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setEditorState((prev) => ({
                ...prev,
                editorMode: prev.editorMode === "draw" ? "none" : "draw",
                isEraser: false,
                shapeTool: "none",
              }))
            }
            className={`px-3 py-1 rounded text-white transition ${
              editorState.editorMode === "draw" && !editorState.isEraser
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editorState.editorMode === "draw" && !editorState.isEraser
              ? "Drawing Mode (On)"
              : "Drawing Mode"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setEditorState((prev) => ({
                ...prev,
                editorMode: "draw",
                isEraser: !prev.isEraser,
                shapeTool: "none",
              }))
            }
            className={`px-3 py-1 rounded text-white transition ${
              editorState.isEraser
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editorState.isEraser ? "Eraser (On)" : "Eraser"}
          </motion.button>

          {/* Shape Tools */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setEditorState((prev) => ({
                ...prev,
                shapeTool:
                  prev.shapeTool === "rectangle" ? "none" : "rectangle",
                editorMode: "draw",
                isEraser: false,
              }))
            }
            className={`px-3 py-1 rounded text-white transition ${
              editorState.shapeTool === "rectangle"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Rectangle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setEditorState((prev) => ({
                ...prev,
                shapeTool: prev.shapeTool === "circle" ? "none" : "circle",
                editorMode: "draw",
                isEraser: false,
              }))
            }
            className={`px-3 py-1 rounded text-white transition ${
              editorState.shapeTool === "circle"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Circle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setEditorState((prev) => ({
                ...prev,
                shapeTool: prev.shapeTool === "line" ? "none" : "line",
                editorMode: "draw",
                isEraser: false,
              }))
            }
            className={`px-3 py-1 rounded text-white transition ${
              editorState.shapeTool === "line"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Line
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition"
          >
            Color
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setEditorState((prev) => ({
                ...prev,
                editorMode: prev.editorMode === "pan" ? "none" : "pan",
              }))
            }
            className={`px-3 py-1 rounded text-white transition ${
              editorState.editorMode === "pan"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {editorState.editorMode === "pan" ? "Pan Mode (On)" : "Pan Mode"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            disabled={undoStack.length === 0}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition disabled:opacity-50"
          >
            Undo
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={redo}
            disabled={redoStack.length === 0}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition disabled:opacity-50"
          >
            Redo
          </motion.button>
        </motion.div>
      </div>

      {/* Color Picker Modal */}
      {showColorPicker && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
        >
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-white mb-4 text-lg">Choose Color</h2>
            <input
              type="color"
              value={editorState.drawColor}
              onChange={(e) =>
                setEditorState((prev) => ({
                  ...prev,
                  drawColor: e.target.value,
                }))
              }
              className="w-full h-10 mb-4"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowColorPicker(false)}
              className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white transition w-full"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Canvas Container */}
      <motion.div
        ref={containerRef}
        className="relative border border-white/20 overflow-hidden rounded-md"
        style={{
          transform: `scale(${editorState.editorZoom}) translate(${editorState.pan.x}px, ${editorState.pan.y}px)`,
          transformOrigin: "top left",
        }}
        onWheel={(e) => {
          e.preventDefault();
          setEditorState((prev) => ({
            ...prev,
            editorZoom: Math.min(
              Math.max(prev.editorZoom + e.deltaY * -0.001, 0.5),
              3
            ),
          }));
        }}
        onMouseDown={(e) => {
          if (editorState.shapeTool !== "none") {
            drawShape(e);
          } else if (editorState.editorMode === "draw") {
            startDrawing(e);
          } else if (editorState.editorMode === "pan") {
            setEditorState((prev) => ({
              ...prev,
              lastPos: { x: e.clientX, y: e.clientY },
            }));
          }
        }}
        onMouseMove={(e) => {
          if (editorState.shapeTool !== "none" && editorState.currentShape) {
            drawShape(e);
          } else if (editorState.editorMode === "draw") {
            draw(e);
          } else if (editorState.editorMode === "pan" && editorState.lastPos) {
            const dx = e.clientX - editorState.lastPos.x;
            const dy = e.clientY - editorState.lastPos.y;
            setEditorState((prev) => ({
              ...prev,
              pan: {
                x: prev.pan.x + dx / prev.editorZoom,
                y: prev.pan.y + dy / prev.editorZoom,
              },
              lastPos: { x: e.clientX, y: e.clientY },
            }));
          }
        }}
        onMouseUp={() => {
          if (editorState.shapeTool !== "none") {
            finishShape();
          } else if (editorState.editorMode === "draw") {
            stopDrawing();
          } else if (editorState.editorMode === "pan") {
            setEditorState((prev) => ({ ...prev, lastPos: null }));
          }
        }}
        onMouseLeave={() => {
          if (editorState.shapeTool !== "none") {
            finishShape();
          } else if (editorState.editorMode === "draw") {
            stopDrawing();
          } else if (editorState.editorMode === "pan") {
            setEditorState((prev) => ({ ...prev, lastPos: null }));
          }
        }}
      >
        <canvas ref={baseCanvasRef} className="block" />
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-0 left-0"
          style={{
            pointerEvents:
              editorState.editorMode === "draw" ||
              editorState.shapeTool !== "none"
                ? "auto"
                : "none",
          }}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="mt-6 flex justify-end gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const baseCanvas = baseCanvasRef.current;
            const drawingCanvas = drawingCanvasRef.current;
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = baseCanvas.width;
            tempCanvas.height = baseCanvas.height;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.drawImage(baseCanvas, 0, 0);
            tempCtx.drawImage(drawingCanvas, 0, 0);
            const editedDataURL = tempCanvas.toDataURL("image/png");
            onSave(editedDataURL);
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
        >
          Save Changes
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ImageEditor;
