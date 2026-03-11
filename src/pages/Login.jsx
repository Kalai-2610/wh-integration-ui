import { useState } from "react";
import { useNavigate } from "react-router-dom";
import STRINGS from "../assets/strings";
import { loginUser } from "../service/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [theme, setTheme] = useState(currentTheme);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isAdmin = email === STRINGS.administrator;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmail(email.trim())
        let flag = true;
        if (!email.length) {
            setEmailError(STRINGS.email_required)
            flag = false
        } else if (!isAdmin && !emailRegex.test(email)) {
            setEmailError(STRINGS.invalid_email);
            flag = false
        } else {
            setEmail('')
        }
        if (!password.length) {
            flag = false
            setPasswordError(STRINGS.password_required)
        } else {
            setPassword('')
        }
        if (flag) {
            let response = await loginUser({ email, password })
            if (response?.error) {
                setPasswordError(response.error)
            } else {
                localStorage.setItem("token", response.access_token);
                localStorage.setItem("sessionId", response.sessionId);
                localStorage.setItem("isSystem", response.isSystem);
                localStorage.setItem("userId", response.userId);
                localStorage.setItem("username", response.user_name);
                setIsLoggedIn(true);
                navigate('/resource_management');
            }
        }
    };

    return (
        <div className="login-wrapper">

            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <div className="login-card">
                <h1 className="login-title">WH Integration</h1>
                <p className="login-subtitle">
                    Sign in to manage your endpoints
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <span className="input-error">{emailError}</span>}
                    </div>
                    <div className="login-field">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <span className="input-error">{passwordError}</span>}
                    </div>

                    <button type="submit" className="login-btn" onSubmit={handleSubmit}>
                        Sign In
                    </button>

                </form>

            </div>
        </div>
    );
}