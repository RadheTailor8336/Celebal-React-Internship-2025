// components/Auth/LoginModal.jsx
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resendVisible, setResendVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResendVisible(false);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!result.user.emailVerified) {
        await sendEmailVerification(result.user);
        setError("Email not verified. Verification email resent.");
        setResendVisible(true);
        await signOut(auth);
        return;
      }

      if (result.user.email === "radhetailor923@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

      onClose();
    } catch (err) {
      console.error("Login error:", err.message);

      switch (err.code) {
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>

          {resendVisible && (
            <div className="text-center mt-4 text-sm text-blue-600">
              A new verification email has been sent. Please check your inbox or spam.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
