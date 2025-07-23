
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "./../../api/contants";
import styles from "./UserDetail.module.css";

export default function UserDetail() {
    const { userHashId } = useParams();
    const navigate = useNavigate();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {

        if (!userHashId) {
            setError("유저 ID를 찾을 수 없습니다.");
            setLoading(false);a
            return;
        }

        const fetchUserDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_ENDPOINTS.USERS_DETAIL(userHashId)}`, {
                    headers: { Authorization: `Bearer ${jwt}` }
                });
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("유저를 찾을 수 없습니다.");
                    }
                    throw new Error("유저 상세 정보를 불러오는데 실패했습니다.");
                }
                const data = await res.json();
                setUserDetail(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetail();
    }, [userHashId, jwt]);

    if (loading) {
        return <div className={styles.container}><p>로딩 중...</p></div>;
    }

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.error}>에러: {error}</p>
                <button onClick={() => navigate('/admin/users')} className={styles.backButton}>&lt; 목록으로</button>
            </div>
        );
    }

    if (!userDetail) {
        return (
            <div className={styles.container}>
                <p>유저 정보를 찾을 수 없습니다.</p>
                <button onClick={() => navigate('/admin/users')} className={styles.backButton}>&lt; 목록으로</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <button onClick={() => navigate('/admin/users')} className={styles.backButton}>&lt; 목록으로</button>
            <h2 className={styles.title}>유저 상세 정보</h2>
            <div className={styles.detailItem}>
                <strong>이름:</strong> {userDetail.name}
            </div>
            <div className={styles.detailItem}>
                <strong>이메일:</strong> {userDetail.email}
            </div>
            <div className={styles.detailItem}>
                <strong>전화번호:</strong> {userDetail.tel || "-"}
            </div>
            <div className={styles.detailItem}>
                <strong>가입일:</strong> {new Date(userDetail.createdAt).toLocaleDateString()}
            </div>
            <div className={styles.detailItem}>
                <strong>상태:</strong>{" "}
                {userDetail.isSuspended ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>정지됨</span>
                ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>활성</span>
                )}
            </div>

            <div className={styles.actionButtons}>
                {userDetail.isSuspended ? (
                    <button className={styles.activateButton}>유저 활성화</button>
                ) : (
                    <button className={styles.suspendButton}>유저 정지</button>
                )}
            </div>
        </div>
    );
}