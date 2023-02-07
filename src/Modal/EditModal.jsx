

import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";



const EditModal = ({ showEdit, onClose, onChange, currentUser , handleSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(inputValue);
    setInputValue("")
  }
  return (
    <div
      className={`flex  justify-center items-center h-screen w-screen fixed top-0 left-0 overflow-hidden  bg-black bg-opacity-60 transition-opacity duration-300 z-[100]
         ${
          showEdit ? "block" : "hidden"
      }`}
    >
      <div className="bg-white  h-[200px] md:max-h-[400px]  w-full md:w-[517px] rounded-sm mx-4 md:mx-0 ">
        <div className="flex items-center justify-between px-5 pt-2 ">
          <h2 className="font-bold text-[20px] text-[#1D1D1D]">Edit a  Note</h2>
          <button className="flex items-center justify-center p-2 rounded-full shadow-md text-white bg-[#1D1D1D]" onClick={onClose}><VscChromeClose className="text-white" /></button>
        </div>
        <form  onSubmit={handleFormSubmit}  className="block md:hidden">
            <div className="flex items-center justify-center gap-4 px-5 mt-12 ">
              <input
                type="text"
                name=""
                id=""
                placeholder="What's happening?"
                onChange={event => setInputValue(event.target.value)}
                value={inputValue}
                className='bg-gray-200 border rounded-sm w-full pl-2 h-[45px] text-black focus:outline-none'
              />

                <button
                type="submit"
                    className='bg-black text-white rounded h-[45px] w-[100px]  font-semibold'
                >
                  Update
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
