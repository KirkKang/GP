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
          w-full 
          max-w-xs        /* 手機最大寬度 20rem (320px) */
          sm:max-w-md     /* 小平板以上 28rem (448px) */
          md:max-w-4xl    /* 中螢幕以上 56rem (896px) */
          px-4            /* 手機左右 padding */
          sm:px-6         /* 小平板 padding */
          md:px-16        /* 桌面寬內距 */
          py-6 
          max-h-[90vh] 
          overflow-y-auto
          mx-4            /* 手機左右 margin，避免貼邊 */
          md:mx-auto      /* 桌面置中 */
        "
      >
        <button
          className="absolute top-4 right-4 text-gray-300 text-3xl"
          onClick={() => setIsModelOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
