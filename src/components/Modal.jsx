import React from 'react'

const Modal = ({ isModelOpen, setIsModelOpen, children }) => {
  if (!isModelOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
      <div className='relative bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md sm:p-6 p-4'>
        <button
          className='absolute top-2 right-4 text-gray-400 text-2xl'
          onClick={() => setIsModelOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal
