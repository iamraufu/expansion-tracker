import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import activeTaskIcon from "../../../assets/icons/activeTaskIcon.png";
import { ImSpinner2 } from "react-icons/im";
import useAuth from "../../../hooks/useAuth";
import TaskModal from "../../../components/Task/TaskModal";

const TaskDetails = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const { user } = useAuth();
  const navigate = useNavigate();

  //   const filter =
  //     user.role === "admin"
  //       ? {}
  //       : user.role !== "manager"
  //       ? { createdBy: user._id }
  //       : { createdBy: user.employees };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSwitch = () => {
    setIsModalOpen(!isModalOpen);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${api_url}/tasks/${id}`, {
        method: "get",
        headers: {
          "Content-type": "application/json",
          authorization: user.token,
        },
        // body: JSON.stringify(filter),
      });
      const json = await response.json();
      console.log(json);
      if (json.status) {
        setData(json.task);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();

    // eslint-disable-next-line
  }, []);

  const startTime = new Date(data?.startDateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(data?.endDateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  // const startDate = new Date(data.startDateTime).toLocaleDateString(
  //   [],
  //   {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   }
  // );
  const endDate = new Date(data?.endDateTime).toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <ImSpinner2 className="w-14 h-1/4 animate-spin " />
      </div>
    );
  }

  const renderAdditionalFields = (data) => {
    switch (data.task) {
      case "new site search":
        return (
          <div className="flex gap-2 items-center mb-4 ">
           {data.documents.length !== 0 &&
           <> 
            <label htmlFor="investor" className="w-28 font-medium">
              Image:
            </label>
            
            <a target="_blank" className="text-blue-500 underline" href={data.documents[0]} rel="noreferrer">View Image</a>
           </>
           
           }
            {/* <img src={data.documents[0]} className="w-6 h-6" alt="" srcSet="" /> */}
            {/* <p
              className="capitalize underline text-blue-500 cursor-pointer"
              onClick={() => {
                navigate(`/investor/${data.investor._id}/`);
              }}
            >
              {data.investor.customId} - {data.investor.name}
            </p> */}
          </div>
        );
      case "meeting with investor":
        return (
          <div className="flex gap-2 items-center mb-4 ">
            <label htmlFor="investor" className="w-28 font-medium">
              Investor:
            </label>
            <p
              className="capitalize underline text-blue-500 cursor-pointer"
              onClick={() => {
                navigate(`/investor/${data.investor._id}/`);
              }}
            >
              {data.investor.customId} - {data.investor.name}
            </p>
          </div>
        );
      case "meeting with landlord":
        return (
          <div className="flex gap-2 items-center mb-4">
            <label htmlFor="investor" className="w-28 font-medium">
              Landlord:
            </label>
            <p
              className="capitalize underline text-blue-500 cursor-pointer"
              onClick={() => {
                navigate(`/landlord/${data.landlord._id}/`);
              }}
            >
              {data.landlord.customId} - {data.landlord.name}
            </p>
          </div>
        );
      case "meeting both party / negotiation":
        return (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-28 font-medium">
                Landlord:
              </label>
              <p
                className="capitalize underline text-blue-500"
                onClick={() => {
                  navigate(`/landlord/${data.landlord._id}/`);
                }}
              >
                {data.landlord.customId} - {data.landlord.name}
              </p>
            </div>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-28 font-medium">
                Investor:
              </label>
              <p
                className="capitalize underline text-blue-500 "
                onClick={() => {
                  navigate(`/investor/${data.investor._id}/`);
                }}
              >
                {data.investor.customId} - {data.investor.name}
              </p>
            </div>
          </>
        );
      case "outlet opening":
      case "check outlet opening preparation":
        return (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-28 font-medium">
                Site:
              </label>
              <p
                className="capitalize underline text-blue-500"
                onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}
              >
                {data.site.customId} - {data.site.name}
              </p>
            </div>
          </>
        );
      case "primary measurement":
        return (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-28 font-medium">
                Site:
              </label>
              <p
                className="capitalize underline text-blue-500"
                onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}
              >
                {data.site.customId} - {data.site.name}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-28 font-medium">
                SQft:
              </label>
              <p
                className="capitalize "
              
              >
                {data.site.sqft} sqft
              </p>
            </div>
          </>
        );
      case "equipment order":
        return (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-28 font-medium">
                Site:
              </label>
              <p
                className="capitalize underline text-blue-500"
                onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}
              >
                {data.site.customId} - {data.site.name}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-28 font-medium">
                Equipment:
              </label>
              {data.equipment.map((item) => (
                <>
                  <p className="uppercase text whitespace-normal text-white bg-secondary py-1 px-3 rounded">
                    {item}
                  </p>
                </>
              ))}
            </div>
          </>
        );

      //   case "meeting both party / negotiation":
      //     return (
      //       <>
      //         <div className="flex items-center mb-4">
      //           <label htmlFor="investor" className="mr-2">
      //             Select Investor:
      //           </label>
      //           <select
      //             id="investor"
      //             name="investor"
      //             value={values.investor}
      //             onChange={handleChange}
      //             className={`input-field ${
      //               errors.investor ? "border-red-500" : "border-[#b1b1b1]"
      //             }`}
      //           >
      //             <option value="">Select Investor</option>
      //             {investors.map((investor) => (
      //               <option key={investor._id} value={investor._id}>
      //                 {investor.customId} - {investor.name}
      //               </option>
      //             ))}
      //           </select>
      //         </div>
      //         <div className="flex items-center mb-4">
      //           <label htmlFor="landlord" className="mr-2">
      //             Select Landlord:
      //           </label>
      //           <select
      //             id="landlord"
      //             name="landlord"
      //             value={values.landlord}
      //             onChange={handleChange}
      //             className={`input-field ${
      //               errors.landlord ? "border-red-500" : "border-[#b1b1b1]"
      //             }`}
      //           >
      //             <option value="">Select Landlord</option>
      //             {landlords.map((landlord) => (
      //               <option key={landlord._id} value={landlord._id}>
      //                 {landlord.customId} - {landlord.name}
      //               </option>
      //             ))}
      //           </select>
      //         </div>
      //       </>
      //     );
      //   case "equipment order":
      //     return (
      //       <>
      //         <div className="flex items-center mb-4">
      //           <label htmlFor="site" className="mr-2">
      //             Select Site:
      //           </label>
      //           <select
      //             id="site"
      //             name="site"
      //             value={values.site}
      //             onChange={handleChange}
      //             className={`input-field ${
      //               errors.site ? "border-red-500" : "border-[#b1b1b1]"
      //             }`}
      //           >
      //             <option value="">Select Site</option>
      //             {sites.map((site) => (
      //               <option key={site._id} value={site._id}>
      //                 {site.customId} - {site.name}
      //               </option>
      //             ))}
      //           </select>
      //         </div>
      //         <div className="flex items-center mb-4">
      //           <label htmlFor="equipment" className="mr-2">
      //             Select Equipment:
      //           </label>
      //           <div className="relative w-full">
      //             <button
      //               type="button"
      //               className="input-field text-start border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
      //               onClick={toggleDropdown}
      //             >
      //               Select Equipment
      //             </button>
      //             {isMultiDropDownOpen && (
      //               <div className="absolute left-0 w-full mt-2 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
      //                 {equipmentTypes.map((equipment) => (
      //                   <label
      //                     key={equipment.value}
      //                     className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
      //                   >
      //                     <input
      //                       type="checkbox"
      //                       value={equipment.value}
      //                       checked={selectedEquipments.includes(equipment.value)}
      //                       onChange={() => handleOptionClick(equipment.value)}
      //                       className="form-checkbox h-5 w-5 text-blue-600"
      //                     />
      //                     <span className="ml-2">{equipment.label}</span>
      //                   </label>
      //                 ))}
      //               </div>
      //             )}
      //           </div>
      //         </div>
      //       </>
      //     );
      //   case "outlet opening":
      //   case "check outlet opening preparation":
      //   case "primary measurement":
      // return (
      //   <div className="flex items-center mb-4">
      //     <label htmlFor="site" className="mr-2">
      //       Select Site:
      //     </label>
      //     <select
      //       id="site"
      //       name="site"
      //       value={values.site}
      //       onChange={handleChange}
      //       className={`input-field ${
      //         errors.site ? "border-red-500" : "border-[#b1b1b1]"
      //       }`}
      //     >
      //       <option value="">Select Site</option>
      //       {sites.map((site) => (
      //         <option key={site._id} value={site._id}>
      //           {site.customId} - {site.name}
      //         </option>
      //       ))}
      //     </select>
      //   </div>
      // );
      default:
        return null;
    }
  };

  return (
    <section className="partner accuisition text-[11px] lg:px-1 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font- md:font-medium text-base  pt-5 gap-3 font-poppins">
        <img
          src={activeTaskIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm  md:text-base font-semibold capitalize">
          Update Task - {data.task}
        </p>
      </div>

      <div className="details-tab mt-4">
        <div className="details-section flex flex-col my-4 gap-4">
          <div className="flex gap-2 w-full">
            <h1 className="w-28 font-medium">Created By:</h1>
            <p className="capitalize ">{data?.createdBy?.name}</p>
          </div>
          {/* <div className="flex gap-2 w-full">
            <h1 className="w-28 font-medium">Created On:</h1>
            <p className="capitalize ">
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div> */}

          <div className="flex gap-2">
            <h1 className="w-28 font-medium">Division:</h1>
            <p className="capitalize ">{data?.division}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-28 font-medium">District:</h1>
            <p className="capitalize ">{data?.district}</p>
          </div>
          {/* <div className="flex gap-2 w-full">
            <h1 className="w-28 font-medium">Thana/Upazila:</h1>
            <p className="capitalize ">{data?.upazila}</p>
          </div> */}

          {data?.isComplete && (
            <div className="flex gap-2 w-full ">
              <h1 className="w-28 font-medium">Remarks:</h1>
              <p className="capitalize ">
                {data?.remarks ? data?.remarks : "N/A"}
              </p>
            </div>
          )}
          {data?.isComplete && (
            <div className="flex gap-2 w-full ">
              <h1 className="w-28 font-medium">Task Status:</h1>
              <p className="capitalize ">
                {data?.taskStatus ? "Affirmative" : "Negative"}
              </p>
            </div>
          )}

          <div className="flex gap-2 w-full ">
            <h1 className="w-28 font-medium">Type:</h1>
            <p className="capitalize ">{data?.task}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-28 font-medium">Date:</h1>
            <div>
              <p className="capitalize ">
                {startTime} - {endTime},
              </p>
              <p className="capitalize ">{endDate}</p>
            </div>
          </div>

          {renderAdditionalFields(data)}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          data={data}
          handleModalSwitch={handleModalSwitch}
          fetchData={fetchData}
          isModalOpen={isModalOpen}
          api_url={api_url}
          id={id}
          user={user}
        />
      )}

      {!data.isComplete && (
        <button
          onClick={() => handleModalSwitch()}
          className="w-full py-2 shadow   rounded-md bg-primary  font-medium text-white flex justify-center items-center gap-3 mt-4 hover:bg-secondary hover:text-white"
        >
          {/* <BiEdit className="h-6 w-6 " /> */}
          <p className="font-semibold text-sm">Mark as Complete</p>
        </button>
      )}
    </section>
  );
};

export default TaskDetails;
