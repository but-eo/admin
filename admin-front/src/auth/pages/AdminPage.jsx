import React, { useState } from "react";
import Sidebar from "../../admin/components/Sidebar.jsx";
import InquiryList from "../../admin/components/InquiryList.jsx";
import StadiumList from "../../admin/components/StadiumList.jsx";
import UserList from "../../admin/components/UserList.jsx";
import ChatRoomList from "../../admin/components/ChatRoomList.jsx";
import BoardList from "../../admin/components/BoardList.jsx";

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