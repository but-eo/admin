import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/pages/LoginPage";
import AdminPage from "./auth/pages/AdminPage";
import AdminRoute from "./admin/components/AdminRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
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
