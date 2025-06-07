import React from 'react'

const Modal = ({ isModelOpen, setIsModelOpen, children }) => {
  if (!isModelOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="
          relative 
          bg-white 
          rounded-lg 
          shadow-lg 
          max-w-md   /* 最大寬度 md = 28rem */
          w-full     /* 寬度撐滿可用空間 */
          mx-4      /* 左右外距，避免貼邊 */
          py-6 
          max-h-[90vh] 
          overflow-y-auto
        "
      >
        <button
          className="absolute top-2 right-4 text-gray-500 text-3xl"
          onClick={() => setIsModelOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal
