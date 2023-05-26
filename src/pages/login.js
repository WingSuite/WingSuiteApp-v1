// React and Next.js imports
import { useCallback, useEffect } from "react";
import { useRouter } from 'next/router';
import React from "react";

// Toaster related imports
import { errorToaster } from '@/components/toasters';
import { ToastContainer } from 'react-toastify';

// Particles imports
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";

// JS Cookies import
import Cookies from 'js-cookie';

// Login Page definitions
const Login = () => {
  // Variable declaration and initialization
  const router = useRouter();

  // Particle settings 
  const particlesSettings = {
    background: {
      color: {
        value: "#0d47a1",
      },
      opacity: 0
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#808080",
      },
      move: {
        directions: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 300,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  }

  // Particle engine initialization
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

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
        '<API LOGIN URL NEEDED>',
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
      const data = await res.json();

      // Check if the response is not OK
      if (!res.ok) {
        // Check if the email has any issues
        if (Array.isArray(data['email'])) {
          // Print email's issue
          errorToaster("Email: " + data['email'][0]);
        }

        // Check if the password has any issues
        if (Array.isArray(data['password'])) {
          // Print password's issue
          errorToaster("Password: " + data['password'][0]);
        }

        // Check if details appear in the response
        if ('detail' in data) {
          // Check if the 
          errorToaster(data['detail']);
        }
      }

      // If the login was a sucess, move to the dashboard and 
      // store information into a cookie
      else {
        // Store basic information into a cookie
        Cookies.set('firstName', data['firstname']);
        Cookies.set('lastName', data['lastname']);
        Cookies.set('profileImage', data['profile_image']);
        Cookies.set('refresh', data['tokens']['refresh']);
        Cookies.set('access', data['tokens']['access']);
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
    <div className="relative flex items-center justify-center bg-gradient-to-tr from-blue1 to-white h-screen">
      {/* <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesSettings}
      /> */}
      <div className="bg-white rounded-xl shadow-2xl h-1/4 w-1/7">
        <div className="px-5 h-full flex flex-col justify-around">
          <div className="text-3xl">
            WingSuite Login
          </div>
          <div className="">
            <input 
              className="shadow-lg border border-silver rounded text-gray-700 w-full focus:outline-none focus:shadow-outline p-1" 
              id="email" 
              type="text" 
              placeholder="Email" 
            />
          </div>
          <div className="">
            <input 
              className="shadow-lg border border-silver rounded text-gray-700 w-full focus:outline-none focus:shadow-outline p-1" 
              id="password" 
              type="password"
              placeholder="Password" 
            />
          </div>
          <button 
            onClick={loginPress} 
            className="w-1/4 text-lg bg-sky rounded-md drop-shadow-lg hover:bg-darksky hover:-translate-y-[0.1rem] hover:shadow-lg">
            Login
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