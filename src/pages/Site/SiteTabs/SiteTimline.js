import React, { useState } from "react";
import { FaFile, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const SiteTimeline = () => {
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const { outletData: data } = useOutletContext();



  const statuses = data.statusDetails;

  const statusTypes = [...new Set(statuses.map((status) => status.status))];

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const filteredStatuses = filter
    ? statuses.filter((status) => status.status === filter)
    : statuses;

  //   const landlord = data.landlords[0]
  //   const investors = data.investors[0]

  console.log({ filteredStatuses });

  return (
    <div className="text-xs md:text-sm lg:px-1 sm:px-16 px-4 font-poppins max-container mt-4">
      {/* <h1 className="text-sm font-bold mb-4">Statuses</h1> */}

      <div className="mb-4">
        <label
          htmlFor="statusFilter"
          className="block text-sm font-medium mb-2"
        >
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded capitalize"
        >
          <option value="">All</option>
          {statusTypes.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {filteredStatuses.map((status) => (
          <li key={status._id} className="border rounded shadow">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(status._id)}
            >
              <div className="flex items-center">
                <FaFile className="w-8 h-8 mr-4 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold uppercase">{status.status}</p>
                  <p className="text-gray-500">
                    Created At: {new Date(status.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-500">
                    Updated At: {new Date(status.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-gray-500">
                {expanded === status._id ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>
            {expanded === status._id && (
              <div className="p-4 bg-gray-50">
                {(status.status === "landlord verbally agreed" || status.status ===   "agreement complete b/w franchise and landlord" )&& (
                  <p className="text-gray-500">
                    <span className="font-medium mr-2">Landlord: </span>
                    {data.landlords[0].customId} - {data.landlords[0].name}
                  </p>
                )}
                {(status.status === "investor found" || status.status === "investor verbally agreed" || status.status ===   "agreement complete b/w franchise and landlord") && (
                  <p className="text-gray-500">
                    <span className="font-medium mr-2">Investors: </span>
                    {data.investors[0].investorId.customId} -{" "}
                    {data.investors[0].investorId.name}
                  </p>
                )}

                {status.approvedBy && (
                  <p className="text-gray-500">
                    Approved By: {status.approvedBy}
                  </p>
                )}
                {status.remarks && (
                  <p className="text-gray-500">Remarks: {status.remarks}</p>
                )}
                {status.equipmentOptions.length > 0 && (
                  <p className="text-gray-500">
                    Equipment Options: {status.equipmentOptions.join(", ")}
                  </p>
                )}
                {status.openingDate && (
                  <p className="text-gray-500">
                    Opening Date:{" "}
                    {new Date(status.openingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SiteTimeline;
