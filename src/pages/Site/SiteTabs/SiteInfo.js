/* eslint-disable no-unused-vars */
import { NavLink, useOutletContext, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
// import partnerAcquisitionIcon from "../../../assets/icons/landmark.png";
import { ImSpinner2 } from "react-icons/im";
import { BiEdit } from "react-icons/bi";
import { useState } from "react";
// import { RxCross2 } from "react-icons/rx";
import SiteStatusModal from "../../../components/Site/SiteStatusModal";
import useAuth from "../../../hooks/useAuth";
// import SiteStatusModal from "../../../components/Site/SiteStatusModal"; 

const SiteInfo = () => {
  let { id } = useParams();
  const { user } = useAuth();
  const api_url = process.env.REACT_APP_API_URL;
  const {
    outletData: data,
    investors,
    landlords,
    fetchData,
  } = useOutletContext();

  console.log({ data, investors, landlords });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSwitch = () => {
    setIsModalOpen(!isModalOpen);
  };

  const updateSite = async (value) => {
    console.log(data.status);

    if(data.feasibilityDoneByOperations === true && data.statusDetails.find(item => item.status ==="RMIA validation")){
      toast.error("Status Locked for this")
      return
    }
     
  
      try {
        const response = await fetch(`${api_url}/site/update/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: user.token,
          },
          body: JSON.stringify({ feasibilityDoneByOperations: value }),
        });
  
        const responseData = await response.json();
        if (responseData.status) {
          toast.success(responseData.message);
          fetchData()
          console.log(responseData);
        } else {
          console.log(response);
          console.error("Failed to submit form");
          toast.error(responseData.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("There is a problem with the server!");
      }
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <ImSpinner2 className="w-14 h-1/4 animate-spin " />
      </div>
    );
  }

  return (
    <section className="partner accuisition text-xs md:text-sm  lg:px-1 sm:px-16 px-4 font-poppins max-container ">
      <div className="details-tab mt-4">
        <div className="details-section flex flex-col my-4 gap-4">
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Id:</h1>
            <p className="">{data?.customId}</p>
          </div>
          {data.sapCode !== "" && <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Sap Code:</h1>
            <p className="">{data?.sapCode}</p>
          </div>}
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Site Name:</h1>
            <p className="capitalize">{data?.name}</p>
          </div>
          {/* <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Created By:</h1>
            <p className="capitalize">{data?.createdBy?.name}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Created On:</h1>
            <p className="capitalize">
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div> */}
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Sqft:</h1>
            <p className="capitalize">{data?.sqft}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Asking Advance:</h1>
            <p className="capitalize">{data?.askingAdvance}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Asking Rent:</h1>
            <p className="capitalize">{data?.askingRent}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Premises Structure:</h1>
            <p className="capitalize">{data?.premisesStructure}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Est. Handover Date:</h1>
            <p className="capitalize">
              {new Date(data?.estimatedHandoverDate).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Feasibility by Ops:</h1>
            <p><input type="checkbox" checked={data.feasibilityDoneByOperations} onChange={(e) => updateSite(e.target.checked)} /></p>
            {/* <p className="capitalize">{data?.feasibilityDoneByOperations}</p> */}
          </div>
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Address:</h1>
            <p className="capitalize">{data?.address}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">Division:</h1>
            <p className="capitalize">{data?.division}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-40 font-medium">District:</h1>
            <p className="capitalize">{data?.district}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Thana/Upazila:</h1>
            <p className="capitalize">{data?.upazila}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Status:</h1>
            <p className="capitalize">{data?.status}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Created By:</h1>
            <p className="capitalize">{data?.createdBy.name}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-40 font-medium">Created At:</h1>
            <p className="capitalize">{new Date(data?.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex items-start gap-2 w-full">
            <h1 className="w-40 font-medium">Location:</h1>
            <div className="text-blue-700 text-xs">
              {data?.location ? (
                <a
                  href={`https://www.google.com/maps?q=${data.location.latitude},${data.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize underline"
                >
                  {`${data.location.latitude}, ${data.location.longitude}`}
                </a>
              ) : (
                <>
                  <p className="capitalize underline">N/A,</p>
                  <p className="capitalize underline">N/A</p>
                </>
              )}
            </div>
          </div>

         {data?.status !== "site complete" &&  <button
            onClick={() => handleModalSwitch()}
            // disabled={data?.status === "site complete"}
            className="w-full py-2 shadow  border-2 disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-slate-200 disabled:bg-slate-200 rounded-md border-rose-600 font-medium text-rose-600 flex justify-center items-center gap-3 mt-4 hover:bg-rose-600 hover:text-white"
          >
            <BiEdit className="h-6 w-6 " />
            <p className="font-semibold text-xs">Change Status</p>
          </button>}
          {isModalOpen && (
            <>
              <SiteStatusModal
                data={data}
                handleModalSwitch={handleModalSwitch}
                fetchData={fetchData}
                isModalOpen={isModalOpen}
                investors={investors}
                landlords={landlords}
              />
            </>
          )}
        </div>
      </div>
      <NavLink to={`/site/update/${id}`}  className="w-full block text-center my-4 bg-teal-500 py-3 rounded text-white">Update Site</NavLink>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default SiteInfo;
