import React, { useState } from "react";
import InquiryList from "../components/InquiryList";
import StadiumForm from "../components/StadiumForm";
import StadiumList from "../components/StadiumList";
import UserList from "../components/UserList";
import ChatRoomList from "../components/ChatRoomList.jsx";
import BoardList from "../components/BoardList.jsx";

export default function AdminPage() {
    const [tab, setTab] = useState("inquiry");
    const [refresh, setRefresh] = useState(0); // 경기장 등록/삭제 시 목록 새로고침용
    const [showForm, setShowForm] = useState(false);

    // 로그아웃 버튼 핸들러
    const handleLogout = () => {
        localStorage.removeItem("jwt");
        window.location.href = "/login";
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">관리자 페이지</h1>
                <button className="btn btn-outline-dark" onClick={handleLogout}>로그아웃</button>
            </div>
            <div className="mb-3">
                <button onClick={() => setTab("inquiry")} className={`btn btn-outline-primary me-2 ${tab === "inquiry" ? "active" : ""}`}>문의관리</button>
                <button onClick={() => setTab("stadium")} className={`btn btn-outline-primary me-2 ${tab === "stadium" ? "active" : ""}`}>경기장등록</button>
                <button onClick={() => setTab("user")} className={`btn btn-outline-primary me-2 ${tab === "user" ? "active" : ""}`}>유저관리</button>
                <button onClick={() => setTab("chat")} className={`btn btn-outline-primary me-2 ${tab === "chat" ? "active" : ""}`}>채팅방관리</button>
                <button onClick={() => setTab("board")} className={`btn btn-outline-primary me-2 ${tab === "board" ? "active" : ""}`}>게시판관리</button>
            </div>
            <div>
                {tab === "inquiry" && <InquiryList />}
                {tab === "stadium" &&  <StadiumList key={refresh} /> }
                {tab === "user" && <UserList />}
                {tab === "chat" && <ChatRoomList />}
                {tab === "board" && <BoardList />}
            </div>
        </div>
    );
}
