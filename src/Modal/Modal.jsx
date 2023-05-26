import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";

const Modal = ({ show, onChange, onClose, currentUser }) => {
  const [inputValue, setInputValue] = useState("");
  const handleData = (event, currentUser) => {
    event.preventDefault();
  };

  return (
    <div className="">
      <div
        className={`flex  justify-center items-center h-screen w-screen fixed top-0 left-0 overflow-hidden  bg-black bg-opacity-60 transition-opacity duration-300 z-[100]
         ${show ? "block" : "hidden"}`}
      >
        <div className="bg-white  h-[200px] md:max-h-[400px]  w-full md:w-[517px] rounded-sm mx-4 md:mx-0 ">
          <div className="flex items-center justify-between px-5 pt-2 ">
            <h2 className="font-bold text-[20px] text-[#1D1D1D]">Add a Note</h2>
            <button
              className="flex items-center justify-center p-2 rounded-full shadow-md text-white bg-[#1D1D1D]"
              onClick={onClose}
            >
              <VscChromeClose className="text-white" />
            </button>
          </div>
          <form onSubmit={handleData} className="hidden md:block">
            <div className="flex flex-col gap-4 px-5 mt-5 ">
              <div className="w-full m-auto ">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="What's happening?"
                  onChange={(event) => setInputValue(event.target.value)}
                  value={inputValue}
                  className="bg-gray-200 border rounded-sm w-full pl-2 h-[45px] text-black focus:outline-none"
                />
              </div>
              <div className="">
                <button
                  type="submit"
                  className="bg-black text-white rounded h-[45px] w-[160px] mt-4 font-semibold"
                  onClick={() => {
                    if (inputValue.length !== 0) {
                      onChange(inputValue);
                      setInputValue("");
                    }
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </form>
          <form onSubmit={handleData} className="block md:hidden">
            <div className="flex items-center justify-center gap-4 px-5 mt-12 ">
              <input
                type="text"
                name=""
                id=""
                placeholder="What's happening?"
                onChange={(event) => setInputValue(event.target.value)}
                value={inputValue}
                className="bg-gray-200 border rounded-sm w-full pl-2 h-[45px] text-black focus:outline-none"
              />

              <button
                type="submit"
                className="bg-black text-white rounded h-[45px] w-[100px]  font-semibold"
                onClick={() => {
                  if (inputValue.length !== 0) {
                    onChange(inputValue);
                    setInputValue("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
