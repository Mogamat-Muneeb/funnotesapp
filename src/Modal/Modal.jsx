import React, { useState } from "react";
import { VscChromeClose } from "react-icons/vsc";



const Modal = ({ show, onChange,onClose, currentUser }) => {
  const [inputValue, setInputValue] = useState("");
  const handleData = (event) =>{
    event.preventDefault();
    }
    console.log(inputValue, "inputValue");
  return (
    <div className=" ">
    <div
      className={`flex justify-center items-center h-screen w-screen fixed top-0 left-0 overflow-hidden  bg-black bg-opacity-60 transition-opacity duration-300 z-[100]
         ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="bg-white  h-[200px] md:max-h-[400px]  w-full md:w-[517px] rounded-sm ">
        <div className=" flex justify-between items-center px-10 pt-2 ">
          <h2 className="font-semibold text-[#1D1D1D]">Add a  Notes</h2>
          <button className="shadow  flex items-center justify-center rounded-full p-2 hover:text-white" onClick={onClose}><VscChromeClose className="text-[#1D1D1D]" /></button>
        </div>
        <form onSubmit={handleData}>
            <div className=" px-10 flex flex-col gap-4 mt-5">
              <div className=" w-full  m-auto ">
              <input
                type="text"
                name=""
                id=""
                placeholder="What's happening?"
                onChange={event => setInputValue(event.target.value)}
                value={inputValue}
                className='bg-gray-200 border rounded-sm w-full pl-2 h-[45px] text-black focus:outline-none'
              />
              </div>
              <div className="">
                <button
                type="submit"
                    className='bg-black text-white rounded h-[45px] w-[160px] mt-4'
                    onClick={() => {
                    if (inputValue.length!==0) {
                      onChange(inputValue);
                      setInputValue("");
                    } 
                  }}
                >
                  Add Note
                </button>
              </div>
            </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Modal;

