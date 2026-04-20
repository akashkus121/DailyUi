import { useState } from "react";
import { registerUser } from "../api/authApi";
import { Mail, Lock, User, Camera, Loader2, ArrowRight } from "lucide-react";
import { data, useNavigate } from "react-router-dom";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const naviagete=useNavigate();

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const avatarFile = (document.getElementById("avatar-input") as HTMLInputElement)?.files?.[0];

 try {
  const res = await registerUser(
    { Name: name, Email: email, Password: password   },
    avatarFile
  );

  const data = res.data || res;

  if (data.success) {
    alert(data.message || "Registration successful!");
    naviagete("/"); // Redirect to login page after successful registration
    
  }

} catch (err: any) {
  const errorMessage =
    err?.response?.data?.message ||
    err?.response?.data?.StatusCode ||
    err.message ||
    "Something went wrong";

  alert("Registration failed: " + errorMessage);

} finally {
  setIsLoading(false);
}
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <div className="login-page">
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="login-card">
        <div className="login-header">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p>Join the next generation of security.</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          {/* Avatar Upload Section */}
          <div className="avatar-upload-container">
            <div className="avatar-preview-wrapper">
              <img
                src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="avatar"
                className="avatar-preview"
              />
              <label htmlFor="avatar-input" className="avatar-edit-badge">
                <Camera size={16} />
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className="field-icon" size={20} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className="field-icon" size={20} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className="field-icon" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="loader-flex">
                <Loader2 className="spinner" size={20} /> Creating Account...
              </span>
            ) : (
              <span className="loader-flex">
                Register <ArrowRight size={20} />
              </span>
            )}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <a href="/" className="login-link">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;