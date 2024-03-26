import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white opacity-75">
      <div className="h-20 w-20 animate-spin rounded-full border-t-8 border-blue-500"></div>
      <p className="ml-4 text-gray-600">
        Loading data, please wait a moment...
      </p>
    </div>
  );
};

export default LoadingSpinner;
