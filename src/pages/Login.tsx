import { useState } from "react";
import { getuser, loginUser } from "../api/authApi";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const navigation = useNavigate();


 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // 1. Login request
    await loginUser({ Email: email, Password: password, RememberMe: rememberMe });

    // 2. Get current user
    const res = await getuser();

    setUser(res.data); 
    navigation("/dashboard"); // redirect to dashboard after login
    // store user in context or state
    toast.success("Login successful!"); // optional notification
  } catch (err: any) {
    console.error(err);

    // Use backend message if available
    const message = err.response?.data?.message || "Login failed";
    toast.error(message); // optional: show error in UI
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-page">
      {/* Dynamic Background Glows */}
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <ShieldCheck size={24} color="white" />
          </div>
          <h1>Welcome back</h1>
          <p>Enter your credentials to access your vault.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
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

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <button type="button" className="forgot-btn">Forgot password?</button>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="loader-flex">
                <Loader2 className="spinner" size={20} /> Authenticating...
              </span>
            ) : (
              <span className="loader-flex">
                Sign In <ArrowRight size={20} />
              </span>
            )}
          </button>
        </form>

        <a href="/register" className="login-link">
          Don't have an account? Sign up
        </a>
      </div>
    </div>
  );
};

export default Login;