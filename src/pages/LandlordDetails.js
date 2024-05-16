import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";

const LandlordDetails = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const { user } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api_url}/landlord/${id}`, {
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
          setData(json.landlord);
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

  // console.log({data});
  if(!data){
    return <p>Loading</p>
  }

  return (
    <section className="partner accuisition text-sm  lg:px-1 md:px-18 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font-medium text-base  mt-5 gap-3">
        <img
          src={partnerAcquisitionIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm  md:text-base font-semibold ">
          Landlord: <span className="capitalize">{data.name}</span>
        </p>
      </div>

      <div className="details-tab mt-4">
        <h1 className="underline underline-offset-2 text-base">Partner Details </h1>
        <div className="details-section flex flex-col my-4 gap-2">
          <div className="flex gap-2 w-full">
            <h1 className="w-32 font-medium">Id:</h1>
            <p className="">{data.customId}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Name:</h1>
            <p className="capitalize">{data.name}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Phone:</h1>
            <p className="capitalize">{data.phone}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Email:</h1>
            <p className="capitalize">{data.email}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Age:</h1>
            <p className="capitalize">{data.age}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Gender:</h1>
            <p className="capitalize">{data.gender}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Address:</h1>
            <p className="capitalize">{data.address}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">Division:</h1>
            <p className="capitalize" >{data.division}</p>
          </div>
          <div className="flex gap-2">
            <h1 className="w-32 font-medium">District:</h1>
            <p className="capitalize">{data.district}</p>
          </div>
          <div className="flex gap-2 w-full">
            <h1 className="w-32 font-medium">Thana/Upazila:</h1>
            <p className="capitalize">{data.upazila}</p>
          </div>
          {/* <div className="flex gap-2 w-full">
            <h1 className="w-32 font-medium">Location:</h1>
            <p className="capitalize underline text-blue-700">{data.location.latitude}, {data.location.longitude}</p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default LandlordDetails;
