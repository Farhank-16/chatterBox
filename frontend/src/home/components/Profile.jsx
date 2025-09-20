import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";

const Profile = () => {
  const { id } = useParams();
  const { authUser, setAuthUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const isMyProfile = !id || id === authUser?._id;

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilepic: authUser?.profilepic || "/default-avatar.png",
    file: null,
  });

  // ✅ Dusre user ka profile fetch
  useEffect(() => {
    if (!isMyProfile && id) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/user/${id}`, {
            withCredentials: true,
          });
          setUserData(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }
  }, [id, isMyProfile]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        profilepic: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("bio", formData.bio);
      if (formData.file) data.append("profilepic", formData.file);

      const res = await axios.put("http://localhost:3000/api/user/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setAuthUser(res.data);
      setFormData({
        ...formData,
        profilepic: res.data.profilepic,
        file: null,
      });
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Profile update failed!");
    }
  };

  // ✅ Dusre user ka profile view
  if (!isMyProfile && userData) {
    return (
      <div className="flex flex-col items-center gap-6 p-8 bg-white shadow-2xl rounded-2xl max-w-xl mx-auto mt-10 relative border border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition shadow"
        >
          ⬅ Back
        </button>

        <img
          src={
            userData.profilepic
              ? `http://localhost:3000${userData.profilepic}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover border-4 border-sky-500 shadow-md"
        />

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            @{userData.username}
          </h2>
          <p className="text-lg text-gray-700">
            {userData.fullName || "Full Name not set"}
          </p>
        </div>

        <div className="w-full text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
          <p className="text-gray-600">
            {userData.bio || "No bio added yet."}
          </p>
        </div>
      </div>
    );
  }

  // ✅ Apna profile (editable)
  return (
    <div className="flex flex-col w-90 items-center gap-6 p-8 bg-gradient-to-br from-blue-100 to-sky-200 shadow-2xl rounded-2xl max-w-xl mx-auto mt-10 relative border border-sky-200">
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 items-center gap-0.5 flex left-5 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 transition shadow"
      >
       <BiArrowBack size={20} /><p className="font-semibold">Back</p>
      </button>

      {/* Profile Picture */}
      <div className="relative">
        <img
          src={formData.profilepic}
          alt="Profile"
          onClick={() => setShowImage(true)}
          className="w-36 h-36 rounded-full object-cover border-4 border-sky-500 shadow-lg cursor-pointer hover:scale-105 transition"
        />
        {editing && (
          <label className="absolute bottom-2 right-2 bg-sky-600 p-2 rounded-full cursor-pointer hover:bg-sky-700 transition shadow">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <FiEdit2 className="text-white" />
          </label>
        )}
      </div>

      {/* Full Image Modal */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowImage(false)}
        >
          <img
            src={formData.profilepic}
            alt="Full"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Username + Full Name */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          @{authUser?.username}
        </h2>
        {editing ? (
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="border px-4 py-2 rounded-lg w-72 mt-2 text-center shadow-sm"
            placeholder="Enter full name"
          />
        ) : (
          <p className="text-lg text-gray-700">
            {formData.fullName || "Full Name not set"}
          </p>
        )}
      </div>

      {/* Bio Section */}
      <div className="w-full px-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
        {editing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-lg shadow-sm"
            placeholder="Write something about yourself..."
            rows="4"
          />
        ) : (
          <p className="text-gray-600">
            {formData.bio || "No bio added yet."}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-5">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition shadow"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition shadow"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition shadow"
          >
            Edit Profile
          </button>
          
        )}
        
      </div>
      <p className="text-rose-500">An awesome site is in progress.</p>
    </div>
  );
};

export default Profile;
