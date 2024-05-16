import React, { useEffect, useState } from "react";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";



const Partners = () => {
  const [data, setData] = useState(null); 
  const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL
  const { user } = useAuth();

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`${api_url}/services/partners`, {
              method: "POST",
              headers: {
                "Content-type": "application/json",
                authorization: user.token,
              },
              body: JSON.stringify({  })
            });
            const json = await response.json();
            console.log(json);
            if (json.status) {
                    setData(json.data)
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


  if(data === null){
    return <p>Loading...</p>
  }



  return (
    <section className="partner-accuisition text-sm  lg:px-1 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
        <img
          src={partnerAcquisitionIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm  md:text-base font-semibold ">
          Partner Acquisition
        </p>
      </div>

      <div className="overflow-x-auto text-xs md:text-sm rounded-md mt-4 border-2 border-slate-900 h-[60dvh]">
        <table className="w-full table-auto border-0 ">
          <thead className="bg-secondary text-white text-left">
            <tr className="bg-secondary">
              <th className=" px-4 py-2">ID</th>
              <th className=" px-4 py-2">Name</th>
              <th className=" px-4 py-2">Phone Number</th>
              <th className=" px-4 py-2">Type</th>
            </tr>
          </thead>
          <tbody className="font-medium ">
            {data.map((partner) => (
              <tr className="odd:bg-slate-100" key={partner._id}>
                <td onClick={() => {partner.type.toLowerCase() === "landlord"? navigate(`/landlord/${partner._id}`):(navigate(`/investor/${partner._id}`))}} className=" px-4 py-2 cursor-pointer text-secondary underline font-medium">
                  {partner.customId}
                </td>
                <td className=" px-4 py-2">{partner.name}</td>
                <td className=" px-4 py-2">{partner.phone}</td>
                <td className=" px-4 py-2 capitalize">{partner.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-evenly items-center gap-2 mt-4 text-xs md:text-sm">
        <button onClick={() => navigate("/addInvestor")} className="w-full px-3 py-3 rounded-md bg-green-600 text-white font-medium flex justify-center items-center gap-2">
          <IoMdAddCircle className="w-5 h-5" />
          <p>Add New Investor</p>
        </button>
        <button onClick={() => navigate("/addLandlord")} className="w-full  px-3 py-3 rounded-md bg-blue-600 text-white font-medium flex justify-center items-center gap-2">
          <IoMdAddCircle  className="w-5 h-5"/>
          <p>Add New Landlord</p>
        </button>
      </div>
    </section>
  );
};

export default Partners;
