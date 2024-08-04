/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import siteStoreIcon from "../../assets/icons/landmark.png";
import toast, { Toaster } from "react-hot-toast";
import LocationsData from "../../data/Locations.json";
import Map from ".././Map";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useActivity from "../../hooks/useActivity";
import { ImSpinner2 } from "react-icons/im";


const UpdateSite = () => {
  const [landlords, setLandlords] = useState([]);
  let { id } = useParams();
  const [fetchedData,setFetchedData] = useState([])
  const [missingFields, setMissingFields] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [formCoordinates, setFormCoordinates] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    sqft: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    status: "site found",
    landlords: landlords,
    siteHistory: [
      { status: "site found", startTime: new Date(), endTime: new Date() },
    ],
    createdBy: user._id,
    location: [],
  };

  //   let { id } = useParams();
  const [data, setData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  // eslint-disable-next-line
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const { createActivity } = useActivity();


  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === "landlords") {
      setValues({
        ...values,
        [name]: [value],
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  const isFieldMissing = (fieldName) => {
    return missingFields.includes(fieldName);
  };

  const toggleScroll = () => {
    setScrollEnabled(!scrollEnabled);
    document.body.style.overflow = scrollEnabled ? "hidden" : "auto";
  };

  const handleMapModal = () => {
    console.log("clicked");
    scrollToTop();
    toggleScroll();
    setIsMapOpen(!isMapOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };


  const formatDate = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };


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
          setFetchedData(json.site);
          setValues({
            name: json.site.name,
            sqft: json.site.sqft,
            frontFace: json.site.frontFace,
            askingAdvance: json.site.askingAdvance,
            askingRent: json.site.askingRent,
            premisesStructure: json.site.premisesStructure,

            estimatedHandoverDate: formatDate(
              new Date(json.site.estimatedHandoverDate)
            ),
            division: json.site.division,
            district: json.site.district,
            upazila: json.site.upazila,
            landlords: [json.site.landlords[0]._id],
            // thana: json.site.name,
            address: json.site.address,
            location: [],
          });

          setFormCoordinates({
            latitude: json.site.location.latitude,
            longitude: json.site.location.longitude,
          });

          setSelectedDivision(json.site.division)
          setSelectedDistrict(json.site.district)
          setSelectedUpazila(json.site.upazila)
        } else {
          setFetchedData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // eslint-disable-next-line
  }, []);


  const filter = user.role === "admin"? {} : user.role !== "manager"?{ createdBy: user._id} :  {createdBy:user.employees}
  //   console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api_url}/landlord`, {
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
          setData(json.landlords);
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

  // Filter districts based on selected division
  const filteredDistricts = LocationsData.filter(
    (item) => item.Division === selectedDivision
  );

  // Filter upazilas based on selected district
  const filteredUpazilas = LocationsData.filter(
    (item) => item.Zila === selectedDistrict
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMissingFields([]);

    // // Basic validation
    const requiredFields = [
      "name",
      //   "email",
      "landlords",
      "sqft",
      "frontFace",
      "askingAdvance",
      "askingRent",
      "premisesStructure",
      "estimatedHandoverDate",
      "division",
      "district",
      "upazila",
      // "thana",
      "address",
      //   "location",
    ];
    // console.log(values);
    let missing = requiredFields.filter((field) => !values[field]);
    // || values[field]?.length === 0 || !formCoordinates
    if (values["landlords"]?.length === 0) {
      missing.push("landlords");
    }
    if (!formCoordinates) {
      missing.push("location");
    }

    // console.log({ missing });
    if (missing.length > 0) {
      setMissingFields(missing);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${api_url}/site/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
        body: JSON.stringify({ ...values, location: formCoordinates }),
      });

      const responseData = await response.json();
      if (responseData.status) {
        await createActivity(
          user._id,
          "site_update",
          `${user.name} updated an site named: ${values.name}!`
        );
        console.log(responseData);
        navigate(-1);
      } else {
        console.log(response);
        console.error("Failed to submit form");
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("There is a problem with the server!");
    }
  };

  


  if (!data) {
    return <p>Loading...</p>;
  }

  if (!fetchedData) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <ImSpinner2 className="w-14 h-1/4 animate-spin " />
      </div>
    );
  }
  return (
    <section className="padding-x">
      <div className="addInvestor font-poppins max-container">
        <div className="page-title pb-3 border-b-2 border-b-slate-500  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
          <img
            src={siteStoreIcon}
            alt="partner Acquisition Icon"
            className="md:w-8 md:h-8 w-6 h-6"
          />
          <p className="text-sm md:text-base font-semibold ">Update Site</p>
        </div>

        <form className="w-full max-w-lg mx-auto my-4 text-xs ">
          <div className="grid grid-cols-1 gap-4">
            {/* landlord */}
            <div className="flex items-center">
              <label htmlFor="landlords" className="mr-2">
                Landlord:
              </label>
              <select
                id="landlords"
                name="landlords"
                value={values.landlords.length > 0 ? values.landlords[0] : ""}
                onChange={handleChange}
                className={`input-field ${
                  isFieldMissing("landlords")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              >
                <option value="">Select Landlord</option>
                {data.map((option, index) => (
                  <option
                    className="capitalize"
                    key={index}
                    value={option._id}
                  >
                    {option.customId} - {option.name}
                  </option>
                ))}
              </select>
            </div>
            {/* name */}
            <div className="flex items-center">
              <label htmlFor="name" className="mr-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Name"
                className={`input-field ${
                  isFieldMissing("name")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* sqft */}
            <div className="flex items-center">
              <label htmlFor="sqft" className="mr-2">
                Sqft:
              </label>
              <input
                type="number"
                id="sqft"
                name="sqft"
                value={values.sqft}
                onChange={handleChange}
                placeholder="Sqft"
                className={`input-field ${
                  isFieldMissing("sqft")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* frontFace */}
            <div className="flex items-center">
              <label htmlFor="frontFace" className="mr-2">
                Front face:
              </label>
              <input
                type="number"
                name="frontFace"
                value={values.frontFace}
                onChange={handleChange}
                placeholder="Front Face"
                className={`input-field ${
                  isFieldMissing("frontFace")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* askingAdvance */}
            <div className="flex items-center">
              <label htmlFor="askingAdvance" className="mr-2">
                Asking Advance
              </label>
              <input
                type="number"
                name="askingAdvance"
                value={values.askingAdvance}
                onChange={handleChange}
                placeholder="Asking advance"
                className={`input-field ${
                  isFieldMissing("askingAdvance")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* askingRent */}
            <div className="flex items-center">
              <label htmlFor="askingRent" className="mr-2">
                Asking Rent
              </label>
              <input
                type="number"
                name="askingRent"
                value={values.askingRent}
                onChange={handleChange}
                placeholder="Asking Rent"
                className={`input-field ${
                  isFieldMissing("askingRent")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* premisesStructure */}
            <div className="flex items-center">
              <label htmlFor="premisesStructure" className="mr-2">
                Premises Structure
              </label>
              <input
                type="text"
                name="premisesStructure"
                value={values.premisesStructure}
                onChange={handleChange}
                placeholder="Premises Structure"
                className={`input-field ${
                  isFieldMissing("premisesStructure")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* investmentBudget */}
            <div className="flex items-center">
              <label htmlFor="estimatedHandoverDate" className="mr-2">
                Estimated Handover Date
              </label>
              <input
                type="date"
                name="estimatedHandoverDate"
                value={values.estimatedHandoverDate}
                onChange={handleChange}
                placeholder="Estimated Handover Date"
                className={`input-field ${
                  isFieldMissing("estimatedHandoverDate")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* division */}
            <div className="flex items-center">
              <label htmlFor="division" className="mr-2">
                Division:
              </label>
              <select
                name="division"
                value={values.division}
                onChange={(e) => {
                  handleChange(e);
                  setSelectedDivision(e.target.value);
                }}
                className={`input-field ${
                  isFieldMissing("division")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              >
                <option value="">Select Division</option>
                {/* {divisionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
                {Array.from(new Set(LocationsData.map((item) => item.Division))).map(
                  (division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* district */}
            <div className="flex items-center">
              <label htmlFor="district" className="mr-2">
                District:
              </label>
              <select
                name="district"
                value={values.district}
                onChange={(e) => {
                  handleChange(e);
                  setSelectedDistrict(e.target.value);
                }}
                className={`input-field ${
                  isFieldMissing("district")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              >
                <option value="">Select District</option>
                {/* {districtOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
                {Array.from(
                  new Set(filteredDistricts.map((item) => item.Zila))
                ).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* upazila */}
            <div className="flex items-center">
              <label htmlFor="upazila" className="mr-2">
                Upazila/Thana:
              </label>
              <select
                name="upazila"
                value={values.upazila}
                onChange={(e) => {
                  handleChange(e);
                  setSelectedUpazila(e.target.value);
                }}
                className={`input-field ${
                  isFieldMissing("upazila")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              >
                <option value="">Select Upazila/Thana</option>
                {Array.from(
                  new Set(filteredUpazilas.map((item) => item.Upazila))
                ).map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="address" className="mr-2">
                Address:
              </label>
              <textarea
                name="address"
                value={values.address}
                onChange={handleChange}
                placeholder="Address"
                className={`input-field ${
                  isFieldMissing("address")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            <div
              onClick={() => handleMapModal()}
              className={`flex items-center cursor-pointer `}
            >
              <label htmlFor="location" className="mr-2">
                Location:
              </label>
              <div
                className={`flex items-center justify-center rounded text-white gap-1 bg-green-500 w-full p-2 ${
                  isFieldMissing("location") ? "border border-red-500" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>

                <p> {formCoordinates
                  ? `Long ${formCoordinates?.longitude
                      ?.toString()
                      .slice(0, 7)}... Lat 
                      ${formCoordinates.latitude
                         ?.toString()
                      .slice(0, 7)}...
                      `
                  : "Set Location on Map"}</p>
              </div>
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="mr-2">
                Longitude:
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formCoordinates?.longitude}
                onChange={(e)=>setFormCoordinates({...formCoordinates, longitude:e.target.value})}
                placeholder="longitude"
                className={`input-field border-[#8D8D8D]`}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="name" className="mr-2">
                Latitude:
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formCoordinates?.latitude}
                onChange={(e)=>setFormCoordinates({...formCoordinates, latitude:e.target.value})}
                placeholder="latitude"
                className={`input-field border-[#8D8D8D]`}
              />
            </div>
            <button
              onClick={(e) => handleSubmit(e)}
              className="bg-primary text-white p-3 font-medium rounded"
            >
              Save & Continue
            </button>
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </form>
      </div>
      
      {isMapOpen && (
        <div className="flex absolute top-0 left-0 w-full  justify-center items-center h-screen">
          <div className=" w-full h-screen   bg-black/30 z-50">
            <Map
              handleMapModal={handleMapModal}
              setFormCoordinates={setFormCoordinates}
              formCoordinates={formCoordinates}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default UpdateSite;
