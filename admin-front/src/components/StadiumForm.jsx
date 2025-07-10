import React, { useState } from "react";

export default function StadiumForm({ onComplete }) {
    const [form, setForm] = useState({
        stadiumName: "",
        stadiumRegion: "",
        stadiumMany: "",
        availableDays: "",
        availableHours: "",
        stadiumTel: "",
        stadiumCost: "",
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const jwt = localStorage.getItem("jwt");

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleFiles = e => setFiles([...e.target.files]);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        files.forEach(f => fd.append("images", f));
        const res = await fetch("/api/stadiums/create", {
            method: "POST",
            headers: { Authorization: `Bearer ${jwt}` },
            body: fd,
        });
        setLoading(false);
        if (res.ok) {
            alert("경기장 등록 완료!");
            setForm({
                stadiumName: "", stadiumRegion: "", stadiumMany: "",
                availableDays: "", availableHours: "", stadiumTel: "", stadiumCost: "",
            });
            setFiles([]);
            if (onComplete) onComplete();
        } else {
            alert("등록 실패 (권한/입력/서버오류)");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 border rounded p-4 bg-white">
            <h3 className="mb-3">경기장 등록</h3>
            <input name="stadiumName" value={form.stadiumName} onChange={handleChange} placeholder="이름" className="form-control mb-2" required />
            <input name="stadiumRegion" value={form.stadiumRegion} onChange={handleChange} placeholder="지역" className="form-control mb-2" required />
            <input name="stadiumMany" value={form.stadiumMany} onChange={handleChange} placeholder="최대 인원" type="number" className="form-control mb-2" required />
            <input name="availableDays" value={form.availableDays} onChange={handleChange} placeholder="가능 요일 (ex: 월~일)" className="form-control mb-2" />
            <input name="availableHours" value={form.availableHours} onChange={handleChange} placeholder="가능 시간 (ex: 09:00~22:00)" className="form-control mb-2" />
            <input name="stadiumTel" value={form.stadiumTel} onChange={handleChange} placeholder="연락처" className="form-control mb-2" />
            <input name="stadiumCost" value={form.stadiumCost} onChange={handleChange} placeholder="대여비용" type="number" className="form-control mb-2" />
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="form-control mb-3" />
            <button className="btn btn-primary w-100" disabled={loading}>{loading ? "등록중..." : "등록"}</button>
        </form>
    );
}
