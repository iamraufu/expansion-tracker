/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";
import toast, { Toaster } from "react-hot-toast";
import LocationsData from "../data/Locations.json"; 
import proffessionData from "../data/proffessions.json"; 

import Map from "./Map";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useActivity from "../hooks/useActivity";

const AddInvestor = () => {
  const { user } = useAuth();
  const [submitLoad, setSubmitLoad] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    age: "",
    dob: "",
    gender: "",
    profession: "",
    profession_nature: "",
    education: "",
    investmentBudget: "",
    possibleInvestmentDate: "",
    division: "",
    district: "",
    upazila: "",
    // thana: "",
    address: "",
    createdBy: user._id,
    location: [],
  };
  const api_url = process.env.REACT_APP_API_URL;
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [missingFields, setMissingFields] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedProffesion, setSelectedProffesion] = useState("");
  // eslint-disable-next-line
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const { createActivity } = useActivity();

  const navigate = useNavigate();

  const [formCoordinates, setFormCoordinates] = useState(null);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const professionOptions = [
    { label: "Business Man", value: "business man" },
    { label: "Service Holder", value: "service holder" },
    { label: "N/A", value: "N/A" },
  ];

  const educationOptions = [
    { label: "JSC", value: "jsc" },
    { label: "SSC", value: "ssc" },
    { label: "HSC", value: "hsc" },
    { label: "Bachelors", value: "bachelors" },
    { label: "Masters", value: "masters" },
    { label: "Diploma", value: "diploma" },
    { label: "N/A", value: "N/A" },
  ];

  const toggleScroll = () => {
    setScrollEnabled(!scrollEnabled);
    document.body.style.overflow = scrollEnabled ? "hidden" : "auto";
  };

  const isValidPhoneNumber = (phone) => {
    // Regex for Bangladeshi phone numbers
    const phoneRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleMapModal = () => {
    // console.log("clicked");
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoad(true);
    setMissingFields([]);

    // Basic validation
    const requiredFields = [
      "name",
      // "email",
      "phone",
      // "age",
      // "dob",
      "gender",
      "profession",
      "profession_nature",
      "education",
      "investmentBudget",
      "possibleInvestmentDate",
      "division",
      "district",
      "upazila",
      // "thana",
      "address",
      // "location",
    ];
    // console.log(values);

    const isValidPhone = isValidPhoneNumber(values.phone);

    if (!isValidPhone) {
      toast.error("Invalid phone number");
      setSubmitLoad(false);
      return;
    }

    const missing = requiredFields.filter((field) => !values[field]);

    if (missing.length > 0) {
      setMissingFields(missing);
      // if (!formCoordinates) {
      //   toast.error("Please Enter Location Coordinates");
      // }
      toast.error("Please fill in all required fields.");
      setSubmitLoad(false);
      return;
    }

    try {
      const response = await fetch(`${api_url}/Investor/register`, {
        method: "POST",
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
          "investor_create",
          `${user.name} created an investor named: ${values.name}!`
        );
        console.log(responseData);
        setSubmitLoad(true);
        navigate(-1);
      } else {
        console.log(response);
        console.error("Failed to submit form");
        toast.error(responseData.message);
        setSubmitLoad(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("There is a problem with the server!");
      setSubmitLoad(false);
    }
  };

  // console.log(missingFields);

  const isFieldMissing = (fieldName) => {
    return missingFields.includes(fieldName);
  };

  // Filter districts based on selected division
  const filteredDistricts = LocationsData.filter(
    (item) => item.Division === selectedDivision
  );

  // Filter upazilas based on selected district
  const filteredUpazilas = LocationsData.filter(
    (item) => item.Zila === selectedDistrict
  );


  // Filter upazilas based on selected district
  const profNature = proffessionData.filter(
    (item) => item.profession === selectedProffesion
  );

  const calculateMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return maxDate.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };

  const maxDate = calculateMaxDate();

  return (
    <section className="addInvestor   lg:px-1 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-500  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
        <img
          src={partnerAcquisitionIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm md:text-base font-semibold ">
          Partner Acquisition - Add Investor
        </p>
      </div>

      <form className="w-full max-w-lg mx-auto my-4 text-sm ">
        <div className="grid grid-cols-1 gap-4">
          {/* type */}
          <div className="flex items-center">
            <label htmlFor="type" className="mr-2">
              Type:
            </label>
            <p className=" py-1  rounded  w-full">Investor</p>
          </div>
          {/* name */}
          <div className="flex items-center">
            <label htmlFor="name" className="mr-2">
              Name:*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Name"
              className={`input-field ${
                isFieldMissing("name") ? "border-red-500" : "border-[#8D8D8D] "
              }`}
            />
          </div>
          {/* email */}
          <div className="flex items-center">
            <label htmlFor="name" className="mr-2">
              Email:*
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Email"
              className={`input-field ${
                isFieldMissing("email") ? "border-red-500" : "border-[#8D8D8D] "
              }`}
            />
          </div>
          {/* phone */}
          <div className="flex items-center">
            <label htmlFor="phone" className="mr-2">
              Phone:*
            </label>
            <input
              type="number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={`input-field ${
                isFieldMissing("phone") ? "border-red-500" : "border-[#8D8D8D] "
              }`}
            />
          </div>
          {/* age */}
          <div className="flex items-center">
            <label htmlFor="age" className="mr-2">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={values.age}
              onChange={handleChange}
              placeholder="Age"
              className={`input-field ${
                isFieldMissing("age") ? "border-red-500" : "border-[#8D8D8D] "
              }`}
            />
          </div>
          {/* investmentBudget */}
          <div className="flex items-center">
            <label htmlFor="dob" className="mr-2">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              value={values.dob}
              onChange={handleChange}
              max={maxDate} // Set the max attribute to the date 10 years ago
              placeholder="dob"
              className={`input-field ${
                isFieldMissing("dob") ? "border-red-500" : "border-[#8D8D8D] "
              }`}
            />
          </div>
          {/* gender */}
          <div className="flex items-center">
            <label htmlFor="gender" className="mr-2">
              Gender:*
            </label>
            <select
              id="gender"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              className={`input-field ${
                isFieldMissing("gender")
                  ? "border-red-500"
                  : "border-[#8D8D8D] "
              }`}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {/* profession */}
          <div className="flex items-center">
            <label htmlFor="profession" className="mr-2">
              Profession:*
            </label>
            <select
              name="profession"
              value={values.profession}
              onChange={(e) => {
                handleChange(e)
                setSelectedProffesion(e.target.value)
              }}
              className={`input-field ${
                isFieldMissing("profession")
                  ? "border-red-500"
                  : "border-[#8D8D8D] "
              }`}
            >
              <option value="">Select Profession</option>
              {Array.from(
                new Set(proffessionData.map((item) => item.profession))
              ).map((option) => (
                <option className="capitalize" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* profession nature */}
          <div className="flex items-center">
            <label htmlFor="profession_nature" className="mr-2">
              Nature:*
            </label>
            <select
              name="profession_nature"
              value={values.profession_nature}
              onChange={(e) => {
                handleChange(e)
              }}
              className={`input-field ${
                isFieldMissing("profession_nature")
                  ? "border-red-500"
                  : "border-[#8D8D8D] "
              }`}
            >
              <option value="">Select Profession nature</option>
              {Array.from(
                new Set(profNature.map((item) => item.nature))
              ).map((option) => (
                <option className="capitalize" key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* education */}
          <div className="flex items-center">
            <label htmlFor="education" className="mr-2">
              Education:*
            </label>
            <select
              name="education"
              value={values.education}
              onChange={handleChange}
              className={`input-field ${
                isFieldMissing("education")
                  ? "border-red-500"
                  : "border-[#8D8D8D] "
              }`}
            >
              <option value="">Select Education</option>
              {educationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* investmentBudget */}
          <div className="flex items-center">
            <label htmlFor="investmentBudget" className="mr-2">
              Investment Budget:*
            </label>
            <input
              type="number"
              name="investmentBudget"
              value={values.investmentBudget}
              onChange={handleChange}
              placeholder="Investment Budget"
              className={`input-field ${
                isFieldMissing("investmentBudget")
                  ? "border-red-500"
                  : "border-[#8D8D8D] "
              }`}
            />
          </div>

          {/* investmentBudget */}
          <div className="flex items-center">
            <label htmlFor="possibleInvestmentDate" className="mr-2">
              Possible Inv. Date:*
            </label>
            <input
              type="date"
              name="possibleInvestmentDate"
              value={values.possibleInvestmentDate}
              onChange={handleChange}
              placeholder="possibleInvestmentDate"
              className={`input-field ${
                isFieldMissing("possibleInvestmentDate")
                  ? "border-red-500"
                  : "border-[#8D8D8D] "
              }`}
            />
          </div>

          {/* division */}
          <div className="flex items-center">
            <label htmlFor="division" className="mr-2">
              Division:*
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

              {Array.from(
                new Set(LocationsData.map((item) => item.Division))
              ).map((division, index) => (
                <option key={index} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>

          {/* district */}
          <div className="flex items-center">
            <label htmlFor="district" className="mr-2">
              District:*
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
              Upazila/Thana:*
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
              Address:*
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
            className="flex items-center cursor-pointer"
          >
            <label htmlFor="location" className="mr-2">
              Location:
            </label>
            <div className="flex items-center justify-center rounded text-white gap-1 bg-green-500 w-full p-2">
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

              <p>
                {formCoordinates
                  ? `Long ${formCoordinates?.longitude
                      ?.toString()
                      .slice(0, 7)}... Lat 
                      ${formCoordinates.latitude?.toString().slice(0, 7)}...
                      `
                  : "Set Location on Map"}
              </p>
            </div>
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
              onChange={(e) =>
                setFormCoordinates({
                  ...formCoordinates,
                  latitude: e.target.value,
                })
              }
              placeholder="latitude"
              className={`input-field border-[#8D8D8D]`}
            />
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
              onChange={(e) =>
                setFormCoordinates({
                  ...formCoordinates,
                  longitude: e.target.value,
                })
              }
              placeholder="longitude"
              className={`input-field border-[#8D8D8D]`}
            />
          </div>
          

          <button
            onClick={(e) => handleSubmit(e)}
            disabled={submitLoad}
            className="bg-primary text-white p-3 font-medium rounded"
          >
            {submitLoad ? "Loading..." : "Save and Continue"}
          </button>
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      </form>

      {/* <div id="map"></div> */}
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

export default AddInvestor;
