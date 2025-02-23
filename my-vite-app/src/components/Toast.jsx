import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, isError, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg backdrop-blur-md shadow-xl border ${
          isError
            ? "bg-red-500/10 border-red-500/20 text-red-500"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium`}>{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
