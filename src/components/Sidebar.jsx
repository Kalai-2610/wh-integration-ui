import { useState, useRef, useEffect } from "react";

export default function Sidebar({ setActivePage, onLogout }) {

    const profileRef = useRef(null);
    const [open, setOpen] = useState(false);
    const username = localStorage.getItem("username");
    const firstLetter = username.charAt(0).toUpperCase();
    const [theme, setTheme] = useState(
        document.documentElement.getAttribute("data-theme") || "dark"
    );
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <h2 className="sidebar-title">WH Integration</h2>
                <div className="sidebar-item" onClick={() => setActivePage("resource_management")} >
                    Resources
                </div>
                <div className="sidebar-item" onClick={() => setActivePage("credential_management")} >
                    Credentials
                </div>
                <div className="sidebar-item" onClick={() => setActivePage("user_management")} >
                    Users
                </div>
            </div>

            {/* Bottom Profile Section */}
            <div className="sidebar-bottom" ref={profileRef}>
                <div className="user-profile" onClick={() => setOpen(!open)} >
                    <div className="profile-avatar">
                        {firstLetter}
                    </div>
                    <span className="profile-name">
                        {username}
                    </span>
                </div>
                {open && (
                    <div className="profile-dropdown">
                        <div className="dropdown-item" onClick={toggleTheme} >
                            {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
                        </div>
                        <div className="dropdown-item logout" onClick={onLogout} >
                            Logout
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}