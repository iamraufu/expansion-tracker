/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";
import { ImSpinner2 } from "react-icons/im";

const InvestorDetails = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const { user } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api_url}/investor/${id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: user.token,
          },
          //   body: JSON.stringify({  })
        });
        const json = await response.json();
        console.log(json);
        if (json.status) {
          setData(json.investor);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <ImSpinner2 className="w-14 h-1/4 animate-spin " />
      </div>
    );
  }

  console.log({ data });

  return (
    <section className="partner accuisition text-sm  lg:px-1 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font-medium text-base  mt-5 gap-3">
        
        <img
          src={partnerAcquisitionIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm  md:text-base font-semibold ">
          Investor: <span className="capitalize">{data?.name}</span>
        </p>
      </div>

      <div className="details-tab mt-4">
        <h1 className="underline underline-offset-2 text-base">
          Partner Details
        </h1>
        <div className="details-section flex flex-col my-4 gap-4">
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Id:</h1>
            <p className="">{data?.customId}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Name:</h1>
            <p className="capitalize">{data?.name}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Phone:</h1>
            <p className="capitalize">{data?.phone}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Email:</h1>
            <p className="capitalize">{data?.email}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Age:</h1>
            <p className="capitalize">{data?.age}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Gender:</h1>
            <p className="capitalize">{data?.gender}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Profession:</h1>
            <p className="capitalize">{data?.profession}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Profession Nature:</h1>
            <p className="capitalize">{data?.profession_nature}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Address:</h1>
            <p className="capitalize">{data?.address}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">Division:</h1>
            <p className="capitalize">{data?.division}</p>
          </div>
          <div className="flex gap-2 p-1">
            <h1 className="w-40 font-medium">District:</h1>
            <p className="capitalize">{data?.district}</p>
          </div>
          <div className="flex gap-2 p-1 w-full">
            <h1 className="w-40 font-medium">Thana/Upazila:</h1>
            <p className="capitalize">{data?.upazila}</p>
          </div>
          <div className="flex gap-2 p-1 w-full">
            <h1 className="w-40 font-medium">Inv. Budget:</h1>
            <p className="capitalize">{data?.investmentBudget}</p>
          </div>
          <div className="flex gap-2 p-1 w-full">
            <h1 className="w-40 font-medium">Possible Inv. Date:</h1>
            <p className="capitalize">
              {new Date(data?.possibleInvestmentDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-start gap-2 p-1 w-full">
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
          <div className="flex gap-2 p-1 w-full">
            <h1 className="w-40 font-medium">Created By:</h1>
            <p className="capitalize">{data?.createdBy?.name}</p>
          </div>
          <div className="flex gap-2 p-1 w-full">
            <h1 className="w-40 font-medium">Created On:</h1>
            <p className="capitalize">
              {new Date(data?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <NavLink to={`/investor/update/${id}`}  className="w-full block text-center my-4 bg-teal-500 py-3 rounded text-white">Update</NavLink>
      </div>
    </section>
  );
};

export default InvestorDetails;
