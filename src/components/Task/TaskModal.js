/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useActivity from "../../hooks/useActivity";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { expansionDB } from "../../firebase/config";

const TaskModal = ({
  data,
  handleModalSwitch,
  investors,
  fetchData,
  api_url,
  user,
  id,
}) => {
  const navigate = useNavigate();
  const [remarks, setRemarks] = useState("");
  const [taskStatus, setTaskStatus] = useState(1);
  const [isPartnerFirstTask, setIsPartnerFirstTask] = useState(true);
  const { createActivity } = useActivity();
  // const [equipments,setEquipments]
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [isMultiDropDownOpen, setIsMultiDropDownOpen] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [documentURL, setDocumentURL] = useState(null);
  const [document, setDocument] = useState(null);

  const [openingDate, setOpeningDate] = useState("");

  // investors
  const [investorBudget, setInvesorBudget] = useState(null);

  // site
  const [siteMessure, setSiteMessure] = useState(null);

  const fetchPartnerExists = async (partner) => {
    let id = "";

    if (partner === "landlord") {
      id = data.landlord._id;
    } else {
      id = data.investor._id;
    }

    try {
      console.log(`${api_url}/services/task/${id}/${partner}`);
      const response = await fetch(
        `${api_url}/services/task/${id}/${partner}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            authorization: user.token,
          },
          // body: JSON.stringify(filter),
        }
      );
      const json = await response.json();
      console.log(json);
      if (json.status) {
        setIsPartnerFirstTask(json.result);
      } else {
        setIsPartnerFirstTask(false);
        toast.error(json.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const equipmentTypes = [
    { label: "ac", value: "ac" },
    { label: "it", value: "it" },
    { label: "gondola", value: "gondola" },
    { label: "display", value: "display" },
    { label: "furniture", value: "furniture" },
  ];

  console.log(data);

  useEffect(() => {
    if (data?.task === "meeting with investor") {
      fetchPartnerExists("investor");
    } else if (data?.task === "meeting with landlord") {
      fetchPartnerExists("landlord");
    }
    // eslint-disable-next-line
  }, []);

  const renderAdditionalFields = (data) => {
    switch (data.task) {
      case "new site search":
        return (
          <>
           
            
              <div className="flex gap-2 items-center my-4">
                <label htmlFor="task" className="w-32 font-medium">
                  Site Found?:
                </label>
                <select
                  id="task"
                  name="task"
                  value={taskStatus}
                  onChange={(e) => {
                    setTaskStatus(e.target.value);
                  }}
                  className={`input-field border-[#b1b1b1]`}
                >
                  {/* <option value="">Did Investor Agree?</option> */}
                  {taskStatusOption.map((task) => (
                    <option key={task.value} value={task.value}>
                      {task.label}
                    </option>
                  ))}
                </select>
              </div>
            
            {taskStatus == 1 && (
              <div className="flex gap-2 items-center mb-4 ">
                <label htmlFor="investor" className="w-32 font-medium">
                  Upload image:
                </label>

                <input
                  placeholder="iUpload image"
                  type="file"
                  id="document"
                  className="input-field border-[#b1b1b1]"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </div>
            )}
          </>
        );
      case "meeting with investor":
        return (
          <>
            <div className="flex gap-2 items-center mb-4 ">
              <label htmlFor="investor" className="w-32 font-medium">
                Investor:
              </label>

              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/investor/${data.investor._id}/`);
                }}
              >
                {data.investor.customId} - {data.investor.name}
              </p>
            </div>
            {!isPartnerFirstTask && (
              <div className="flex gap-2 items-center my-4">
                <label htmlFor="task" className="w-32 font-medium">
                  Investor Agreed?:
                </label>
                <select
                  id="task"
                  name="task"
                  value={taskStatus}
                  onChange={(e) => {
                    setTaskStatus(e.target.value);
                  }}
                  className={`input-field border-[#b1b1b1]`}
                >
                  {/* <option value="">Did Investor Agree?</option> */}
                  {taskStatusOption.map((task) => (
                    <option key={task.value} value={task.value}>
                      {task.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {taskStatus == 1 && (
              <div className="flex gap-2 items-center mb-4 ">
                <label htmlFor="investor" className="w-32 font-medium">
                  Budget:
                </label>

                <input
                  placeholder="investment budget"
                  type="number"
                  step={0.1}
                  className="input-field border-[#b1b1b1]"
                  value={investorBudget}
                  onChange={(e) => setInvesorBudget(e.target.value)}
                />
              </div>
            )}
          </>
        );
      case "meeting with landlord":
        return (
          <>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-32 font-medium">
                Landlord:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/landlord/${data.landlord._id}/`);
                }}
              >
                {data.landlord.customId} - {data.landlord.name}
              </p>
            </div>

            {!isPartnerFirstTask && (
              <div className="flex gap-2 items-center my-4">
                <label htmlFor="task" className="w-32 font-medium">
                  Landlord Agreed?:
                </label>
                <select
                  id="task"
                  name="task"
                  value={taskStatus}
                  onChange={(e) => {
                    setTaskStatus(e.target.value);
                  }}
                  className={`input-field border-[#b1b1b1]`}
                >
                  {/* <option value="">Did Landlord Agree?</option> */}
                  {taskStatusOption.map((task) => (
                    <option key={task.value} value={task.value}>
                      {task.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        );
      case "meeting both party / negotiation":
        return (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-32 font-medium">
                Landlord:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/landlord/${data.landlord._id}/`);
                }}
              >
                {data.landlord.customId} - {data.landlord.name}
              </p>
            </div>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-32 font-medium">
                Investor:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer "
                onClick={() => {
                  navigate(`/investor/${data.investor._id}/`);
                }}
              >
                {data.investor.customId} - {data.investor.name}
              </p>
            </div>
            <div className="flex gap-2 items-center my-4">
              <label htmlFor="task" className="w-32 font-medium">
                Both Agreed?:
              </label>
              <select
                id="task"
                name="task"
                value={taskStatus}
                onChange={(e) => {
                  setTaskStatus(e.target.value);
                }}
                className={`input-field border-[#b1b1b1]`}
              >
                {/* <option value="">Did both Agree?</option> */}
                {taskStatusOption.map((task) => (
                  <option key={task.value} value={task.value}>
                    {task.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "outlet opening":
        return (
          <>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-32 font-medium">
                Site:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}
              >
                {data.site.customId} - {data.site.name}
              </p>
            </div>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-32 font-medium">
                Opening Date:
              </label>

              <input
                type="date"
                value={openingDate}
                onChange={(e) => setOpeningDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Disable prev dates
                className="input-field border-[#b1b1b1]"
              />
            </div>

            {/* <div className="flex gap-2 items-center mb-4">
                <label className="w-32 font-medium">Current Opening Date:</label>
                <p className="py-1 w-full  capitalize ">
                  {new Date(
                    data.site.statusDetails.find(
                      (option) => option.status === data.site.status
                    )?.openingDate
                  ).toDateString() === "Invalid Date"
                    ? "N/A"
                    : new Date(
                        data.site.statusDetails.find(
                          (option) => option.status === data.site.status
                        )?.openingDate
                      ).toDateString()}
                </p>
              </div> */}
          </>
        );
      case "check outlet opening preparation":
        return (
          <>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-32 font-medium">
                Site:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}
              >
                {data.site.customId} - {data.site.name}
              </p>
            </div>
            <div className="flex gap-2 items-center my-4">
              <label htmlFor="task" className="w-32 font-medium">
                Outlet opened?:
              </label>
              <select
                id="task"
                name="task"
                value={taskStatus}
                onChange={(e) => {
                  setTaskStatus(e.target.value);
                }}
                className={`input-field border-[#b1b1b1]`}
              >
                {/* <option value="">Is Outlet Oppened?</option> */}
                {taskStatusOption.map((task) => (
                  <option key={task.value} value={task.value}>
                    {task.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case "primary measurement":
        return (
          <>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-32 font-medium">
                Site:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 cursor-pointer"
                onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}
              >
                {data.site.customId} - {data.site.name}
              </p>
            </div>
            <div className="flex gap-2 items-center mb-4 ">
              <label htmlFor="investor" className="w-32 font-medium">
                Sqft:
              </label>

              <input
                placeholder="site measurement"
                type="number"
                step={0.1}
                className="input-field border-[#b1b1b1]"
                value={siteMessure}
                onChange={(e) => setSiteMessure(e.target.value)}
              />
            </div>
          </>
        );
      case "equipment order": {
        return (
          <>
            <div className="flex gap-2 items-center mb-4">
              <label htmlFor="investor" className="w-32 font-medium">
                Site:
              </label>
              <p
                className="py-1 w-full  capitalize underline text-blue-500 "
               
              >
                <span className="cursor-pointer"  onClick={() => {
                  navigate(`/site/${data.site._id}/info`);
                }}> {data.site.customId} - {data.site.name}</span>
               
              </p>
            </div>
           
            <div className="flex items-center mb-4">
              <label htmlFor="equipment" className="w-32 font-medium">
                Equipment:
              </label>
              <div className="relative w-full">
                <button
                  type="button"
                  className="input-field text-start w-full border-gray-300 rounded-md px-4 py-2 bg-white text-gray-800"
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
            </div>
            <div className="flex gap-2 items-center">
              <label htmlFor="investor" className="w-32 font-medium">
                Selected Equipment:
              </label>
              <div className="w-full flex flex-wrap text-[10px] justify-start gap-2">
                {selectedEquipments.map((item) => (
                  <>
                    <p className="uppercase text whitespace-normal text-white bg-secondary py-1 px-3 rounded">
                      {item}
                    </p>
                  </>
                ))}
              </div>
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  const toggleDropdown = () => {
    setIsMultiDropDownOpen(!isMultiDropDownOpen);
  };

  //equipment
  const handleOptionClick = (value) => {
    let newSelectedOptions;
    if (selectedEquipments.includes(value)) {
      newSelectedOptions = selectedEquipments.filter(
        (option) => option !== value
      );
    } else {
      newSelectedOptions = [...selectedEquipments, value];
    }
    setSelectedEquipments(newSelectedOptions);
    // setValues({ ...values, equipment: newSelectedOptions });
  };

  const taskStatusOption = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];


  const handleDocumentChange = async (file) => {
    if (file) {
      setIsUploading(true); // Set upload status to true
      const documentName = `${new Date().getTime()}_${data.task}`;
      const storageRef = ref(expansionDB, `documents/${documentName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // setUploadProgress(progress);
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            toast.error("Upload failed");
            setIsUploading(false); // Set upload status to false
            setDocument(null);
            reject(false); // Reject the promise with false
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                setDocumentURL(downloadURL);
                // setUploadProgress(0);
                toast.success("File uploaded successfully");
                // setDocumentRequired(false);
                setIsUploading(false); // Set upload status to false
                setDocument(null);
                resolve(downloadURL); // Resolve the promise with the download URL
              })
              .catch((error) => {
                console.error("Failed to get download URL:", error);
                toast.error("Failed to get download URL");
                setIsUploading(false); // Set upload status to false
                setDocument(null);
                reject(false); // Reject the promise with false
              });
          }
        );
      });
    } else {
      setDocument(null);
      return false;
    }
  };

  const handleSubmit = async () => {
    let submitData = {
      isComplete: true,
      remarks: remarks ? remarks : "",
      taskStatus: Boolean(parseInt(taskStatus)),
      equipment: selectedEquipments
    };

    // console.log(data.task);


    let documentURL = null;

    if (document) {
      try {
        const documentStatus = await handleDocumentChange(document);

        if (!documentStatus) {
          return;
        } else {
          documentURL = documentStatus;
        }
      } catch (error) {
        console.error("Error handling document change:", error);
        toast.error("Cant Upload File:", error);
        return;
      }
    }


    console.log({documentURL});


    submitData = {
      ...submitData,
      documents: [documentURL]
    }




    if (data.task === "meeting with investor") {
      try {
        const response = await fetch(
          `${api_url}/investor/${data.investor._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              investmentBudget: parseFloat(investorBudget),
            }),
          }
        );

        const responseData = await response.json();
        if (responseData.status) {
          toast.success(responseData.message);
          await createActivity(
            user._id,
            "investor_update",
            `${user.name} updated investor : ${data.investor.customId}!`
          );
          // fetchData();

          // handleModalSwitch();
        } else {
          toast.error(responseData.message);
          return;
        }
      } catch (error) {
        toast.error(error.message);
        console.error(error);
        return;
      }
    }

    // console.log(data.task);

    if (data.task === "outlet opening") {
      if (openingDate === "") {
        toast.error("Please select a Date");
        return;
      }

      const isReady = data.site.statusDetails.find(
        (item) => item.status === "product arrived"
      );

      if (!isReady) {
        toast.error("Site is not ready to open");
        return;
      }

      const lastStatus =
        data.site.siteHistory[data.site.siteHistory.length - 1];
      const newStatusEntry = {
        status: "ready to open",
        startTime: lastStatus ? lastStatus.endTime : new Date().toISOString(),
        endTime: new Date().toISOString(),
      };

      let siteUpdateData = {
        status: "ready to open",
        siteHistory: [...data.site.siteHistory, newStatusEntry],
        statusDetails: [
          ...data.site.statusDetails,

          {
            status: "ready to open",
            remarks: "",
            approvedBy: "",
            equipmentOptions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            openingDate: openingDate,
            
          },
        ],
      };

      console.log(siteUpdateData);

      try {
        const response = await fetch(
          `${api_url}/site/update/${data.site._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${user.token}`,
            },
            body: JSON.stringify(siteUpdateData),
          }
        );

        const responseData = await response.json();
        if (responseData.status) {
          toast.success(responseData.message);
          await createActivity(
            user._id,
            "status_update",
            `${user.name} updated status in site: ${
              data.site.customId
            } status: ${"ready to open"}!`
          );
          // fetchData();

          // handleModalSwitch();
        } else {
          toast.error(responseData.message);
          return;
        }
      } catch (error) {
        toast.error(error.message);
        console.error(error);
        return;
      }
    }





    if (data.task === "primary measurement") {
      try {
        const response = await fetch(
          `${api_url}/site/update/${data.site._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${user.token}`,
            },
            body: JSON.stringify({ sqft: siteMessure }),
          }
        );

        const responseData = await response.json();
        if (responseData.status) {
          toast.success(responseData.message);
          await createActivity(
            user._id,
            "status_update",
            `${user.name} updated status in site: ${
              data.site.customId
            } with : ${"ready to open"}!`
          );
          // fetchData();

          // handleModalSwitch();
        } else {
          toast.error(responseData.message);
          return;
        }
      } catch (error) {
        toast.error(error.message);
        console.error(error);
        return;
      }
    }

    console.log({ submitData });

    try {
      const response = await fetch(`${api_url}/tasks/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();
      if (responseData.status) {
        toast.success(responseData.message);
        if (
          data.task === "meeting with landlord" &&
          Boolean(parseInt(taskStatus))
        ) {
          navigate("/addSite");
        }
        await createActivity(
          user._id,
          "task_update",
          `${user.name} updated task : ${data.task}!`
        );
        fetchData();

        handleModalSwitch();
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="absolute  bg-black/30 h-[100dvh] top-0 left-0 w-full flex justify-center items-center font-poppins text-xs">
      <div className="bg-white w-11/12 md:w-3/4 p-8 mb-12 rounded-md">
        <h1 className="text-center text-sm capitalize  mb-8 flex justify-between items-center">
          <p>
            <span className="font-medium underline">{data.task}</span>{" "}
          </p>
          <button
            className="hover:bg-red-700 text-red-600  p-1 hover:text-white rounded-full"
            onClick={() => handleModalSwitch()}
          >
            <RxCross2 className="w-5 h-5 " />
          </button>
        </h1>

        {/* <div className="flex gap-2 w-full">
          <label htmlFor="remarks" className=" w-28 font-medium">
            Task:
          </label>
          <p className="px-2 py-1 w-full ">{data.task}</p>
        </div> */}

        {renderAdditionalFields(data)}

        <div className="flex w-full gap-2 mt-4">
          <label htmlFor="remarks" className="w-32 font-medium">
            Remarks:
          </label>
          <textarea
            onChange={(e) => setRemarks(e.target.value)}
            className="input-field text-gray-900 bg-gray-50 rounded-lg border-slate-500"
          ></textarea>
        </div>
        <button
          onClick={() => handleSubmit()}
          className="w-full bg-green-600 mt-4 p-2 text-white text-sm rounded disabled:bg-gray-400 disabled:"
          disabled={data.task === "new site search" && taskStatus === 1 && !document}
        >
          Complete Task
        </button>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default TaskModal;
