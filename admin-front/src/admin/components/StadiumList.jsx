import React, { useEffect, useState } from "react";
import StadiumForm from "./StadiumForm.jsx";

const API_HOST = "http://localhost:714";

export default function StadiumList() {
    const [list, setList] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [selected, setSelected] = useState(null); // stadiumId
    const [editMode, setEditMode] = useState(false);
    const [detail, setDetail] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const jwt = localStorage.getItem("jwt");

    // 목록 새로고침
    useEffect(() => {
        fetch("/api/stadiums", { headers: { Authorization: `Bearer ${jwt}` } })
            .then(res => res.json())
            .then(data => setList(data));
    }, [refresh, jwt]);

    // 상세정보 받아오기 (수정 진입시)
    useEffect(() => {
        if (selected && editMode) {
            fetch(`/api/stadiums/${selected}`, { headers: { Authorization: `Bearer ${jwt}` } })
                .then(res => res.json())
                .then(data => setDetail(data));
        }
    }, [selected, editMode, jwt]);

    const handleDelete = async id => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const res = await fetch(`/api/stadiums/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${jwt}` }
        });
        if (res.ok) {
            alert("삭제 완료");
            setSelected(null);
            setEditMode(false);
            setRefresh(r => r + 1);
        } else {
            alert("삭제 실패 (권한/서버오류)");
        }
    };

    // 등록 폼
    if (showForm) {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="mb-0">경기장 등록</h3>
                    <button className="btn btn-link" onClick={() => setShowForm(false)}>닫기</button>
                </div>
                <StadiumForm onComplete={() => {
                    setShowForm(false);
                    setRefresh(r => r + 1);
                }} />
            </div>
        );
    }

    // 상세/수정 보기
    if (selected) {
        if (editMode && detail) {
            // 수정 폼 모드
            return (
                <div className="border rounded p-4 mb-4">
                    <button className="btn btn-link mb-2" onClick={() => { setEditMode(false); setSelected(null); }}>&lt; 목록</button>
                    <StadiumForm
                        edit
                        stadiumId={selected}
                        initial={detail}
                        onComplete={() => {
                            setEditMode(false);
                            setSelected(null);
                            setRefresh(r => r + 1);
                        }}
                    />
                </div>
            );
        }
        // 상세보기 모드
        const s = list.find(x => x.stadiumId === selected);
        if (!s) return null;
        return (
            <div className="border rounded p-4 mb-4">
                <button className="btn btn-link mb-2" onClick={() => setSelected(null)}>&lt; 목록</button>
                <h4>{s.stadiumName}</h4>
                <div>지역: {s.stadiumRegion}</div>
                <div>최대 인원: {s.stadiumMany}</div>
                <div>가능 요일: {s.availableDays}</div>
                <div>가능 시간: {s.availableHours}</div>
                <div>연락처: {s.stadiumTel}</div>
                <div>비용: {s.stadiumCost}</div>
                <div>관리자: {s.ownerNickname}</div>
                <div className="mt-3">
                    {s.imageUrls && s.imageUrls.length > 0
                        ? s.imageUrls.map((url, i) =>
                            <img
                                key={url + i}
                                src={API_HOST + url}
                                alt="stadium"
                                style={{ width: 120, margin: 5, borderRadius: 8, objectFit: "cover" }}
                            />
                        )
                        : <span className="text-muted">등록된 이미지 없음</span>}
                </div>
                <div className="mt-4 d-flex gap-2">
                    <button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>수정</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(s.stadiumId)}>삭제</button>
                </div>
            </div>
        );
    }

    // 기본 목록
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="mb-0">경기장 목록</h3>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + 경기장 등록
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>이름</th>
                    <th>지역</th>
                    <th>최대인원</th>
                    <th>관리자</th>
                    <th>상세</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {list.map(stadium => (
                    <tr key={stadium.stadiumId}>
                        <td>{stadium.stadiumName}</td>
                        <td>{stadium.stadiumRegion}</td>
                        <td>{stadium.stadiumMany}</td>
                        <td>{stadium.ownerNickname}</td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary"
                                    onClick={() => { setSelected(stadium.stadiumId); setEditMode(false); }}>상세</button>
                        </td>
                        <td>
                            <button className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(stadium.stadiumId)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
