import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AdminRoute from "./components/AdminRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 기본 경로에서도 로그인 페이지 보여줌 */}
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminPage />
                        </AdminRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
