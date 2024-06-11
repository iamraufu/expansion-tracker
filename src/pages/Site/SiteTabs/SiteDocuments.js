/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useOutletContext } from "react-router-dom";
import { BiEdit, BiUpload } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

import { useParams } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuth from "../../../hooks/useAuth";
import { expansionDB } from "../../../firebase/config";




const SiteDocuments = () => {
  const { outletData: data, fetchData } = useOutletContext();
  const documents = data.documents;
  const [filter, setFilter] = useState("");
  const status = [
    ...new Set(data.documents.map((doc) => doc.status)),
    ...new Set(data.documents.map((doc) => doc.fileType)),
  ];

  const { user } = useAuth();
  let { id } = useParams();
  const api_url = process.env.REACT_APP_API_URL;

  // update document
  const [newStatus, setNewStatus] = useState(data.status);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [documentURL, setDocumentURL] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    {
      label: "feasibility waiting for approval",
      value: "feasibility waiting for approval",
    },
    {
      label: "feasibility done by operations",
      value: "feasibility done by operations",
    },
    {
      label: "feasibility approved",
      value: "feasibility approved",
    },

    {
      label: "docs collected",
      value: "docs collected",
    },
    {
      label: "layout approved",
      value: "layout approved",
    },
    {
      label: "site ready",
      value: "site ready",
    },
    {
      label: "product arrived",
      value: "product arrived",
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

  const handleModalSwitch = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const getFileName = (url) => {
    const parts = url.split("%2F");
    const filePart = parts[parts.length - 1].split("?")[0];
    const dateIndex = filePart.indexOf("_");
    return dateIndex !== -1 ? filePart.slice(dateIndex + 1) : filePart;
  };

  const handleStatusChange = (value) => {
    const existingStatusIndex = data.statusDetails.findIndex(
      (detail) => detail.status === value
    );
    if (existingStatusIndex !== -1) {
      // Update the existing status entry
      setNewStatus(value);
    } else {
      toast.error("Site has not reached this status yet");
    }
  };

  const filteredDocuments = filter
    ? documents.filter(
        (doc) => doc.status === filter || doc.fileType === filter
      )
    : documents;

  const handleSubmit = async () => {
    let documentURL = "";

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
    }else{
      toast.error("Select a document first!")
      return
    }

    console.log({ documentURL });

    // Find the index of the existing status in the statusDetails array
    const existingStatusIndex = data.statusDetails.findIndex(
      (detail) => detail.status === newStatus
    );

    let updatedStatusDetails = [...data.statusDetails];

    if (existingStatusIndex !== -1) {
      // Update the existing status entry
      updatedStatusDetails[existingStatusIndex] = {
        ...updatedStatusDetails[existingStatusIndex],
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Add a new status entry
      toast.error("Site has not reached this status yet");
      return;
    }

    let updatedData = {
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

    

    console.log({ updatedData });

    try {
      const response = await fetch(`${api_url}/site/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const responseData = await response.json();
      if (responseData.status) {
        toast.success(responseData.message);
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

  return (
    <div className="text-xs md:text-sm lg:px-1 sm:px-16 px-4 font-poppins max-container mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-base font-bold ">Documents</h1>
        {documents.length > 0 && <button
          onClick={() => handleModalSwitch()}
          className=" px-3 py-2 shadow   border-2 rounded-md border-green-600 font-medium flex justify-center items-center gap-3 bg-green-600  hover:bg-green-700 text-white"
        >
          <BiUpload className="h-5 w-5" />
          <p className="font-semibold text-xs md:text-sm">
            Upload Document
          </p>
        </button>}
      </div>

      {documents.length > 0 ? (
        <>
          <div className="mb-4">
            <label htmlFor="filter" className="block text-sm font-medium mb-2">
              Filter by Type:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              {status.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <ul className="space-y-4">
            {filteredDocuments.map((doc) => (
              <li
                key={doc._id}
                className="flex items-center p-4 border rounded shadow"
              >
                <FaFileAlt className="w-6 h-6 mr-4" />
                <div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline capitalize"
                  >
                    {doc.status} - {getFileName(doc.url)}
                  </a>
                  {/* <p className="text-sm text-gray-500">{}</p> */}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(doc.createdAt).toDateString()} -
                    {new Date(doc.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {isModalOpen && (
            <>
              <div className="absolute bg-black/30 h-[100dvh] top-0 left-0 w-full flex justify-center items-center">
                <div className="bg-white w-11/12 md:w-3/4 p-8 mb-12 rounded-md text-xs md:text-base">
                  <h1 className="text-center underline text-base mb-8 flex justify-between items-center">
                    <p>Upload File</p>
                    <button
                      className="hover:bg-red-700 p-1 hover:text-white rounded-full"
                      onClick={() => handleModalSwitch()}
                    >
                      <RxCross2 className="w-6 h-6" />
                    </button>
                  </h1>

                  <div className="flex flex-col justify-start mb-4">
                    <label
                      htmlFor="status"
                      className="whitespace-nowrap font-medium mb-2"
                    >
                      Select Status:
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newStatus}
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

                  {newStatus === "docs collected" && (
                    <div className="flex flex-col justify-start mb-4">
                      <label
                        htmlFor="status"
                        className="whitespace-nowrap font-medium mb-2"
                      >
                        Select Doc Type:
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className={`px-2 py-3 w-full border rounded capitalize ${"border-[#8D8D8D] "}`}
                      >
                        <option className="p-3 text-xs flex-wrap" value="">
                          Select Status
                        </option>
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
                  )}

                  <div className="mt-4 flex flex-col">
                    <label
                      htmlFor="document"
                      className="block font-medium mb-2"
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

                  {
                    <button
                      onClick={handleSubmit}
                      className={`mt-4 rounded w-full bg-green-500 text-white p-4 disabled:bg-slate-500`}
                    >
                      {isUploading ? "Saving File..." : "Submit"}
                    </button>
                  }
                </div>
                <Toaster position="top-right" reverseOrder={false} />
              </div>
            </>
          )}
        </>
      ) : (
        <p>No documents available.</p>
      )}
    </div>
  );
};

export default SiteDocuments;
