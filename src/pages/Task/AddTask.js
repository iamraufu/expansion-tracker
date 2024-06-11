/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import siteStoreIcon from "../../assets/icons/activeTaskIcon.png";
import useAuth from "../../hooks/useAuth";
import useActivity from "../../hooks/useActivity";
import LocationsData from "../../data/Locations.json";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AddTask = () => {
  const { user } = useAuth();

  const initialValues = {
    startDateTime: "",
    endDateTime: "",
    division: "",
    district: "",
    upazila: "",
    task: "",
    createdBy: user._id,
    assignedTo: user._id,
    investor: null,
    landlord: null,
    site: null,
    equipment: [],
  };

  // const equipmentTypes = [
  //   { label: "ac", value: "ac" },
  //   { label: "it", value: "it" },
  //   { label: "gondola", value: "gondola" },
  //   { label: "display", value: "display" },
  //   { label: "furniture", value: "furniture" },
  // ];

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const [landlords, setLandlords] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [details, setDetails] = useState("");
  const { createActivity } = useActivity();
  const [isMultiDropDownOpen, setIsMultiDropDownOpen] = useState(false);
  const navigate = useNavigate();

  // const toggleDropdown = () => {
  //   setIsMultiDropDownOpen(!isMultiDropDownOpen);
  // };

  // const handleOptionClick = (value) => {
  //   let newSelectedOptions;
  //   if (selectedEquipments.includes(value)) {
  //     newSelectedOptions = selectedEquipments.filter(
  //       (option) => option !== value
  //     );
  //   } else {
  //     newSelectedOptions = [...selectedEquipments, value];
  //   }
  //   setSelectedEquipments(newSelectedOptions);
  //   setValues({ ...values, equipment: newSelectedOptions });
  // };

  useEffect(() => {
    const filter =
      user.role === "admin"
        ? {}
        : user.role !== "manager"
        ? { createdBy: user._id }
        : { createdBy: user.employees };

    const fetchData = async () => {
      try {
        const response = await fetch(`${api_url}/services/partners`, {
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
          setLandlords(json.data.filter((item) => item.type === "landlord"));
          setInvestors(json.data.filter((item) => item.type === "investor"));
          setSites(json.sites);
          setData(json.data);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [api_url, user._id, user.employees, user.role, user.token]);

  // Filter districts based on selected division
  const filteredDistricts = LocationsData.filter(
    (item) => item.Division === selectedDivision
  );

  // Filter upazilas based on selected district
  const filteredUpazilas = LocationsData.filter(
    (item) => item.Zila === selectedDistrict
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    let resetValues = {};
    switch (name) {
      case "task":
        resetValues = {
          investor: null,
          landlord: null,
          site: null,
          equipment: [],
        };
        break;
      case "division":
        resetValues = {
          district: "",
          upazila: "",
        };
        break;
      case "district":
        resetValues = {
          upazila: "",
        };
        break;
      default:
        break;
    }

    setValues({
      ...values,
      ...resetValues,
      [name]: value,
    });

    if (name === "startDateTime") {
      const startDate = value.split("T")[0];
      const endDateTimeInput = document.getElementById("endDateTime");
      endDateTimeInput.min = value;
      endDateTimeInput.max = `${startDate}T23:59`; // Ensures end date is the same date
    }

    setErrors({
      ...errors,
      [name]: "",
    });

    if (name === "division") {
      setSelectedDivision(value);
      setSelectedDistrict("");
      setSelectedUpazila("");
    }

    if (name === "district") {
      setSelectedDistrict(value);
      setSelectedUpazila("");
    }

    if (name === "task") {
      setSelectedTask(value);
      setSelectedEquipments([]);
    }
  };

  const taskOptions = [
    { label: "new site search", value: "new site search" },
    { label: "meeting with investor", value: "meeting with investor" },
    { label: "meeting with landlord", value: "meeting with landlord" },
    {
      label: "meeting both party / negotiation",
      value: "meeting both party / negotiation",
    },
    { label: "outlet opening", value: "outlet opening" },
    {
      label: "check outlet opening preparation",
      value: "check outlet opening preparation",
    },
    { label: "equipment order", value: "equipment order" },
    { label: "primary measurement", value: "primary measurement" },
  ];

  const validate = () => {
    let tempErrors = {};
    if (!values.startDateTime) tempErrors.startDateTime = true;
    if (!values.endDateTime) tempErrors.endDateTime = true;
    if (
      values.startDateTime &&
      values.endDateTime &&
      values.startDateTime >= values.endDateTime
    ) {
      tempErrors.endDateTime = true;
    }
    if (!values.division) tempErrors.division = true;
    if (!values.district) tempErrors.district = true;
    if (!values.upazila) tempErrors.upazila = true;
    if (!values.task) tempErrors.task = true;

    if (values.task === "meeting with investor" && !values.investor) {
      tempErrors.investor = true;
    }
    if (values.task === "meeting with landlord" && !values.landlord) {
      tempErrors.landlord = true;
    }
    if (
      values.task === "meeting both party / negotiation" &&
      (!values.investor || !values.landlord)
    ) {
      tempErrors.investor = true;
      tempErrors.landlord = true;
    }
    // if (values.task === "equipment order" && values.equipment.length === 0) {
    //   tempErrors.equipment = true;
    // }
    if (
      [
        "outlet opening",
        "check outlet opening preparation",
        "primary measurement",
      ].includes(values.task) &&
      !values.site
    ) {
      tempErrors.site = true;
    }

    setErrors(tempErrors);
    console.log(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      // Fetch user's current location
      // navigator.geolocation.getCurrentPosition(
      //   async (position) => {
      //     const { latitude, longitude } = position.coords;

      //     const updatedValues = {
      //       ...values,
      //       location: {
      //         latitude,
      //         longitude,
      //       },
      //     };

      //     console.log(updatedValues);

      //     // Submit the updated values
      //     try {
      //       const response = await fetch(`${api_url}/tasks/create`, {
      //         method: "POST",
      //         headers: {
      //           "Content-Type": "application/json",
      //           authorization: user.token,
      //         },
      //         body: JSON.stringify(updatedValues),
      //       });
      //       const json = await response.json();
      //       if (json.status) {
      //         console.log("Task created successfully:", json.data);
      //         await createActivity(
      //           user._id,
      //           "task_create",
      //           `${user.name} created an task : ${updatedValues.task}!`
      //         );
      //         navigate(-1);
      //         // Redirect or perform any other actions on successful creation
      //       } else {
      //         console.error("Error creating task:", json.message);
      //         toast.error(json.message);
      //       }
      //     } catch (error) {
      //       console.error("Error submitting form:", error);
      //       toast.error(error);
      //     }
      //   },
      //   (error) => {
      //     console.error("Error getting location:", error);
      //     toast.error(error);
      //     // Handle location error (e.g., show an error message to the user)
      //   }
      // );


      const updatedValues = {
        ...values,
        location: {
          latitude: "",
          longitude: "",
        },
      };

      console.log(updatedValues);

      // Submit the updated values
      try {
        const response = await fetch(`${api_url}/tasks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: user.token,
          },
          body: JSON.stringify(updatedValues),
        });
        const json = await response.json();
        if (json.status) {
          console.log("Task created successfully:", json.data);
          await createActivity(
            user._id,
            "task_create",
            `${user.name} created an task : ${updatedValues.task}!`
          );
          navigate(-1);
          // Redirect or perform any other actions on successful creation
        } else {
          console.error("Error creating task:", json.message);
          toast.error(json.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error);
      }
    }
  };

  const renderAdditionalFields = () => {
    switch (selectedTask) {
      case "meeting with investor":
        return (
          <div className="flex items-center mb-4">
            <label htmlFor="investor" className="mr-2">
              Select Investor:
            </label>
            <select
              id="investor"
              name="investor"
              value={values.investor}
              onChange={handleChange}
              className={`input-field ${
                errors.investor ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            >
              <option value="">Select Investor</option>
              {investors.map((investor) => (
                <option key={investor._id} value={investor._id}>
                  {investor.customId} - {investor.name}
                </option>
              ))}
            </select>
          </div>
        );
      case "meeting with landlord":
        return (
          <div className="flex items-center mb-4">
            <label htmlFor="landlord" className="mr-2">
              Select Landlord:
            </label>
            <select
              id="landlord"
              name="landlord"
              value={values.landlord}
              onChange={handleChange}
              className={`input-field ${
                errors.landlord ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            >
              <option value="">Select Landlord</option>
              {landlords.map((landlord) => (
                <option key={landlord._id} value={landlord._id}>
                  {landlord.customId} - {landlord.name}
                </option>
              ))}
            </select>
          </div>
        );
      case "meeting both party / negotiation":
        return (
          <>
            <div className="flex items-center mb-4">
              <label htmlFor="investor" className="mr-2">
                Select Investor:
              </label>
              <select
                id="investor"
                name="investor"
                value={values.investor}
                onChange={handleChange}
                className={`input-field ${
                  errors.investor ? "border-red-500" : "border-[#b1b1b1]"
                }`}
              >
                <option value="">Select Investor</option>
                {investors.map((investor) => (
                  <option key={investor._id} value={investor._id}>
                    {investor.customId} - {investor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mb-4">
              <label htmlFor="landlord" className="mr-2">
                Select Landlord:
              </label>
              <select
                id="landlord"
                name="landlord"
                value={values.landlord}
                onChange={handleChange}
                className={`input-field ${
                  errors.landlord ? "border-red-500" : "border-[#b1b1b1]"
                }`}
              >
                <option value="">Select Landlord</option>
                {landlords.map((landlord) => (
                  <option key={landlord._id} value={landlord._id}>
                    {landlord.customId} - {landlord.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "equipment order":
        return (
          <>
            <div className="flex items-center mb-4">
              <label htmlFor="site" className="mr-2">
                Select Site:
              </label>
              <select
                id="site"
                name="site"
                value={values.site}
                onChange={handleChange}
                className={`input-field ${
                  errors.site ? "border-red-500" : "border-[#b1b1b1]"
                }`}
              >
                <option value="">Select Site</option>
                {sites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.customId} - {site.name}
                  </option>
                ))}
              </select>
            </div>
            {/* <div className="flex items-center mb-4">
              <label htmlFor="equipment" className="mr-2">
                Select Equipment:
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  className="input-field text-start border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
                  onClick={toggleDropdown}
                >
                  Select Equipment
                </button>
                {isMultiDropDownOpen && (
                  <div className="absolute left-0 w-full mt-2 py-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {equipmentTypes.map((equipment) => (
                      <label
                        key={equipment.value}
                        className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={equipment.value}
                          checked={selectedEquipments.includes(equipment.value)}
                          onChange={() => handleOptionClick(equipment.value)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2">{equipment.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div> */}
          </>
        );
      case "outlet opening":
      case "check outlet opening preparation":
      case "primary measurement":
        return (
          <div className="flex items-center mb-4">
            <label htmlFor="site" className="mr-2">
              Select Site:
            </label>
            <select
              id="site"
              name="site"
              value={values.site}
              onChange={handleChange}
              className={`input-field ${
                errors.site ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            >
              <option value="">Select Site</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.customId} - {site.name}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-xs md:text-sm lg:px-1 sm:px-16 px-5 font-poppins max-container">
      <div className="addInvestor font-poppins max-container">
        <div className="page-title pb-3 border-b-2 border-b-slate-500 flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
          <img
            src={siteStoreIcon}
            alt="partner Acquisition Icon"
            className="md:w-8 md:h-8 w-6 h-6"
          />
          <p className="text-sm md:text-base font-semibold">Add New Task</p>
        </div>
      </div>
      <form className="w-full max-w-lg mx-auto my-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center mb-4">
            <label htmlFor="startDateTime" className="mr-2">
              Start Date & Time:
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              name="startDateTime"
              value={values.startDateTime}
              onChange={handleChange}
              className={`input-field ${
                errors.startDateTime ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            />
          </div>
          {<div className="flex items-center mb-4">
            <label htmlFor="endDateTime" className="mr-2">
              End Date & Time:
            </label>
            <input
              type="datetime-local"
              id="endDateTime"
              name="endDateTime"
              value={values.endDateTime}
              onChange={handleChange}
              min={values.startDateTime}
              disabled={!values.startDateTime}
              max={values.startDateTime.split("T")[0] + "T23:59"}
              className={`input-field ${
                errors.endDateTime ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            />
          </div>}
          <div className="flex items-center mb-4">
            <label htmlFor="division" className="mr-2">
              Division:
            </label>
            <select
              id="division"
              name="division"
              value={values.division}
              onChange={(e) => {
                handleChange(e);
                setSelectedDivision(e.target.value);
                setSelectedDistrict("");
                setSelectedUpazila("");
              }}
              className={`input-field ${
                errors.division ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            >
              <option value="">Select Division</option>
              {Array.from(
                new Set(LocationsData.map((item) => item.Division))
              ).map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="district" className="mr-2">
              District:
            </label>
            <select
              id="district"
              name="district"
              value={values.district}
              onChange={(e) => {
                handleChange(e);
                setSelectedDistrict(e.target.value);
                setSelectedUpazila("");
              }}
              className={`input-field ${
                errors.district ? "border-red-500" : "border-[#b1b1b1]"
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
          <div className="flex items-center mb-4">
            <label htmlFor="upazila" className="mr-2">
              Upazila:
            </label>
            <select
              id="upazila"
              name="upazila"
              value={values.upazila}
              onChange={handleChange}
              className={`input-field ${
                errors.upazila ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            >
              <option value="">Select Upazila</option>
              {Array.from(
                new Set(filteredUpazilas.map((item) => item.Upazila))
              ).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-4">
            <label htmlFor="task" className="mr-2">
              Task:
            </label>
            <select
              id="task"
              name="task"
              value={values.task}
              onChange={(e) => {
                handleChange(e);
                setSelectedTask(e.target.value);
              }}
              className={`input-field capitalize ${
                errors.task ? "border-red-500" : "border-[#b1b1b1]"
              }`}
            >
              <option value="">Select Task</option>
              {taskOptions.map((task) => (
                <option key={task.value} value={task.value}>
                  {task.label}
                </option>
              ))}
            </select>
          </div>
          {renderAdditionalFields()}

          <button
            type="submit"
            className="bg-primary text-white p-3 font-medium rounded"
          >
            Add Task
          </button>
        </div>
      </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default AddTask;
