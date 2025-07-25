import React, { useEffect, useState } from "react";
import InquiryDetail from "./InquiryDetail.jsx";

export default function InquiryList() {
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        if (!jwt) {
            setList([]); // jwt 없으면 빈 배열
            return;
        }
        fetch("/api/inquiries/accessible", {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) setList(data);
                else setList([]);
            })
            .catch(() => setList([])); // 401 등 에러 시 빈 배열
    }, [jwt]);

    if (selected) {
        return <InquiryDetail inquiryId={selected} onBack={() => setSelected(null)} />;
    }

    return (
        <div>
            <h2>문의 목록</h2>
            {list.length === 0 ? (
                <div>표시할 문의가 없습니다.</div>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>등록일</th>
                        <th>상태</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map(i => (
                        <tr key={i.inquiryId}>
                            <td>{i.title}</td>
                            <td>{i.writerName}</td>
                            <td>{i.createdAt?.slice(0, 10)}</td>
                            <td>{i.answerContent && i.answerContent.trim() !== "" ? "답변완료" : "대기"}</td>
                            <td>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(i.inquiryId)}>
                                    상세
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
