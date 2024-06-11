import React, { useEffect, useState } from "react";
import activeTaskIcon from "../../assets/icons/activeTaskIcon.png";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const TaskList = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;
  const { user } = useAuth();

  const [isCompleteFilter, setIsCompleteFilter] = useState(false);

  // console.log(user);

  useEffect(() => {
    let filter =
      user.role === "admin"
        ? { isComplete: isCompleteFilter }
        : user.role !== "manager"
        ? { createdBy: user._id, isComplete: isCompleteFilter }
        : { createdBy: user.employees, isComplete: isCompleteFilter };

    const fetchData = async () => {
      try {
        const response = await fetch(`${api_url}/tasks`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            authorization: user.token,
          },
          body: JSON.stringify(filter),
        });
        const json = await response.json();
        console.log(json.tasks);
        console.log(json.message);
        if (json.status) {
          setData(json.tasks);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [
    api_url,
    user.token,
    user.role,
    user._id,
    user.employees,
    isCompleteFilter,
  ]);

  // const handleToggleComplete = (taskId) => {
  //   setData((prevData) =>
  //     prevData.map((task) =>
  //       task._id === taskId ? { ...task, isComplete: !task.isComplete } : task
  //     )
  //   );
  // };

  if (data === null) {
    return <p>Loading...</p>;
  }

  return (
    <section className="partner-accuisition text-xs lg:px-1 sm:px-16 px-5 font-poppins max-container ">
      <div className="page-title pb-3 border-b-2 border-b-slate-700 flex justify-start items-center font-medium  font-poppins mt-5 gap-3">
        <img
          src={activeTaskIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm md:text-base font-semibold ">
          Daily Activity Tracker
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <label>
            Show completed tasks
            <input
              type="checkbox"
              checked={isCompleteFilter}
              onChange={() => setIsCompleteFilter((prev) => !prev)}
              className="ml-2"
            />
          </label>
        </div>
      </div>

      <div className="overflow-x-auto text-xs md:text-sm rounded-md mt-4 border-2 border-slate-900 h-[60dvh]">
        <table className="w-full table-auto border-0 ">
          <thead className="bg-secondary text-white text-left">
            <tr className="bg-secondary">
              <th className=" px-4 py-2">Date</th>
              <th className=" px-4 py-2">District</th>
              <th className=" px-4 py-2">Upazila</th>
              <th className=" px-4 py-2">Type</th>
              <th className=" px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody className="font-medium ">
            {data.map((task) => {
              const startTime = new Date(task.startDateTime).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              );
              const endTime = new Date(task.endDateTime).toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
              );
              // const startDate = new Date(task.startDateTime).toLocaleDateString(
              //   [],
              //   {
              //     year: "numeric",
              //     month: "long",
              //     day: "numeric",
              //   }
              // );
              const endDate = new Date(task.endDateTime).toLocaleDateString(
                [],
                {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );

              return (
                <tr className="odd:bg-slate-100 capitalize" key={task._id}>
                  <td className="px-4 py-2 cursor-pointer font-medium whitespace-nowrap">
                    <p>{`${startTime} - ${endTime}`}</p>
                    <p>{`${endDate}`}</p>
                  </td>
                  <td className="px-4 py-2">{task.district}</td>
                  <td className="px-4 py-2">{task.upazila}</td>
                  <td className="px-4 py-2">{task.task}</td>
                  <td    onClick={() => {navigate(`/task/${task._id}/`)}} className="px-4 py-2 capitalize underline text-secondary cursor-pointer">
                    Details
                  </td>
                  {/* <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={task.isComplete}
                      onChange={() => handleToggleComplete(task._id)}
                    />
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate("/addTask")}
        className="px-3 py-3 rounded-md w-full mt-4 bg-primary hover:bg-secondary text-white font-medium flex justify-center items-center gap-2"
      >
        <IoMdAddCircle className="w-5 h-5" />
        <p>Add New Task</p>
      </button>
    </section>
  );
};

export default TaskList;
