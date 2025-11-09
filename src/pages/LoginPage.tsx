import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Replace with your actual API call
const loginUser = async (email: string, password: string) => {
  const res = await fetch("https://todo-api-mlwe2d57yhf942m9j8jqj8e8-3000.thekalkicinematicuniverse.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      toast.success("Logged in successfully!");
      localStorage.setItem("token", data.token); // store token
      navigate("/todos");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl mb-4">Login</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2 rounded w-full max-w-sm" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 rounded w-full max-w-sm" />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full max-w-sm mb-2">Login</button>
      <p>
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
