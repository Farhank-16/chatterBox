import { useEffect, useState } from "react";
import Login from "./login/login.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import Register from "./regiser/Register.jsx";
import Home from "./home/Home.jsx";
import { VerifyUser } from "./utils/VerifyUser.jsx";
import Profile from "./home/components/Profile.jsx";
import UserProfile from "./home/components/userProfile.jsx";

function App() {
  const [allUsersData, setAllUsersData] = useState([]);

  // ✅ Backend se users fetch karna
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user/all", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Failed to fetch users: ${res.status} ${errText}`);
        }

        const data = await res.json();
        setAllUsersData(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-2 w-screen h-screen flex items-center justify-center">
     <Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected Routes */}
  <Route element={<VerifyUser />}>
    <Route path="/" element={<Home users={allUsersData} />} />

    {/* 👤 Apna Profile */}
    <Route path="/profile" element={<Profile />} />
    <Route path="/profile/:id" element={<Profile />} />

    {/* 👤 Doosre User ka Profile */}
    <Route path="/user/:id" element={<UserProfile />} />
  </Route>
</Routes>


      <ToastContainer />
    </div>
  );
}

export default App;
