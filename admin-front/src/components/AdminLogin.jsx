import React, { useState } from "react";

export default function AdminLogin() {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: id, password: pw }),
        });
        setLoading(false);
        if (res.ok) {
            const data = await res.json();
            if (data.division !== "ADMIN") {
                alert("관리자만 접근 가능합니다");
                return;
            }
            localStorage.setItem("jwt", data.accessToken);
            window.location.href = "/admin";
        } else {
            alert("로그인 실패");
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-4 border rounded shadow bg-white">
            <h2 className="mb-3">관리자 로그인</h2>
            <input className="form-control mb-2" value={id} onChange={e => setId(e.target.value)} placeholder="아이디" required />
            <input className="form-control mb-2" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호" required />
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
            </button>
        </form>
    );
}
