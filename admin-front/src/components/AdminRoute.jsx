import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return <Navigate to="/login" replace />;
    // division도 같이 저장해놨다면 여기서도 체크 가능(추후 확장)
    return children;
}
