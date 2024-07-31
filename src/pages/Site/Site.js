import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";

import partnerAcquisitionIcon from "../../assets/icons/landmark.png";
import { ImSpinner2 } from "react-icons/im";
import useAuth from "../../hooks/useAuth";

const Site = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [investors, setInvestors] = useState(null);
  const [landlords, setLandlords] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const { user } = useAuth();

  const location = useLocation();
  const { pathname } = location;

  // console.log(user);
  // const navigate = useNavigate();

  const filter =
    user.role === "admin"
      ? {}
      : user.role !== "manager"
      ? { createdBy: user._id }
      : { createdBy: user.employees };

  const fetchData = async () => {
    try {
      const response = await fetch(`${api_url}/services/site/${id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: user.token,
        },
        body: JSON.stringify(filter),
      });
      const json = await response.json();
      console.log(json);
      if (json.status) {
        setData(json.site);
        setLandlords(json.landlords);
        setInvestors(json.investors);
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

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <ImSpinner2 className="w-14 h-1/4 animate-spin " />
      </div>
    );
  }

  // console.log({ data });

  return (
    <section className="partner accuisition text-sm  lg:px-1 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font- md:font-medium text-base  pt-5 gap-3 font-poppins">
        <img
          src={partnerAcquisitionIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm  md:text-base font-semibold ">
          Site Details: <span className="capitalize">{data?.customId} - {data?.name}</span>
        </p>
      </div>

      <nav className="text-sm font-medium text-center text-gray-500 border-b-2 border-slate-900 mt-4">
        <ul className="flex flex-wrap">
          <div className="me-2">
            <NavLink
              to={`/site/${id}/info`}
              className={`inline-block py-3 px-4 ${
                pathname.includes("info")
                  ? "text-white text-xs bg-secondary border-2 border-b-secondary border-slate-900"
                  : ""
              } border-b-2  rounded-t-lg uppercase`}
            >
              Info
            </NavLink>
          </div>
          <div className="me-2">
            <NavLink
              to={`/site/${id}/history`}
              className={`inline-block py-3 px-4 ${
                pathname.includes("history")
                  ? "text-white text-xs bg-secondary border-2 border-b-secondary border-slate-900"
                  : ""
              } border-b-2  rounded-t-lg uppercase`}
            >
              History
            </NavLink>
          </div>
          <div className="me-2">
            <NavLink
              to={`/site/${id}/documents`}
              className={`inline-block py-3 px-4 ${
                pathname.includes("documents")
                  ? "text-white text-xs bg-secondary border-2 border-b-secondary border-slate-900"
                  : ""
              } border-b-2  rounded-t-lg uppercase`}
            >
              Documents
            </NavLink>
          </div>
          {/* <div className="me-2">
                            <NavLink to={"/approvals/stogrn"} className={`inline-block p-4 ${pathname.includes("stogrn") ? "text-blue-600 border-blue-600" : ""} border-b-2  rounded-t-lg uppercase`}>STO GRN</NavLink>
                        </div> */}
          {/* <div className="me-2">
                            <NavLink to={"/report/stock"} className={`inline-block p-4 ${pathname.includes("stock") ? "text-blue-600 border-blue-600 " : ""} border-b-2  rounded-t-lg uppercase`} aria-current="page">Stock</NavLink>
                        </div> */}
        </ul>
      </nav>

      <>
        <Outlet
          context={{ outletData: data, landlords, investors, fetchData }}
        />
      </>
    </section>
  );
};

export default Site;
