import React, { useState } from "react";
import InquiryList from "../components/InquiryList";
import StadiumForm from "../components/StadiumForm";
import StadiumList from "../components/StadiumList";
import UserList from "../components/UserList";

export default function AdminPage() {
    const [tab, setTab] = useState("inquiry");
    const [refresh, setRefresh] = useState(0); // 경기장 등록/삭제 시 목록 새로고침용

    return (
        <div className="container mt-5">
            <h1 className="mb-4">관리자 페이지</h1>
            <div className="mb-3">
                <button onClick={() => setTab("inquiry")} className={`btn btn-outline-primary me-2 ${tab === "inquiry" ? "active" : ""}`}>문의관리</button>
                <button onClick={() => setTab("stadium")} className={`btn btn-outline-primary me-2 ${tab === "stadium" ? "active" : ""}`}>경기장등록</button>
                <button onClick={() => setTab("user")} className={`btn btn-outline-primary ${tab === "user" ? "active" : ""}`}>유저관리</button>
            </div>
            <div>
                {tab === "inquiry" && <InquiryList />}
                {tab === "stadium" &&
                    <div>
                        <StadiumForm onComplete={() => setRefresh(r => r + 1)} />
                        <StadiumList key={refresh} />
                    </div>
                }
                {tab === "user" && <UserList />}
            </div>
        </div>
    );
}
