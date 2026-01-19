import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { MdEmail, MdLock, MdPerson, MdBadge, MdCheckCircle, MdVisibility, MdVisibilityOff } from "react-icons/md";

// Strong Password Regex: 8+ chars, 1 Upper, 1 Lower, 1 Number, 1 Special Character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputData, setInputData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confpassword: "",
    gender: ""
  });

  const handleInput = (e) => {
    setInputData({ ...inputData, [e.target.id]: e.target.value });
  };

  const selectGender = (gender) => {
    setInputData((prev) => ({ ...prev, gender: gender === inputData.gender ? '' : gender }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Password Strength
    if (!PASSWORD_REGEX.test(inputData.password)) {
      return toast.error("Password does not meet security requirements.");
    }

    // 2. Check Password Match
    if (inputData.password !== inputData.confpassword) {
      return toast.error("Passwords do not match");
    }

    // 3. Check Gender
    if (!inputData.gender) {
      return toast.error("Please select a gender");
    }

    setLoading(true);
    try {
      const register = await axios.post(`/api/auth/register`, inputData);
      const data = register.data;
      
      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success("Account created successfully!");
      localStorage.setItem("chatter", JSON.stringify(data));
      setAuthUser(data);
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Validation Logic for Checklist
  const checks = {
    length: inputData.password.length >= 8,
    upperLower: /[a-z]/.test(inputData.password) && /[A-Z]/.test(inputData.password),
    numberSymbol: /\d/.test(inputData.password) && /[@$!%*?&]/.test(inputData.password),
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Create <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">Account</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">Join the conversation at ChatterBox</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Username Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Full Name</label>
            <div className="relative group">
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input id="fullname" type="text" onChange={handleInput}  value={FormData.fullname} placeholder="John Doe" required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Username</label>
            <div className="relative group">
              <MdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input id="username" type="text" onChange={handleInput} placeholder="johndoe" required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Email Address</label>
          <div className="relative group">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
            <input id="email" type="email" onChange={handleInput} placeholder="john@example.com" required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all text-sm" />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Password</label>
            <div className="relative group">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input id="password" type={showPassword ? "text" : "password"} onChange={handleInput} placeholder="••••••" required
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all text-sm" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-1 ml-1 uppercase tracking-widest">Confirm</label>
            <div className="relative group">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
              <input id="confpassword" type={showPassword ? "text" : "password"} onChange={handleInput} placeholder="••••••" required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-rose-500 transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* Password Requirement Checklist */}
        {inputData.password.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${checks.length ? 'bg-green-500' : 'bg-gray-200'}`}>
                {checks.length && <MdCheckCircle className="text-white text-[10px]" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${checks.length ? 'text-green-600' : 'text-gray-400'}`}>8+ Characters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${checks.upperLower ? 'bg-green-500' : 'bg-gray-200'}`}>
                {checks.upperLower && <MdCheckCircle className="text-white text-[10px]" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${checks.upperLower ? 'text-green-600' : 'text-gray-400'}`}>A-z Case Mix</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${checks.numberSymbol ? 'bg-green-500' : 'bg-gray-200'}`}>
                {checks.numberSymbol && <MdCheckCircle className="text-white text-[10px]" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${checks.numberSymbol ? 'text-green-600' : 'text-gray-400'}`}>Number & Symbol</span>
            </div>
          </div>
        )}

        {/* Gender Selection */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">Gender</label>
          <div className="flex gap-4">
            <GenderBtn label="Female" active={inputData.gender === 'male'} onClick={() => selectGender('male')} />
            <GenderBtn label="Male" active={inputData.gender === 'female'} onClick={() => selectGender('female')} />
          </div>
        </div>

        <button disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-[0.98] transition-all flex justify-center items-center mt-6 disabled:opacity-50">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Create Account"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400 font-bold  tracking-tighter">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-500 font-bold hover:underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

// Gender Button Component
const GenderBtn = ({ label, active, onClick }) => (
  <button type="button" onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${active ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'}`}>
    {active && <MdCheckCircle size={14} />} {label}
  </button>
);

export default Register;