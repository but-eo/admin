import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
        // JWT 토큰이 없으면 로그인 페이지로 리디렉션
        return <Navigate to="/" replace />;
    }
    // 토큰이 있으면 자식 컴포넌트(AdminPage)를 렌더링
    return children;
}