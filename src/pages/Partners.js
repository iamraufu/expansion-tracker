import React, { useState } from "react";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";
import { IoMdAddCircle } from "react-icons/io";

const contacts = [
  {
    id: 1234,
    name: "John Doe",
    phoneNumber: "+8801XXXXXXXXX",
    type: "investor",
  },
  {
    id: 5678,
    name: "Alice Smith",
    phoneNumber: "+8801XXXXXXXXX",
    type: "landlord",
  },
  {
    id: 9012,
    name: "Bob Johnson",
    phoneNumber: "+8801XXXXXXXXX",
    type: "investor",
  },
  {
    id: 3456,
    name: "Emma Brown",
    phoneNumber: "+8801XXXXXXXXX",
    type: "landlord",
  },
  {
    id: 7890,
    name: "Michael Davis",
    phoneNumber: "+8801XXXXXXXXX",
    type: "investor",
  },
  {
    id: 2345,
    name: "Sophia Wilson",
    phoneNumber: "+8801XXXXXXXXX",
    type: "landlord",
  },
  {
    id: 6789,
    name: "David Martinez",
    phoneNumber: "+8801XXXXXXXXX",
    type: "investor",
  },
  {
    id: 3123,
    name: "Olivia Garcia",
    phoneNumber: "+8801XXXXXXXXX",
    type: "landlord",
  },
  {
    id: 4567,
    name: "James Rodriguez",
    phoneNumber: "+8801XXXXXXXXX",
    type: "investor",
  },
  {
    id: 8901,
    name: "Isabella Lopez",
    phoneNumber: "+8801XXXXXXXXX",
    type: "landlord",
  },
];

const Partners = () => {
  return (
    <section className="partner accuisition text-sm  padding-x font-poppins">
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
            {contacts.map((contact) => (
              <tr className="odd:bg-slate-100" key={contact.id}>
                <td className=" px-4 py-2 text-secondary underline font-medium">
                  {contact.id}
                </td>
                <td className=" px-4 py-2">{contact.name}</td>
                <td className=" px-4 py-2">{contact.phoneNumber}</td>
                <td className=" px-4 py-2 capitalize">{contact.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-evenly items-center gap-2 mt-4 ">
        <button className="w-full px-3 py-3 rounded-md bg-green-600 text-white font-medium flex justify-center items-center gap-2">
          <IoMdAddCircle className="w-5 h-5" />
          <p>Add New Investor</p>
        </button>
        <button className="w-full  px-3 py-3 rounded-md bg-blue-600 text-white font-medium flex justify-center items-center gap-2">
          <IoMdAddCircle  className="w-5 h-5"/>
          <p>Add New Investor</p>
        </button>
      </div>
    </section>
  );
};

export default Partners;
