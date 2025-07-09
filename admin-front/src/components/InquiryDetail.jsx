import React, { useEffect, useState } from "react";

export default function InquiryDetail({ inquiryId, onBack }) {
    const [data, setData] = useState(null);
    const [answer, setAnswer] = useState("");
    const [refresh, setRefresh] = useState(0);

    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        fetch(`/api/inquiries/${inquiryId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(res => res.json())
            .then(d => {
                setData(d);
                setAnswer(d.answer?.content || "");
            })
            .catch(console.error);
    }, [inquiryId, refresh]);

    const handleAnswer = async () => {
        if (!answer.trim()) return alert("답변 내용을 입력하세요.");
        const res = await fetch(`/api/inquiries/${inquiryId}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ content: answer })
        });
        if (res.ok) {
            alert("답변 등록 완료!");
            setRefresh(x => x + 1); // 새로고침
        } else {
            alert("등록 실패");
        }
    };

    if (!data) return <div>로딩중...</div>;

    return (
        <div>
            <button className="btn btn-link mb-2" onClick={onBack}>&lt; 목록</button>
            <h3>{data.title}</h3>
            <div className="mb-2">작성자: {data.writerName}</div>
            <div className="mb-2">작성일: {data.createdAt?.slice(0, 10)}</div>
            <div className="mb-3">{data.content}</div>

            <hr />
            <h5>답변</h5>
            <textarea
                className="form-control mb-2"
                value={answer}
                rows={5}
                onChange={e => setAnswer(e.target.value)}
                placeholder="답변을 입력하세요"
            />
            <button className="btn btn-success" onClick={handleAnswer}>
                {data.answer ? "답변 수정" : "답변 등록"}
            </button>
        </div>
    );
}
