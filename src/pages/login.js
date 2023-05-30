// React and Next.js imports
import { useEffect } from "react";
import { useRouter } from 'next/router';
import React from "react";

// Toaster related imports
import { errorToaster } from '@/components/toasters';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// JS Cookies import
import Cookies from 'js-cookie';

// Login Page definitions
const Login = () => {
  // Variable declaration and initialization
  const router = useRouter();

  // Pop toaster message if noTokens cookie is present
  useEffect(() => {
    const refresh = Cookies.get('noTokens');
    if (refresh === 'true') {
      Cookies.set('noTokens', false);
      errorToaster('Login to access your dashboard', 'top-center');
    }
  }, []);

  // Function call when the login button is pressed
  const loginPress = async () => {
    // Try to login
    try {
      // Send API request
      const res = await fetch(
        'http://127.0.0.1:5000/user/login/',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              "email": document.getElementById('email').value,
              "password": document.getElementById('password').value,
            }
          ),
        }
      );

      // Turn API request result into JSON
      const response = await res.json();

      // If the response is not OK, send error message
      if (!res.ok) {
        errorToaster(response['message']);
      }

      // If the login was a sucess, move to the dashboard and 
      // store information into a cookie
      else {
        // Extract data
        const data = JSON.parse(response['content']);

        // Store basic information into a cookie
        Cookies.set('firstName', data['first_name']);
        Cookies.set('lastName', data['last_name']);
        Cookies.set('email', data['email']);
        // Cookies.set('refresh', data['tokens']['refresh']);
        // Cookies.set('access', data['tokens']['access']);
        Cookies.set('success', "");

        // Move to the dashboard
        router.push('/dashboard/homepage');
      }

      // Catch any errors
    } catch (err) {
      // Print errors
      console.log(err);
    }
  };

  // Component return
  return (
    <div className="relative flex items-center justify-center bg-gradient-to-tr from-blue1 to-sky h-screen">
      <div className="bg-white/[0.6] rounded-2xl shadow-lg shadow-sky h-fit w-fit py-5">
        <div className="px-5 h-full flex flex-col gap-5">
          <div className="text-3xl">
            WingSuite Login
          </div>
          <div className="">
            <input 
              className="bg-white/[0.3] border border-silver rounded-lg shadow-lg text-gray-700 w-full focus:outline-none focus:shadow-outline p-1" 
              id="email" 
              type="text" 
              placeholder="Email" 
            />
          </div>
          <div className="">
            <input 
              className="bg-white/[0.3] border border-silver rounded-lg shadow-lg text-gray-700 w-full focus:outline-none focus:shadow-outline p-1" 
              id="password" 
              type="password"
              placeholder="Password" 
            />
          </div>
          <button 
            onClick={loginPress} 
            className="text-lg bg-sky/[0.8] rounded-md drop-shadow-lg px-3 py-0.5 w-fit hover:bg-white/[0.3] hover:-translate-y-[0.1rem] hover:shadow-xl">
            Log In
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

// Export the Login page
export default Login;