import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FiEdit2, FiCamera, FiCheck, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";
import { toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();
  const { authUser, setAuthUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAvatarURL = (path) => {
  if (!path) return "/default-avatar.png";
  if (path.startsWith("http") || path.startsWith("blob")) return path;
  return `http://localhost:3000${path}`;
};

  const isMyProfile = !id || id === authUser?._id;

  


  const [formData, setFormData] = useState({
  fullname: authUser?.fullname || "",
  bio: authUser?.bio || "",
  profilepic: getAvatarURL(authUser?.profilepic),
  file: null,
});


  useEffect(() => {
    if (!isMyProfile && id) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/user/${id}`);
          setUserData(res.data);
        } catch (err) {
          toast.error("User not found");
          navigate("/");
        }
      };
      fetchUser();
    }
  }, [id, isMyProfile, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        profilepic: URL.createObjectURL(file), // Creates temporary blob URL for preview
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("bio", formData.bio);
      if (formData.file) data.append("profilepic", formData.file);

      const res = await axios.put("/api/user/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAuthUser(res.data);
      // Update local state with the newly returned path from server
      setFormData((prev) => ({
        ...prev,
        profilepic: getAvatarURL(res.data.profilepic),
        file: null,
      }));
      setEditing(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const displayUser = isMyProfile ? authUser : userData;

  if (!displayUser) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-rose-400 to-orange-400 relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all font-bold text-sm"
          >
            <BiArrowBack size={20} /> Back
          </button>
        </div>

        <div className="px-8 pb-10">
          {/* Profile Image Section */}
          <div className="relative -mt-16 mb-6 flex justify-center">
            <div className="relative group">
             <img
  src={isMyProfile ? formData.profilepic : getAvatarURL(displayUser.profilepic)}
  alt="Profile"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/default-avatar.png";
  }}
  className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl"
/>

              {isMyProfile && editing && (
                <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-2.5 rounded-xl cursor-pointer hover:bg-rose-500 transition-colors shadow-lg border-2 border-white">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <FiCamera size={18} />
                </label>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">@{displayUser.username}</h2>
            {isMyProfile && editing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="text-center w-full max-w-sm px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                placeholder="Your full name"
              />
            ) : (
              <p className="text-gray-500 font-medium text-lg italic">
                {isMyProfile ? formData.fullname : (displayUser.fullname || "Full Name not set")}
              </p>
            )}
          </div>

          {/* Bio Section */}
          <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Bio</h3>
            {isMyProfile && editing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed font-medium">
                {(isMyProfile ? formData.bio : displayUser.bio) || "This user prefers to keep their bio a mystery."}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {isMyProfile && (
            <div className="flex justify-center gap-4">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <FiCheck /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { 
                      setEditing(false); 
                      setFormData({ ...formData, profilepic: getAvatarURL(authUser.profilepic) }); 
                    }}
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    <FiX /> Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-10 py-3 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      {showImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={() => setShowImage(false)}>
          <img
            src={isMyProfile ? formData.profilepic : getAvatarURL(displayUser.profilepic)}
            alt="Full View"
            className="max-w-full max-h-[80vh] rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default Profile;