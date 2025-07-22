// components/Auth/SignupModal.jsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignupModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    bio: "I’m a passionate user of Shipissh 🚚",
  });

  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const storage = getStorage();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = result.user;
      let photoURL = "";

      if (photo) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      } else {
        photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.displayName
        )}&background=0D8ABC&color=fff`;
      }

      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: formData.displayName,
        phone: formData.phone,
        bio: formData.bio,
        photoURL,
        createdAt: Timestamp.now(),
      });

      await sendEmailVerification(user);
      alert(
        "Signup successful! A verification email has been sent. Please verify before logging in."
      );

      await signOut(auth);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Create a Shipissh Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 text-sm rounded text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="displayName"
            placeholder="Full Name"
            value={formData.displayName}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            name="bio"
            placeholder="Short Bio"
            rows={2}
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-3 text-gray-600"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
