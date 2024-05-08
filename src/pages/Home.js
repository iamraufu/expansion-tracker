import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
      return (
            <div className='w-1/3 mx-auto mt-5 p-3 border text-center'>
                  <h1>Homepage</h1>
                  <Link to='/dashboard' className='underline text-sky-900'>Dashboard</Link>
            </div>
      );
};

export default Home;