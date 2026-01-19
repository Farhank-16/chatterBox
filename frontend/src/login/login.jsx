import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { MdEmail, MdLock } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', userInput);
      
      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success("Welcome back!");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-gray-100">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Login <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">ChatterBox</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Welcome back! Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdEmail className="text-gray-400 group-focus-within:text-rose-500 transition-colors text-xl" />
            </div>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="name@gmail.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdLock className="text-gray-400 group-focus-within:text-rose-500 transition-colors text-xl" />
            </div>
            <input
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link to="/" className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors">
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button 
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 font-bold tracking-tighter">
          New to ChatterBox?{" "}
          <Link to="/register" className="text-rose-500 font-bold hover:underline decoration-2 underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;