/* eslint-disable no-unused-vars */
import { NavLink, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const SiteFesibilty = () => {
  let { id } = useParams();
  const { user } = useAuth();
  const api_url = process.env.REACT_APP_API_URL;
  const [scroreBoard,setScroreBoard] = useState({})
  const [totalScore,setTotalScore] = useState(0)
  const [loading,setLoading] = useState(false)
  const [fetchedData, setFetchedData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
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
          setFetchedData(json.site);
          setScroreBoard(json.site.feasibility.scroreBoard);
          setTotalScore(json.site.feasibility.totalScore);
        } else {
          setFetchedData([]);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false)
      }
      finally{
        setLoading(false)
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, []);

  const labels = {
    populationDensity: "Population Density/Residential Area",
    houseRent: "House Rent/Income Level",
    marketProximity: "Market/Bazar/Shopping Mall/Other Brands",
    avgSales: "Avg. Sales of Departmental Stores",
    roadStatus: "Road Status",
    mosqueCount: "Mosque/Mandir/Girza",
    schoolCount: "School/College/University",
    bankCount: "Bank/Office/ATM BOOTH",
    competitorSales: "Competitor Presence with Avg Sales",
    transportAvailability: "CNG, Bus, Train Station/ Pick & Drop",
    frontFace: "Front Face",
    signboardVisibility: "Signboard Visibility",
    hotelCount: "Hotel & Restaurant & Hospital/ Club",
  };


  if(loading){
    return <p>Loading...</p>
  }


  return (
    <section className="partner accuisition text-xs md:text-sm   px-1 font-poppins ">
      <div className="p-4 md:p-6  mx-auto bg-white rounded-xl shadow-lg space-y-4">
        {/* <h2 className="text-2xl font-bold text-gray-900 text-center">
          Site Feasibility
        </h2> */}
        <div className="flex justify-between items-center">
          <div className="text-center space-x-2 flex justify-start items-center">
            <span className="text-sm sm:text-lg font-semibold">Score:</span>
            <span className="text-sm sm:text-lg font-bold text-green-600">
              {totalScore.toFixed(3)}
            </span>
          </div>
          <NavLink to={`/site/updateFeasibilty/${id}`}  className="">
            <BiEdit className="h-6 w-6 hover:text-teal-700 cursor-pointer" />
          </NavLink>
        </div>
        {scroreBoard?.populationDensity ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.keys(scroreBoard).map((key) => (
            <div key={key} className="bg-gray-50 p-4  shadow">
              <h3 className=" text-sm md:text-lg font-semibold text-gray-800 capitalize">
                {labels[key]}
              </h3>
              <p className="text-sky-700 mt-3 text-base font-semibold ">
                {scroreBoard[key].value}
              </p>
            </div>
          ))}
        </div>
        :

        <div className="p-4 text-center text-lg font-medium text-teal-800" >No Data Recorded Yet</div>
        
      }
      </div>
    </section>
  );
};

export default SiteFesibilty;
