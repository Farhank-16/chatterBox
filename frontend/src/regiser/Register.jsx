import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Register = () => {
const navigate = useNavigate()

const {setAuthUser} = useAuth();
 
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({})

  const handleInput = (e) => {
    setInputData({
      ...inputData , [e.target.id]:e.target.value
    })
  }
console.log(inputData)
  const selectGender=(selectGender)=>{
    setInputData((prev)=>({
      ...prev , gender:selectGender === inputData.gender ? '' : selectGender
    }))
  }

  const handleSubmit =async(e) => {
    e.preventDefault();
    setLoading(true)
     if(inputData.password !== inputData.confpassword.toLowerCase()){
          setLoading(false)
        return toast.error("Password Doesn't Match")
      }
      try {
        const regiser = await axios.post(`/api/auth/register` , inputData);
        const data = regiser.data;
        if(data.success === false){
          setLoading(false)
          toast.error(data.message)
          console.log(data.message);
        }

        toast.success(data?.message);
      localStorage.setItem("chatter",JSON.stringify(data));
      setAuthUser(data)
       setLoading(false)
       navigate('/login')
      } catch (error) {
        setLoading(false);
              console.log(error);
              toast.error(error?.response?.data?.message)
        
      }

  };

  return (
    <div>
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-white">
        <h1 className="text-3xl font-bold text-center text-gray-300">
          Register <span className="text-rose-700">ChatterBox</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          {/* Fullname */}
          <div className="mb-4">
            <label className="font-medium text-gray-900 text-xl label-text">
              Name
            </label>
            <input
              id="fullname"
              type="text"
              onChange={handleInput}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            />
          </div>

          {/* Fullname */}
          <div className="mb-4">
            <label className="font-medium text-gray-900 text-xl label-text">
              Username
            </label>
            <input
              id="username"
              type="text"
              onChange={handleInput}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="font-medium text-gray-900 text-xl label-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="font-medium text-gray-900 text-xl label-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="flex-gap-2 mb-4">
            <label className="font-medium text-gray-900 text-xl label-text">
              Confirm Password
            </label>
            <input
              id="confpassword"
              type="text"
              onChange={handleInput}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
            />
          </div>

          {/* Gender */}
          <div id="gender" className="mb-4 flex gap-2 ">
           
            {/* Male */}
            <label className="flex  justify-between cursor-pointer">
              <span className="text-gray-950 font-semibold ">Male</span>
              <input
              onChange={()=>selectGender('male')}
              checked ={inputData.gender === 'male'}
               type="checkbox" className="peer hidden mb-6" />
              <span className="h-6 w-6 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-indigo-500 peer-checked:border-indigo-500">
                ✔
              </span>
            </label>
            {/* Female */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-950 font-semibold ">Female</span>
              <input
               onChange={()=>selectGender('female')}
               checked ={inputData.gender === 'female'}
              type="checkbox" className="peer hidden" />
              <span className="h-6 w-6 border-2 border-gray-400 rounded-md flex items-center justify-center peer-checked:bg-indigo-500 peer-checked:border-indigo-500">
                ✔
              </span>
            </label>
          </div>

          {/* Register Button */}
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold mb-4 transition">
            {loading ? "loading.." : "Register"}
          </button>
        </form>

        {/* Extra Links */}
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-300">
            Already have an Account ?{" "}
            <Link to={"/login"}>
              <span
                className="text-gray-950 font-bold
          underline curso-pointer hover:text-sky-600"
              >
                Login
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
