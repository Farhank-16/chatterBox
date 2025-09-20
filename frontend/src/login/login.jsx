import axios from "axios";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdEmail } from "react-icons/md";


const Login = () => {

  const navigate = useNavigate();

  const {setAuthUser} = useAuth();
  
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };
  console.log(userInput);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post('/api/auth/login', userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }

      toast.success(data.message);
      localStorage.setItem("chatapp",JSON.stringify(data));
      setAuthUser(data)
      setLoading(false)
      navigate('/')
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl text-white">
      <h1 className="text-3xl font-bold text-center text-gray-950">
        Login <span className="text-rose-600">ChatterBox</span>
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col text-black">
        {/* Email Field */}
        <div className="mb-4">
  <label className="font-medium text-gray-900 text-xl label-text">
    Email
  </label>

  <div className="relative">
    <input
      id="email"
      type="email"
      onChange={handleInput}
      placeholder="Enter your email"
      required
      className="w-full px-4 py-2 pr-10 rounded-lg bg-white/20 focus:bg-white/30 outline-none"
    />
    <MdEmail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800 text-xl" />
  </div>
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

        {/* Login Button */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold mb-4 transition">
          {loading ? "loading..":"Login"}
        </button>
      </form>

      {/* Extra Links */}
      <div className="pt-2">
        <p className="text-sm font-semibold text-gray-300">
          Don't have an Account ?
          <Link to={"/register"}>
            <span
              className="text-gray-950 font-bold
          underline curso-pointer hover:text-sky-600"> Register Now!!
            </span>
          </Link>
        </p>
        <p className="text-sm font-semibold text-gray-300">
          Forgot Password?
          <Link to={"/"}>
            <span
              className="text-gray-950 font-bold
          underline curso-pointer hover:text-sky-600"> Click Me!
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
