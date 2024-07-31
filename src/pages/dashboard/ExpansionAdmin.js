import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ImSpinner2 } from "react-icons/im";
import toast, { Toaster } from "react-hot-toast";

const ExpansionAdmin = () => {
  const [data, setData] = useState(null);
  const [managers, setManagers] = useState([]);
  // const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("user");
  // const navigate = useNavigate();
  const api_url = process.env.REACT_APP_API_URL;
  const { user } = useAuth();


  const fetchData = async () => {
    setData(null);
    try {
      const response = await fetch(`${api_url}/user/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: user.token,
        },
        body: JSON.stringify(),
      });
      const json = await response.json();
      console.log(json);
      if (json.status) {
        setData(json.users);
        const managers = json.users.filter((item) => item.role === "manager");
        setManagers(managers);
        // const users = json.users.filter((item) => item.role === "user");
        // setUsers(users);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
   
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleManagerAssign = async (userId, managerId) => {
    console.log(userId, managerId);
    try {
      const response = await fetch(`${api_url}/services/managerAssign`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          authorization: user.token,
        },
        body: JSON.stringify({ userId, managerId }),
      });
      const json = await response.json();
      console.log(json);
      if(response.ok){
        toast.success("Manager assigned successfully")
        fetchData();
      }else{
        toast.success("Failed to assign manager")
      }
    } catch (error) {
      console.error("Error assigning manager:", error);
    }
  };

  if (data === null) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <ImSpinner2 className="w-14 h-1/4 animate-spin " />
      </div>
    );
  }

  return (
    <div  className="bg-white overflow-hidden sm:rounded-lg max-container mx-auto">
      <div className="p-3">
        <p className="font-medium font-poppins text-lg p-4 ">Users Table</p>
        <div className="p-4">
          <label htmlFor="role" className="mr-2">
            Filter by Role:{" "}
          </label>
          <select
            id="role"
            value={roleFilter}
            onChange={handleRoleChange}
            className="border rounded p-2"
          >
            {/* <option value="all">All</option> */}
            <option value="user">User</option>
            {/* <option value="admin">Admin</option> */}
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className=" overflow-auto shadow">
          <table className="min-w-full shadow-md p-3 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Manager
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                {roleFilter === "user" && data && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(
                (user) =>
                  user.role === roleFilter && (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.managers[0]? user.managers[0].name : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                      </td>
                      {roleFilter === "user" && data && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.role === "user" && (
                            <select
                              className="border rounded p-2"
                              defaultValue={user.managers[0]? user.managers[0]._id : ""}
                              onChange={(e) =>
                                handleManagerAssign(user._id, e.target.value)
                              }
                            >
                              <option value="">Assign Manager</option>
                              {managers.map((manager) => (
                                <option key={manager._id} value={manager._id}>
                                  {manager.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      )}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default ExpansionAdmin;
