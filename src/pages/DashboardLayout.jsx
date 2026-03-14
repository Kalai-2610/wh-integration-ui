import { NavLink } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ResourceManagement from "./ResourceManagement";
import "../styles/Dashboard.css";
import { useState } from "react";
import CredentialManagement from "./CredentialManagement";
import UserManagement from "./UserMangement";

export default function DashboardLayout({ onLogout, page }) {
    const [activePage, setActivePage] = useState(page);

    const renderPage = () => {
        switch (activePage) {
            case "resource_management":
                return <ResourceManagement />;
            case "credential_management":
                return <CredentialManagement />;
            case "user_management":
                return <UserManagement />;
            default:
                return <NavLink to='page_not_found' />;
        }
    };
    return (
        <div className="layout">
            <Sidebar setActivePage={setActivePage} onLogout={onLogout}/>
            <div className="main">
                <div className="content">
                    {renderPage()}
                </div>
            </div>
        </div>
    );
}