import React, { useState } from "react";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";

// import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import Map from "./Map";

const AddInvestor = () => {


  const [scrollEnabled, setScrollEnabled] = useState(true);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    profession: "",
    education: "",
    investmentBudget: "",
    possibleInvestmentDate: "",
    division: "",
    district: "",
    upazila: "",
    thana: "",
    address: "",
    sites: "",
    location: []
  };

  const [formCoordinates, setFormCoordinates] = useState(null);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const professionOptions = [
    { label: "Engineer", value: "engineer" },
    { label: "Doctor", value: "doctor" },
    { label: "Teacher", value: "teacher" },
  ];

  const educationOptions = [
    { label: "ssc", value: "ssc" },
    { label: "hsc", value: "hsc" },
    { label: "bachelors", value: "bachelors" },
  ];

  const divisionOptions = [
    { label: "Dhaka", value: "dhaka" },
    { label: "Chittagong", value: "chittagong" },
    { label: "Rajshahi", value: "rajshahi" },
    // Add more options as needed
  ];

  const districtOptions = [
    { label: "Dhaka", value: "dhaka" },
    { label: "Chittagong", value: "chittagong" },
    { label: "Rajshahi", value: "rajshahi" },
    // Add more options as needed
  ];

  const upazilaOptions = [
    { label: "Gulshan", value: "gulshan" },
    { label: "Mohammadpur", value: "mohammadpur" },
    { label: "Dhanmondi", value: "dhanmondi" },
    // Add more options as needed
  ];

  const thanaOptions = [
    { label: "Gulshan-1", value: "gulshan_1" },
    { label: "Gulshan-2", value: "gulshan_2" },
    { label: "Mohammadpur", value: "mohammadpur" },
    // Add more options as needed
  ];

  const toggleScroll = () => {
    setScrollEnabled(!scrollEnabled);
    document.body.style.overflow = scrollEnabled ? 'hidden' : 'auto';
  };


  const [values, setValues] = useState(initialValues);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleMapModal = () => {
    console.log("clicked");
    scrollToTop()
    toggleScroll()
    setIsMapOpen(!isMapOpen)
  };


    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };

  return (
    <section className="addInvestor   padding-x">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
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
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Name"
              className="input-field"
            />
          </div>
          {/* email */}
          <div className="flex items-center">
            <label htmlFor="name" className="mr-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Email"
              className="input-field"
            />
          </div>
          {/* phone */}
          <div className="flex items-center">
            <label htmlFor="phone" className="mr-2">
              Phone:
            </label>
            <input
              type="number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="input-field"
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
              className="input-field"
            />
          </div>
          {/* gender */}
          <div className="flex items-center">
            <label htmlFor="gender" className="mr-2">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              className="input-field"
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
              Profession:
            </label>
            <select
              name="profession"
              value={values.profession}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Profession</option>
              {professionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* education */}
          <div className="flex items-center">
            <label htmlFor="education" className="mr-2">
              Education:
            </label>
            <select
              name="education"
              value={values.education}
              onChange={handleChange}
              className="input-field"
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
              Investment Budget:
            </label>
            <input
              type="number"
              name="investmentBudget"
              value={values.investmentBudget}
              onChange={handleChange}
              placeholder="Investment Budget"
              className="input-field"
            />
          </div>

          {/* investmentBudget */}
          <div className="flex items-center">
            <label htmlFor="possibleInvestmentDate" className="mr-2">
              Possible Inv. Date:
            </label>
            <input
              type="date"
              name="possibleInvestmentDate"
              value={values.possibleInvestmentDate}
              onChange={handleChange}
              placeholder="possibleInvestmentDate"
              className="input-field"
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
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select division</option>
              {divisionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select district</option>
              {districtOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* upazila */}
          <div className="flex items-center">
            <label htmlFor="upazila" className="mr-2">
              Upazila:
            </label>
            <select
              name="upazila"
              value={values.upazila}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select upazila</option>
              {upazilaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* thana */}
          <div className="flex items-center">
            <label htmlFor="thana" className="mr-2">
              Thana:
            </label>
            <select
              name="thana"
              value={values.thana}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select thana</option>
              {thanaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              className="input-field"
            />
          </div>
          <div onClick={()=>handleMapModal()} className="flex items-center cursor-pointer">
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

              <p>Set Location on Map</p>
            </div>
          </div>
          <button className="bg-primary text-white p-3 font-medium rounded">Save & Continue</button>
        </div>
      </form>
    

        {/* <div id="map"></div> */}
        {isMapOpen && (
          <div className="flex absolute top-0 left-0 w-full  justify-center items-center h-screen">
            <div className=" w-full h-screen   bg-black/30 z-50">
              <Map handleMapModal={handleMapModal} setFormCoordinates={setFormCoordinates} />
            </div>
          </div>
        )}
     
    </section>
  );
};

export default AddInvestor;
