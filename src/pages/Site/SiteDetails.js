import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import partnerAcquisitionIcon from "../../assets/icons/landmark.png";
import { ImSpinner2 } from "react-icons/im";


const SiteDetails = () => {
    let { id } = useParams();
    const [data, setData] = useState(null); 
    const api_url = process.env.REACT_APP_API_URL
    const { user } = useAuth();

    // console.log(user);
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api_url}/site/${id}`, {
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
                        setData(json.site)
                }else{
                  setData([])
                }
            }
            catch (error) {
                console.error('Error fetching data:', error);
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


    console.log({data});

  return (
    <section className="partner accuisition text-sm  lg:px-1 sm:px-16 px-5 font-poppins max-container ">
    <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font-medium text-base  mt-5 gap-3">
      <img
        src={partnerAcquisitionIcon}
        alt="partner Acquisition Icon"
        className="md:w-8 md:h-8 w-6 h-6"
      />
      <p className="text-sm  md:text-base font-semibold ">
        
        Site: <span className="capitalize">{data?.customId}</span>
      </p>
    </div>

    <div className="details-tab mt-4">
      <h1 className="underline underline-offset-2 text-base">Site Details </h1>
      <div className="details-section flex flex-col my-4 gap-4">
        <div className="flex gap-2 w-full">
          <h1 className="w-40 font-medium">Id:</h1>
          <p className="">{data?.customId}</p>
        </div>
        <div className="flex gap-2">
          <h1 className="w-40 font-medium">Name:</h1>
          <p className="capitalize">{data?.name}</p>
        </div>
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
          <p className="capitalize">{new Date(data?.estimatedHandoverDate).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-2">
          <h1 className="w-40 font-medium">Address:</h1>
          <p className="capitalize">{data?.address}</p>
        </div>
        <div className="flex gap-2">
          <h1 className="w-40 font-medium">Division:</h1>
          <p className="capitalize" >{data?.division}</p>
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
        {/* <div className="flex gap-2 w-full">
          <h1 className="w-40 font-medium">Inv. Budget:</h1>
          <p className="capitalize">{data?.investmentBudget}</p>
        </div> */}
       
        <div className="flex gap-2 w-full">
          <h1 className="w-40 font-medium">Location:</h1>
          <p className="capitalize underline text-blue-700">{data?.location?(`${data?.location?.latitude},${data?.location?.longitude}`):"N/A"}</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default SiteDetails