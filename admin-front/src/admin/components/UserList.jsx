import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "./../../api/contants";
import styles from "./UserList.module.css"; // 스타일 추가

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = () => {
        setLoading(true);
        setError(null);
        const url = new URL(`${API_ENDPOINTS.USERS}/admin/list`);
        url.searchParams.append("keyword", keyword);
        url.searchParams.append("page", page);
        url.searchParams.append("size", size);

        fetch(url.toString(), { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("유저 목록 불러오기 실패");
                return res.json();
            })
            .then((data) => {
                setUsers(data.users);
                setTotalPages(data.totalPages);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, [keyword, page]);

    const pageButtons = [];
    for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
            <button
                key={i}
                onClick={() => setPage(i)}
                disabled={i === page}
                className={styles.pageButton}
            >
                {i + 1}
            </button>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>유저 목록 / 관리</h1>

            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="이름으로 검색"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setPage(0);
                    }}
                    className={styles.searchInput}
                />
            </div>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: "red" }}>에러: {error}</p>}

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>가입일</th>
                </tr>
                </thead>
                <tbody>
                {!users || users.length === 0 ? (
                    <tr>
                        <td colSpan="4" style={{textAlign: "center"}}>
                            유저가 없습니다.
                        </td>
                    </tr>
                ) : (
                    users.map((user) => (
                        <tr key={user.userHashId}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.tel || "-"}</td>
                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))
                )}
                </tbody>

            </table>

            <div className={styles.pagination}>{pageButtons}</div>
        </div>
    );
}
