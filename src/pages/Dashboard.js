import React from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Dashboard = () => {

      const { user, logOut } = useAuth()

      return (
            <div className='w-1/3 mx-auto border mt-5 p-5'>
                  <h1>Dashboard</h1>
                  <Link to='/' className='underline text-sky-900'>Homapage</Link>
                  <p className='text-green-600 text-center font-bold'>{user.name}</p>
                  <button onClick={logOut} className='bg-rose-500 hover:bg-rose-700 w-full mt-5 py-2 text-white'>Logout</button>
            </div>
      );
};

export default Dashboard;