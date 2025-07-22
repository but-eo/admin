import React from "react";
import AdminLogin from "../AdminLogin.jsx";

export default function LoginPage() {
    return (
        // 로그인 페이지 배경 스타일
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#1a1a1a' }}>
            <AdminLogin />
        </div>
    );
}