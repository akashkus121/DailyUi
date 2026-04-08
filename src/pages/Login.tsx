import { useState } from "react";
import { getuser, loginUser, sendOtp, resetPassword } from "../api/authApi";
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, KeyRound, ChevronLeft } from "lucide-react";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigation = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser({ Email: email, Password: password, RememberMe: rememberMe });
      const res = await getuser();
      setUser(res.data);
      navigation("/dashboard");
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) return toast.error("Please enter your email");
    setIsSendingOtp(true);
    try {
      const res = await sendOtp({ email: forgotEmail });
      const data = res.data || res;
      if (data.success) {
        toast.success("OTP sent to your email");
        setIsOtpSent(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return toast.error("Please enter OTP and new password");
    setIsResetting(true);
    try {
      const res = await resetPassword({ email: forgotEmail, otp, newPassword });
      const data = res.data || res;
      if (data.success) {
        toast.success(data.message || "Password reset successful!");
        setShowOtpForm(false);
        setIsOtpSent(false);
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">
            <ShieldCheck size={24} color="white" />
          </div>
          <h1>{showOtpForm ? (isOtpSent ? "Reset Password" : "Recover Vault") : "Welcome back"}</h1>
          <p>
            {showOtpForm 
              ? (isOtpSent ? "Enter the code and your new secret." : "We'll send a secure code to your email.") 
              : "Enter your credentials to access your vault."}
          </p>
        </div>

        {!showOtpForm ? (
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
              <button type="button" className="forgot-btn" onClick={() => setShowOtpForm(true)}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="loader-flex"><Loader2 className="spinner" size={20} /> Authenticating...</span>
              ) : (
                <span className="loader-flex">Sign In <ArrowRight size={20} /></span>
              )}
            </button>
          </form>
        ) : (
          <div className="login-form">
  {!isOtpSent ? (
    <div className="input-group centered-group">
      <label>Recovery Email</label>
      <div className="input-wrapper">
        <Mail className="field-icon" size={20} />
        <input
          type="email"
          placeholder="Enter recovery email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
      </div>
      {/* Centered Button */}
      <button className="submit-btn center-btn" onClick={handleSendOtp} disabled={isSendingOtp}>
        {isSendingOtp ? "Requesting..." : "Send Secure Code"}
      </button>
    </div>
  ) : (
    <div className="centered-group">
      <div className="input-group">
        <label>Verification Code</label>
        <div className="input-wrapper">
          <KeyRound className="field-icon" size={20} />
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      </div>
      <div className="input-group" style={{ marginTop: '15px' }}>
        <label>New Secret Password</label>
        <div className="input-wrapper">
          <Lock className="field-icon" size={20} />
          <input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
      </div>
      {/* Centered Button */}
      <button className="submit-btn center-btn" onClick={handleResetPassword} disabled={isResetting}>
        {isResetting ? "Updating..." : "Confirm New Password"}
      </button>
    </div>
  )}
  
  <button
    className="back-to-login"
    onClick={() => {
      setShowOtpForm(false);
      setIsOtpSent(false);
    }}
  >
    <ChevronLeft size={16} /> Back to login
  </button>
</div>
        )}

        {!showOtpForm && (
          <div className="footer-text">
            Don't have an account? <a href="/register" className="login-link">Sign up</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;