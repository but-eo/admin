import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import InquiryList from "../components/InquiryList";
import StadiumList from "../components/StadiumList";
import UserList from "../components/UserList";
import ChatRoomList from "../components/ChatRoomList";
import BoardList from "../components/BoardList";

// 각 탭에 해당하는 컴포넌트를 매핑
const components = {
    inquiry: <InquiryList />,
    stadium: <StadiumList />,
    user: <UserList />,
    chat: <ChatRoomList />,
    board: <BoardList />,
};

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("inquiry");

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        window.location.href = "/login";
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* 사이드바 컴포넌트 */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

            {/* 메인 컨텐츠 영역 */}
            <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                {/* 현재 활성화된 탭에 맞는 컴포넌트를 렌더링 */}
                {components[activeTab]}
            </main>
        </div>
    );
}