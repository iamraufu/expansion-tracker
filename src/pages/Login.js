import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';
import userData from '../data/user.json'

const Login = () => {

      let navigate = useNavigate();
      let location = useLocation();
      let from = location.state?.from?.pathname || "/";
      const { user, setUser } = useAuth();
      console.log(user)

      // Added later for error debugging
      useEffect(() => {
            user?.email && navigate(from, { replace: true })
      }, [from, navigate, user?.email])

      const { register, handleSubmit, formState: { errors } } = useForm();
      const onSubmit = data => processLogin(data);
      const [loginError, setLoginError] = useState('');

      const processLogin = (formData) => {

            const fetchData = async () => {
                  try {
                        const tempUser = userData.find(u => u.email === formData.email && u.password === formData.password) || {}
                        console.log(tempUser)
                        if (tempUser.email) {
                              setUser(tempUser)
                              setLoginError('')
                              localStorage.setItem('uId', tempUser._id)
                        }
                        else {
                              setLoginError("Invalid Email or Password")
                        }
                  } catch (error) {
                        fetchData();
                  }
            };
            fetchData();
      }

      return (
            <div className='mx-auto d-block border-2 w-1/3 mt-5 p-3'>
                  <Link to='/' className='text-blue-500 underline'>Homepage</Link>
                  <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="my-2">
                              <input placeholder='Enter Email' autoComplete={`email`} className='w-full p-2 border-2 border-emerald-600 focus:outline-emerald-800 rounded' type='email' {...register("email", { required: true })} />
                              <br />
                              {errors.email && <span className='text-rose-500'>*Email required</span>}
                        </div>

                        <div className="my-2">
                              <input placeholder='Enter Password' autoComplete={`current-password`} className='w-full p-2 border-2 border-emerald-600 focus:outline-emerald-800 rounded' type='password' {...register("password", { required: true })} />
                              <br />
                              {errors.password && <span className='text-rose-500'>*Password required</span>}
                        </div>

                        <p className='my-2 text-rose-900 font-bold'>{loginError}</p>
                        <input type="submit" className='bg-green-700 hover:bg-green-800 text-white w-[100%] py-2 rounded-md' value='Sign in' />
                  </form>
            </div>
      );
};

export default Login;