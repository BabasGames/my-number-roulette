import React from 'react';

const Button = ({ children, className, ...props }) => {
    return (
      <button
        className={`px-4 py-2 font-semibold text-white bg-blue-500 rounded ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  