import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

export default function ChangePassword() {

  const [oldPassword, setOld] = useState("");
  const [newPassword, setNew] = useState("");
  const navigate = useNavigate();

  const API = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.post(
      `${API}/change-password/`,
      {
        old_password: oldPassword,
        new_password: newPassword
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
    .then(() => {
      alert("Password changed ✅");
      localStorage.removeItem("authToken");
      navigate("/login");
    })
    .catch(err => {
      alert(err.response?.data?.error || "Something broke 💀");
    });
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form 
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Change Password 🔐
          </h2>

          <input
            type="password"
            placeholder="Old password"
            onChange={(e) => setOld(e.target.value)}
            className="border rounded p-2 w-full mb-3"
            required
          />

          <input
            type="password"
            placeholder="New password"
            onChange={(e) => setNew(e.target.value)}
            className="border rounded p-2 w-full mb-4"
            required
          />

          <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded w-full">
            Update Password
          </button>
        </form>
      </div>
    </>
  );
}
