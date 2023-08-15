// Import
import { toast } from "react-toastify";

// Function for success toaster
export const successToaster = (message, position = "top-right") => {
  // Toast execution
  return toast.success(message, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
};

// Function for info toaster
export const infoToaster = (
  message,
  position = "top-right",
  autoClose = 5000
) => {
  // Toast execution
  return toast.info(message, {
    position: position,
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
};

// Function for error toaster
export const errorToaster = (message, position = "top-right") => {
  // Toast execution
  return toast.error(message, {
    position: position,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
  });
};
