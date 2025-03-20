// src/components/AccuracyChart.jsx
import React from "react";
import GaugeChart from "react-gauge-chart";
import { BarChart2 } from "lucide-react";

function AccuracyChart() {
  // The gauge component expects a value between 0 and 1, so 90% becomes 0.9
  const accuracy = 0.9;

  return (
    // Add a top margin to avoid overlap with the fixed navbar (h-20 = 5rem)
    <div className="container mx-auto p-4 mt-20">
      {/* Card container with a gradient background, shadow, rounded corners, padding, and a max height */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-purple-900 shadow rounded-lg p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          <BarChart2 size={24} /> Accuracy Gauge
        </h2>
        <div className="mt-8 flex flex-col items-center">
          <GaugeChart
            id="accuracy-gauge-chart"
            nrOfLevels={20}
            colors={["#6B7280", "#8B5CF6"]} // Grey to purple theme
            arcWidth={0.3}
            percent={accuracy}
            textColor="#E5E7EB" // Light gray text for readability
          />
          <p className="text-center mt-4 text-xl text-white">Accuracy: 90%</p>
        </div>
      </div>
    </div>
  );
}

export default AccuracyChart;

// src/components/AccuracyChart.jsx

// import React from "react";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { BarChart2 } from "lucide-react";

// function AccuracyChart() {
//   const percentage = 90;

//   return (
//     // Add a top margin to avoid overlap with the fixed navbar (h-20 = 5rem)
//     <div className="container mx-auto p-4 mt-20">
//       {/* Card container with a gradient background, shadow, rounded corners, padding, and a max height */}
//       <div className="bg-gradient-to-r from-black via-gray-800 to-purple-900 shadow rounded-lg p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
//         <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
//           <BarChart2 size={24} /> Accuracy
//         </h2>
//         <div className="mt-8 flex flex-col items-center">
//           <div style={{ width: "150px", height: "150px" }}>
//             <CircularProgressbar
//               value={percentage}
//               text={`${percentage}%`}
//               styles={buildStyles({
//                 textColor: "#fff",
//                 pathColor: "#8B5CF6", // Purple tone
//                 trailColor: "#374151", // Dark grey for contrast
//               })}
//             />
//           </div>
//           <p className="text-center mt-4 text-xl text-white">
//             Accuracy: {percentage}%
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AccuracyChart;
