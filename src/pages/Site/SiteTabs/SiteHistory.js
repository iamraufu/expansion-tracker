import React from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";

const SiteHistory = () => {
  const { outletData: data } = useOutletContext();

  return (
    <div className="text-xs md:text-sm lg:px-1 sm:px-16 px-4 font-poppins max-container mt-4">
      <div className="relative flex flex-col space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-1.5 top-0 w-0.5 h-full bg-gray-300"></div>
        {data.siteHistory.map((entry, index) => (
          <div key={entry._id} className="relative flex items-center">
            <div className="flex-shrink-0">
              <div
                className={`w-4 h-4 rounded-full shadow-md ${
                  index % 2 === 0 ? "bg-blue-500" : "bg-green-500"
                }`}
              ></div>
            </div>
            <div className="ml-6 p-4 rounded-lg shadow-md bg-white border border-gray-200 flex-1 transition-transform transform hover:scale-105">
              <h3 className="font-semibold text-sm md:text-base mb-2 text-gray-800 uppercase">
                {entry.status}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Start Time: {format(new Date(entry.startTime), "d MMM yyyy, p")}
              </p>
              <p className="text-xs md:text-sm text-gray-600">
                End Time: {format(new Date(entry.endTime), "d MMM yyyy, p")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SiteHistory;
