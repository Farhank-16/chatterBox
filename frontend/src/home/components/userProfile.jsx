import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="flex flex-col w-90 items-center gap-6 p-8 bg-gradient-to-br from-blue-100 to-sky-200 shadow-2xl rounded-2xl max-w-xl mx-auto mt-10 relative border border-sky-200">
          <button
            onClick={() => navigate("/")}
            className="absolute top-5 items-center gap-0.5 flex left-5 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-400 transition shadow"
          >
           <BiArrowBack size={20} /><p className="font-semibold">Back</p>
          </button>

      <img
        src={user.profilepic || "/default-avatar.png"}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-md"
      />

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">@{user.username}</h2>
        <p className="text-lg text-gray-700">{user.fullName}</p>
      </div>

      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
        <p className="text-gray-600">{user.bio || "No bio available."}</p>
      </div>
      <p className="text-rose-500">An awesome site is in progress.</p>

    </div>
  );
};

export default UserProfile;
