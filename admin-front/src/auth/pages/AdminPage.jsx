import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../admin/components/Sidebar.jsx";

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("inquiry");

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/admin/users")) {
            setActiveTab("user");
        } else if (path.includes("/admin/stadium")) {
            setActiveTab("stadium");
        } else if (path.includes("/admin/inquiry")) {
            setActiveTab("inquiry");
        } else if (path.includes("/admin/chat")) {
            setActiveTab("chat");
        } else if (path.includes("/admin/board")) {
            setActiveTab("board");
        } else if (path === "/admin") {
            setActiveTab("inquiry");
        }
    }, [location.pathname]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        if (tabName === "inquiry") {
            navigate("/admin/inquiry");
        } else if (tabName === "stadium") {
            navigate("/admin/stadium");
        } else if (tabName === "user") {
            navigate("/admin/users");
        } else if (tabName === "chat") {
            navigate("/admin/chat");
        } else if (tabName === "board") {
            navigate("/admin/board");
        }

    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        window.location.href = "/";
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <Sidebar activeTab={activeTab} setActiveTab={handleTabClick} onLogout={handleLogout} />

            <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <Outlet />
            </main>
        </div>
    );
}