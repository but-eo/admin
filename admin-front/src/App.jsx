import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./auth/pages/LoginPage";
import AdminPage from "./auth/pages/AdminPage";
import AdminRoute from "./admin/components/AdminRoute";

import InquiryList from "./admin/components/InquiryList.jsx";
import StadiumList from "./admin/components/StadiumList.jsx";
import UserList from "./admin/components/UserList.jsx";
import UserDetail from "./admin/components/UserDetail.jsx";
import ChatRoomList from "./admin/components/ChatRoomList.jsx";
import BoardList from "./admin/components/BoardList.jsx";


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
                >
                    <Route index element={<InquiryList />} />
                    <Route path="inquiry" element={<InquiryList />} />
                    <Route path="stadium" element={<StadiumList />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/:userHashId" element={<UserDetail />} />
                    <Route path="chat" element={<ChatRoomList />} />
                    <Route path="board" element={<BoardList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}