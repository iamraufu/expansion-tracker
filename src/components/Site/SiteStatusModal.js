/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { expansionDB } from "../../firebase/config";
import { FaFileAlt } from "react-icons/fa";
import useActivity from "../../hooks/useActivity";

const SiteStatusModal = ({ data, handleModalSwitch, investors, fetchData }) => {
  const [status] = useState(data.status);
  const [openingDate, setOpeningDate] = useState("");
  const [newStatus, setNewStatus] = useState(data.status);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentRequired, setDocumentRequired] = useState(false);
  const [isStatusOptionRequired, setIsStatusOptionRequired] = useState(false);
  const [isApprovalRequired, setIsApprovalRequired] = useState(false);
  const [isEquipmentRequired, setIsEquipmentRequired] = useState(false);
  const [isMultiDropDownOpen, setIsMultiDropDownOpen] = useState(false);
  const { user } = useAuth();
  let { id } = useParams();
  const api_url = process.env.REACT_APP_API_URL;
  const [warning, setWarning] = useState("");

  console.log({ data });

  const [selectedInvestor, setSelectedInvestor] = useState(
    data.investors.length > 0 ? data.investors[0]?.investorId._id : ""
  );
  const [investorBudget, setInvestorBudget] = useState(
    data.investors.length > 0
      ? data.investors[0]?.investorId.investmentBudget
      : ""
  );
  const [possibleInvestmentDate, setPossibleInvestmentDate] = useState(
    data.investors.length > 0
      ? data.investors[0]?.investorId.possibleInvestmentDate
      : ""
  );

  const [approvedBy, setApprovedBy] = useState(
    data?.statusDetails?.find((option) => option.status === newStatus)
      ?.approvedBy
  );
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentURL, setDocumentURL] = useState(null);
  // remove
  const [statusOption, setStatusOption] = useState("");

  const selectedStatusDetails = data?.statusDetails?.filter(
    (option) => option.status === newStatus
  );
  const { createActivity } = useActivity();
  const selectedStatusEquipments = selectedStatusDetails
    ? selectedStatusDetails[0]?.equipmentOptions
    : [];

  // console.log({selectedStatusEquipments});
  const [equipmentOptions, setEquipmentOptions] = useState(
    selectedStatusEquipments ? selectedStatusEquipments : []
  );

  const [remarks, setRemarks] = useState(
    selectedStatusDetails[0]?.remarks ? selectedStatusDetails[0].remarks : ""
  );
  const [sapCode, setSapCode] = useState(data.sapCode ? data.sapCode : "");

  const getFileName = (url) => {
    const parts = url.split("%2F");
    const filePart = parts[parts.length - 1].split("?")[0];
    const dateIndex = filePart.indexOf("_");
    return dateIndex !== -1 ? filePart.slice(dateIndex + 1) : filePart;
  };

  const toggleDropdown = () => {
    setIsMultiDropDownOpen(!isMultiDropDownOpen);
  };

  const handleOptionClick = (value) => {
    let newSelectedOptions;
    if (equipmentOptions.includes(value)) {
      newSelectedOptions = equipmentOptions.filter(
        (option) => option !== value
      );
    } else {
      newSelectedOptions = [...equipmentOptions, value];
    }

    if (newSelectedOptions.length > 0) {
      setIsEquipmentRequired(false);
    } else {
      setIsEquipmentRequired(true);
    }
    setEquipmentOptions(newSelectedOptions);
  };

  const statusOptions = [
    {
      level: 1,
      label: "site found",
      value: "site found",
    },
    {
      level: 2,
      label: "site negotiation",
      value: "site negotiation",
    },
    {
      level: 3,
      label: "investor & site confirmation",
      value: "investor and site confirmation",
    },
    {
      level: 4,
      label: "feasibility study",
      value: "feasibility study",
    },
    {
      level: 5,
      label: "RMIA Validation",
      value: "RMIA validation",
    },

    // {
    //   level: 6,
    //   label: "feasibility done by operations",
    //   value: "feasibility done by operations",
    // },
    {
      level: 6,
      label: "GMD approval",
      value: "GMD approval",
    },
    {
      level: 7,
      label: "premises agreement",
      value: "premises agreement",
    },
    {
      level: 8,
      label: "docs collected",
      value: "docs collected",
    },

    {
      level: 9,
      label: "layout approved",
      value: "layout approved",
    },
    {
      level: 10,
      label: "franchise agreement",
      value: "franchise agreement",
    },

    {
      level: 11,
      label: "civil work",
      value: "civil work",
    },
    {
      level: 12,
      label: "equipment order",
      value: "equipment order",
    },
    {
      level: 13,
      label: "equipment installation",
      value: "equipment installation",
    },
    {
      level: 14,
      label: "hr ready",
      value: "hr ready",
    },
    {
      level: 15,
      label: "product receiving",
      value: "product receiving",
    },
    {
      level: 16,
      label: "merchandising",
      value: "merchandising",
    },
    {
      level: 17,
      label: "branding",
      value: "branding",
    },
    {
      level: 18,
      label: "inauguration",
      value: "inauguration",
    },
    {
      level: 19,
      label: "site complete",
      value: "site complete",
    },
  ];

  const documentTypes = [
    {
      label: "application for franchisee dealership",
      value: "application for franchisee dealership",
    },
    { label: "photograph of franchisee", value: "photograph of franchisee" },
    { label: "franchisee profile form", value: "franchisee profile form" },
    {
      label: "national id copy and passport copy",
      value: "national id copy and passport copy",
    },
    { label: "tin certificate copy", value: "tin certificate copy" },
    {
      label:
        "no objection certificate from partner / other owner of the premises, if there is several owner of the premises",
      value:
        "no objection certificate from partner / other owner of the premises, if there is several owner of the premises",
    },
    {
      label: "commercial permission copy of the premises & layout plan",
      value: "commercial permission copy of the premises & layout plan",
    },
    { label: "land tax/holding tax copy", value: "land tax/holding tax copy" },
    {
      label: "electricity bill copy of premises address",
      value: "electricity bill copy of premises address",
    },
    {
      label: "signed agreement copy (original) (for rented space)",
      value: "signed agreement copy (original) (for rented space)",
    },
    {
      label: "bank statement/ bank solvency certificate",
      value: "bank statement/ bank solvency certificate",
    },
    {
      label:
        "bank transaction identity (bank a/c, a/c name & photocopy of cheque)",
      value:
        "bank transaction identity (bank a/c, a/c name & photocopy of cheque)",
    },
    {
      label: "title deed of the premises",
      value: "title deed of the premises",
    },
    { label: "undated signature cheque", value: "undated signature cheque" },
  ];

  const equipmentTypes = [
    { label: "ac", value: "ac" },
    { label: "it", value: "it" },
    { label: "gondola", value: "gondola" },
    { label: "display", value: "display" },
    { label: "furniture", value: "furniture" },
  ];



  useEffect(() => {
    const statusesRequiringDocument = [
      // "feasibility study",
      // "feasibility done by operations",
      // "GMD approval",
      // "docs collected",
      // "layout approved",
      // "civil work",
      // "product receiving",
    ];

    const statusesRequiringApproval = [
      "feasibility study",
      "feasibility done by operations",
      // "GMD approval",
      "layout approved",
    ];

    const equiptmentRequiredOptions = [
      "equipment order",
      "equipment installation",
    ];

    const checkRequiredData = () => {
      if (statusesRequiringDocument.includes(newStatus) && !document) {
        setDocumentRequired(true);
      } else {
        setDocumentRequired(false);
      }

      // console.log(
      //   statusesRequiringApproval.includes(newStatus),
      //   status === newStatus && approvedBy?.length <= 0,
      //   approvedBy
      // );
      if (
        statusesRequiringApproval.includes(newStatus) &&
        (!approvedBy || approvedBy?.length <= 0)
      ) {
        setIsApprovalRequired(true);
      } else {
        setIsApprovalRequired(false);
      }

      if (equiptmentRequiredOptions.includes(newStatus)) {
        setIsEquipmentRequired(true);
      } else {
        setIsEquipmentRequired(false);
      }
    };

    checkRequiredData();
  }, [newStatus, document]);

  const handleStatusChange = (value) => {
    const currentStatusOption = statusOptions.find(
      (option) => option.value === status
    );
    const newStatusOption = statusOptions.find(
      (option) => option.value === value
    );

    if (!currentStatusOption || !newStatusOption) {
      toast.error("Invalid status");
      console.error("Invalid status");
      return;
    }

    if (newStatusOption.level < currentStatusOption.level) {
      toast.error("New status is of a lower level than current status");
      setNewStatus(value);
    } else if (currentStatusOption.value === newStatusOption.value) {
      toast.error("Current status is the same as new status");
      setNewStatus(value);
    } else if (newStatusOption.level !== currentStatusOption.level + 1) {
      toast.error("New status is not the immediate next level");
      // setNewStatus(value);
      return;
    } else {
      setNewStatus(value);
    }

    const newApprovedBy = data.statusDetails.find(
      (option) => option.status === value
    )?.approvedBy;
    setApprovedBy(newApprovedBy ? newApprovedBy : "");

    const selectedStatusDetails = data.statusDetails.filter(
      (option) => option.status === value
    );

    const selectedStatusEquipments = selectedStatusDetails[0]?.equipmentOptions;

    setEquipmentOptions(
      selectedStatusEquipments ? selectedStatusEquipments : []
    );

    setRemarks(
      selectedStatusDetails[0]?.remarks ? selectedStatusDetails[0].remarks : ""
    );
  };

  const handleInvestor = (id) => {
    const investor = investors.find((option) => option._id === id);
    setSelectedInvestor(investor._id);
    setInvestorBudget(investor.investmentBudget);
    setPossibleInvestmentDate(investor.possibleInvestmentDate);
  };

  const handleSubmit = async () => {
    console.log({
      isApprovalRequired,
      isStatusOptionRequired,
      isEquipmentRequired,
    });
    if (isApprovalRequired || isStatusOptionRequired || isEquipmentRequired) {
      toast.error("All values Are Required!");
      return;
    }

    const currentStatusOption = statusOptions.find(
      (option) => option.value === status
    );
    const newStatusOption = statusOptions.find(
      (option) => option.value === newStatus
    );

    console.log({ currentStatusOption, newStatusOption });

    if (!currentStatusOption || !newStatusOption) {
      toast.error("Invalid status");
      return;
    }

    if (currentStatusOption.value === newStatusOption.value) {
      toast.error("Current status is the same as new status");
      // return;
    }

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

    // console.log({ documentURL });

    const lastStatus = data.siteHistory[data.siteHistory.length - 1];
    const newStatusEntry = {
      status: newStatus,
      startTime: lastStatus ? lastStatus.endTime : new Date().toISOString(),
      endTime: new Date().toISOString(),
    };

    const updatedSiteHistory = [...data.siteHistory, newStatusEntry];

    // Find the index of the existing status in the statusDetails array
    const existingStatusIndex = data.statusDetails.findIndex(
      (detail) => detail.status === newStatus
    );

    let updatedStatusDetails = [...data.statusDetails];

    console.log({ statusOption });

    if (existingStatusIndex !== -1) {
      // Update the existing status entry
      updatedStatusDetails[existingStatusIndex] = {
        ...updatedStatusDetails[existingStatusIndex],
        remarks: remarks,
        approvedBy: approvedBy,
        equipmentOptions: equipmentOptions,
        openingDate: openingDate,
        // createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add a new status entry
      updatedStatusDetails.push({
        status: newStatus,
        remarks: remarks,
        approvedBy: approvedBy,
        equipmentOptions: equipmentOptions,
        openingDate: openingDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    let updatedData = {
      status: newStatus,
      siteHistory: updatedSiteHistory,
      statusDetails: updatedStatusDetails,
    };

    if (documentURL) {
      updatedData = {
        ...updatedData,
        documents: [
          ...data.documents,
          {
            url: documentURL,
            status: newStatus,
            fileType: documentType,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    }

    if (newStatus === "investor and site confirmation") {
      updatedData = {
        ...updatedData,
        investors: [
          {
            investorId: selectedInvestor,
            investmentBudget: parseFloat(investorBudget),
            possibleInvestmentDate: possibleInvestmentDate,
          },
        ],
      };
    }

    console.log({ updatedData });

    console.log({ user });

    try {
      const response = await fetch(`${api_url}/site/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
        body: JSON.stringify({
          ...updatedData,
          sapCode: sapCode === "" ? "" : sapCode,
        }),
      });

      const responseData = await response.json();
      if (responseData.status) {
        toast.success(responseData.message);
        await createActivity(
          user._id,
          "status_update",
          `${user.name} updated status in site: ${data.customId} status: ${newStatus}!`
        );
        fetchData();
        if (newStatus !== "docs collected") {
          handleModalSwitch();
        }
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleDocumentChange = async (file) => {
    if (file) {
      setIsUploading(true); // Set upload status to true
      const documentName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(expansionDB, `documents/${documentName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
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
                setUploadProgress(0);
                toast.success("File uploaded successfully");
                setDocumentRequired(false);
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

  const selectedStatusDocs = data.documents.filter(
    (option) => option.status === newStatus
  );

  // console.log(selectedStatusDocs);

  const renderAdditionalFields = () => {
    switch (newStatus) {
      case "site found":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <div className="mt-4 flex flex-col">
                <label className="block font-medium mb-2">Landlord:</label>
                <p className="capitalize w-full">
                  {data.landlords[0].customId} - {data.landlords[0].name}
                </p>
              </div>
            </div>
          </>
        );
      case "feasibility study":
        return (
          <div className="text-xs">
            <div className="mt-4 flex flex-col">
              <label htmlFor="approvedBy" className="block font-medium mb-2">
                Approval Needed from:
              </label>
              <input
                id="approvedBy"
                type="text"
                className="px-2 py-3 w-full border rounded"
                value={approvedBy}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setIsApprovalRequired(false);
                  } else {
                    setIsApprovalRequired(true);
                  }
                  setApprovedBy(e.target.value);
                }}
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label htmlFor="document" className="block font-medium mb-2">
                Document upload:
              </label>
              <input
                id="document"
                type="file"
                className="px-2 py-3 w-full border rounded"
                // disabled={status === newStatus}
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </div>
          </div>
        );
      case "RMIA validation":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <label htmlFor="remarks" className="block font-medium mb-2">
                Remarks:
              </label>
              <textarea
                id="remarks"
                className="px-2 py-3 w-full border border-slate-500 rounded"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </>
        );
      case "feasibility done by operations":
      case "GMD approval":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <label
                htmlFor="document"
                className="block font-medium whitespace-nowrap mb-2"
              >
                Document upload
              </label>
              <input
                id="document"
                type="file"
                className="px-2 py-3 w-full border rounded"
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </div>
          </>
        );
      case "layout approved":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <label htmlFor="approvedBy" className="block font-medium mb-2">
                Approved by:
              </label>
              <input
                id="approvedBy"
                type="text"
                className="px-2 py-3 w-full border rounded"
                value={approvedBy}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setIsApprovalRequired(false);
                  } else {
                    setIsApprovalRequired(true);
                  }
                  setApprovedBy(e.target.value);
                }}
              />
            </div>
            <div className="mt-4 flex flex-col">
              <label htmlFor="document" className="block font-medium mb-2">
                {newStatus === "layout approved"
                  ? "Upload Layout Pictures"
                  : "Document upload:"}
              </label>
              <input
                id="document"
                type="file"
                className="px-2 py-3 w-full border rounded"
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </div>
          </>
        );
      case "premises agreement":
      case "franchise agreement":
        return (
          <>
            {/* <div className="mt-4 flex flex-col">
              <label htmlFor="statusOption" className="block font-medium mb-2">
                Status Option:
              </label>
              <select
                id="statusOption"
                className="px-2 py-3 w-full border rounded"
                value={statusOption}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setIsStatusOptionRequired(false);
                  } else {
                    setIsStatusOptionRequired(true);
                  }
                  setStatusOption(e.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="agreed">Agreed</option>
                <option value="not agreed">Not agreed</option>
              </select>
            </div> */}
            <div className="mt-4 flex flex-col">
              <label className="block font-medium mb-2">Select landlord:</label>
              <p className="capitalize w-full">
                {data.landlords[0].customId} - {data.landlords[0].name}
              </p>
            </div>
            <div className="mt-4 flex flex-col">
              <label className="block font-medium mb-2">Select investor:</label>
              <p className="capitalize w-full">
                {data.investors[0]?.investorId.customId} -{" "}
                {data.investors[0]?.investorId.name}
              </p>
            </div>
            <div className="mt-4 flex flex-col">
              <label
                htmlFor="document"
                className="block font-medium mb-2 whitespace-nowrap"
              >
                Document upload:
              </label>
              <input
                id="document"
                type="file"
                className="px-2 py-3 w-full border rounded"
                // disabled={status === newStatus}
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </div>
          </>
        );
      case "docs collected":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <div className="flex flex-col justify-start mb-4">
                <label
                  htmlFor="status"
                  className="whitespace-nowrap font-medium mb-2"
                >
                  Document Type:
                </label>
                <select
                  id="document"
                  name="document"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className={`px-2 py-3 w-full border rounded capitalize ${"border-[#8D8D8D] "}`}
                >
                  <option value="">Select Document Type</option>
                  {documentTypes.map((option) => (
                    <option
                      key={option.value}
                      className="p-3 text-xs flex-wrap"
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <label htmlFor="document" className="block font-medium mb-2">
                Upload document:
              </label>
              <input
                id="document"
                type="file"
                className="px-2 py-3 w-full border rounded"
                disabled={documentType === ""}
                onChange={(e) => setDocument(e.target.files[0])}
              />
            </div>
          </>
        );
      case "civil work":
      case "product receiving":
      case "hr ready":
        return (
          <>
            {newStatus !== "inauguration" && newStatus !== "hr ready" && (
              <div className="mt-4 flex flex-col">
                <label htmlFor="document" className="block font-medium mb-2">
                  Upload picture:
                </label>
                <input
                  id="document"
                  type="file"
                  className="px-2 py-3 w-full border rounded"
                  onChange={(e) => setDocument(e.target.files[0])}
                />
              </div>
            )}
            {(newStatus === "product receiving" ||
              newStatus === "hr ready") && (
              <div className="mt-4 flex flex-col">
                <label htmlFor="remarks" className="block font-medium mb-2">
                  Remarks:
                </label>
                <textarea
                  id="remarks"
                  className="px-2 py-3 w-full border border-slate-500 rounded"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            )}
          </>
        );

      case "branding":
      case "merchandising":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <label htmlFor="remarks" className="block font-medium mb-2">
                Remarks:
              </label>
              <textarea
                id="remarks"
                className="px-2 py-3 w-full border border-slate-500 rounded"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </>
        );
      case "site complete":
        return (
          <>
            <div className="mt-4 flex flex-col">
              <label htmlFor="remarks" className="block font-medium mb-2">
                SAP Site Code:
              </label>
              
              <input
                id="sapCode"
                type="text"
                className="px-2 py-3 w-full border border-slate-500 rounded"
                value={sapCode}
                onChange={(e) => {
                  const regex = /^[A-Za-z][A-Za-z0-9]{3,}$/;
                  if (!regex.test(e.target.value.toUpperCase().trim())) {
                    setWarning(
                      "It must start with an alphabet and be at least 4 characters long."
                    );
                  } else {
                    setWarning("");
                  }
                  setSapCode(e.target.value.toUpperCase().trim());
                }}
              />
              {warning && (
                <p className="my-4 px-3 bg-red-100 py-2 border border-red-600 rounded-md font-medium">
                  {warning}
                </p>
              )}
            </div>
          </>
        );
      case "equipment order":
      case "equipment installation":
        return (
          <>
            <div className="relative">
              <div
                className="px-2 py-3 w-full border rounded cursor-pointer"
                onClick={toggleDropdown}
              >
                {equipmentOptions.length === 0
                  ? "Select Option"
                  : equipmentOptions.join(", ")}
              </div>
              {isMultiDropDownOpen && (
                <div className="absolute z-10 w-full bg-white border rounded mt-1 capitalize">
                  {equipmentTypes.map((option) => (
                    <div
                      key={option.value}
                      className={`p-2 cursor-pointer ${
                        equipmentOptions.includes(option.value)
                          ? "bg-gray-200"
                          : ""
                      }`}
                      onClick={() => handleOptionClick(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      case "inauguration":
        return (
          <>
            <label className="block font-medium text-gray-700 mb-2 whitespace-nowrap">
              Select Opening Date
            </label>
            <input
              type="date"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Disable prev dates
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            {
              <div className="mt-4">
                <p className="font-medium mb-2">Current Opening Date:</p>
                <p>
                  {new Date(
                    data.statusDetails.find(
                      (option) => option.status === newStatus
                    )?.openingDate
                  ).toDateString() === "Invalid Date"
                    ? "N/A"
                    : new Date(
                        data.statusDetails.find(
                          (option) => option.status === newStatus
                        )?.openingDate
                      ).toDateString()}
                </p>
              </div>
            }
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute bg-black/30 h-[100dvh] top-0 left-0 w-full flex justify-center items-center">
      <div className="bg-white w-11/12 md:w-3/4 p-8 mb-12 rounded-md text-xs md:text-base">
        <h1 className="text-center underline text-base mb-8 flex justify-between items-center">
          <p>Change Status</p>
          <button
            className="hover:bg-red-700 p-1 hover:text-white rounded-full"
            onClick={() => handleModalSwitch()}
          >
            <RxCross2 className="w-6 h-6" />
          </button>
        </h1>
        <div className="flex justify-start items-center gap-3 mb-4">
          <p className="">Current Status: </p>
          <p className="uppercase">{data.status}</p>
        </div>
        <div>
          {newStatus === "RMIA validation" &&
            !data.feasibilityDoneByOperations && (
              <p className="my-4 px-3 bg-red-100 py-2 border border-red-600 rounded-md font-medium">
                ⚠️ Feasibility by Operations Must be checked first!
              </p>
            )}
        </div>
        <div className="flex flex-col justify-start mb-4">
          <label
            htmlFor="status"
            className="whitespace-nowrap font-medium mb-2"
          >
            New Status:
          </label>
          <select
            id="status"
            name="status"
            value={newStatus ? newStatus : status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-2 py-3 w-full border rounded capitalize ${"border-[#8D8D8D] "}`}
          >
            <option value="">Select Status</option>
            {statusOptions.map((option) => (
              <option
                key={option.value}
                className="p-3 text-xs flex-wrap"
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {newStatus === "site negotiation" && (
          <div className="mt-4 flex flex-col">
            <label className="block font-medium mb-2">Landlord:</label>
            <p className="capitalize w-full">
              {data.landlords[0].customId} - {data.landlords[0].name}
            </p>
          </div>
        )}

        {newStatus === "investor and site confirmation" && (
          <div className="mt-4 flex flex-col justify-start">
            <label htmlFor="investor" className="block font-medium mb-2">
              Select Investor:
            </label>
            <select
              id="investor"
              name="investor"
              value={selectedInvestor}
              onChange={(e) => handleInvestor(e.target.value)}
              disabled={data.investors.length > 0}
              className="px-2 py-3 w-full border rounded capitalize border-[#8D8D8D]"
            >
              <option value="">Select Investor</option>
              {investors.map((investor) => (
                <option key={investor._id} value={investor._id}>
                  {investor.customId} - {investor.name}
                </option>
              ))}
            </select>
            {selectedInvestor && (
              <>
                <div className="mt-4 flex flex-col">
                  <label className="block font-medium mb-2">
                    Possible Budget:
                  </label>
                  <p className="capitalize w-full">{investorBudget}</p>
                </div>
                <div className="mt-4 flex flex-col">
                  <label className="block font-medium mb-2">
                    Possible Date:
                  </label>
                  {
                    <p className="capitalize w-full">
                      {new Date(possibleInvestmentDate).toLocaleDateString()}
                    </p>
                  }
                </div>
              </>
            )}
          </div>
        )}

        {/* {newStatus === "investor and site confirmation" && (
          <div className="mt-4 flex flex-col">
            <label className="block font-medium mb-2">Investor:</label>
            <p className="capitalize w-full">
              {data?.investors?.length > 0 ? (
                <>
                  {data.investors[0]?.investorId.customId} -
                  {data.investors[0]?.investorId.name}
                </>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        )} */}

        {renderAdditionalFields()}
        {selectedStatusDocs.length > 0 && (
          <div className="mt-4">
            <p className="font-medium mb-4">Uploaded Documents</p>
            <ul className="space-y-2">
              {selectedStatusDocs.map((doc) => (
                <li
                  key={doc._id}
                  className="flex items-center p-2 border rounded shadow"
                >
                  <FaFileAlt className="w-4 h-4 mr-4" />
                  <div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {doc.status} - {getFileName(doc.url)}
                    </a>
                    <p className="text-xs my-2">{doc.fileType}</p>
                    {/* <p className=" text-gray-500">{getFileName(doc.url)}</p> */}
                    <p className=" text-gray-500">
                      {new Date(doc.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
              <Toaster position="top-right" reverseOrder={false} />
            </ul>
          </div>
        )}

        {newStatus !== "site found" && (
          <button
            onClick={handleSubmit}
            className={`mt-4 rounded w-full bg-green-500 text-white p-4 disabled:bg-slate-500`}
            disabled={
              documentRequired ||
              isApprovalRequired ||
              isUploading ||
              (newStatus === "RMIA validation" &&
                !data.feasibilityDoneByOperations) ||
              (newStatus === "site complete" && sapCode === "") ||
              warning
            }
          >
            {isUploading ? "Saving File..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SiteStatusModal;
