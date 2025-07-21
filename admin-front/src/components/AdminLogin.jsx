import React, { useState } from "react";
import apiClient from "../api"; // API 클라이언트 사용
import styles from './AdminLogin.module.css'; // CSS 모듈

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await apiClient.post("/users/login", credentials);
            const data = res.data;

            if (data.division !== "ADMIN") {
                setError("관리자 계정만 접근 가능합니다.");
                return;
            }

            localStorage.setItem("jwt", data.accessToken);
            window.location.href = "/admin";

        } catch (err) {
            setError("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.backgroundImage}></div>
            <form className={styles.loginForm} onSubmit={handleLogin}>
                <h2 className={styles.title}>SPORTS MATCHING</h2>
                <p className={styles.subtitle}>관리자 로그인</p>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <button type="submit" className={styles.loginButton} disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                </button>

                <div className={styles.options}>
                    <a href="#">비밀번호 찾기</a>
                </div>
            </form>
        </div>
    );
}