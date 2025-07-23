// UserList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from './../../api/contants';
import styles from './UserList.module.css';

export default function UserList() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_ENDPOINTS.USERS_ADMIN_LIST}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        throw new Error("인증 실패 또는 권한이 없습니다. 다시 로그인해주세요.");
                    }
                    const errorText = await res.text();
                    console.error("API 요청 실패 응답:", errorText);
                    throw new Error(`유저 목록을 불러오는데 실패했습니다. (상태: ${res.status})`);
                }

                const responseData = await res.json();
                setUsers(responseData.users);

            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (jwt) {
            fetchUsers();
        } else {
            setError("로그인이 필요합니다.");
            navigate('/');
        }
    }, [jwt, navigate]);

    const handleUserClick = (userHashId) => {
        navigate(`/admin/users/${userHashId}`);
    };

    if (loading) {
        return <div className={styles.container}><p>유저 목록 로딩 중...</p></div>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.error}>에러: {error}</p>
            </div>
        );
    }

    if (users.length === 0) {
        return <div className={styles.container}><p>등록된 유저가 없습니다.</p></div>;
    }

    return (
        <div className={styles.container}>
            <h2>유저 목록 / 관리</h2>
            <input type="text" placeholder="이름으로 검색" className={styles.searchInput} />
            <table className="table mt-3">
                <thead>
                <tr>
                    <th>이름</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>가입일</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr
                        key={user.hashId || user.id}
                        onClick={() => handleUserClick(user.userHashId)}
                        style={{ cursor: 'pointer' }}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.tel || "-"}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>{user.isSuspended ? "정지" : "활성"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}