import React from "react";

const Modal = ({ onClose, onConfirm, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <p>{children}</p>
        <div className="flex justify-end mt-2">
          <button className="mr-2 p-1 bg-red-500 text-white" onClick={onConfirm}>
            Yes
          </button>
          <button className="p-1 bg-gray-300" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
