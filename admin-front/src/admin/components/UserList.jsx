import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from "./../../api/apiClient.js"; // apiClient 임포트 경로 확인
import styles from './UserList.module.css';

export default function UserList() {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // API로부터 전체 유저 목록을 가져오는 함수
    const fetchAllUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get("/users/admin/list");
            setAllUsers(res.data.users);
            setFilteredUsers(res.data.users);
        } catch (err) {
            console.error("유저 목록 불러오기 실패:", err);
            setError(err.response?.data?.error || err.message || "유저 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색 버튼 클릭 또는 Enter 키 입력 시 호출 (로컬에서 필터링)
    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(allUsers);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const results = allUsers.filter(user =>
                user.name.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredUsers(results);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 전화번호 형식 변환 함수 (01012345678 -> 010-1234-5678)
    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "-";
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        const matchSeoul = cleaned.match(/^(\d{2})(\d{3,4})(\d{4})$/);
        if (matchSeoul) {
            return `${matchSeoul[1]}-${matchSeoul[2]}-${matchSeoul[3]}`;
        }
        return phoneNumber;
    };


    const getUserStatusDisplayName = (state) => {
        switch (state) {
            case 'DELETED_WAIT':
                return '정지'; // 'DELETED_WAIT'는 '정지'로 표시
            default:
                return '활성'; // 그 외 모든 상태는 '활성'으로 표시
        }
    };

    const getStatusBadgeClass = (state) => {
        switch (state) {
            case 'ACTIVE':
                return styles.active;
            case 'DELETED_WAIT':
                return styles.suspended;
            default:
                return '';
        }
    };

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

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>유저 목록 / 관리</h2>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    placeholder="이름으로 검색"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button className={styles.searchButton} onClick={handleSearch}>검색</button>
            </div>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>번호</th> {/* ⭐ 번호 컬럼 추가 */}
                    <th>이름</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>가입일</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => ( // ⭐ index 추가
                        <tr
                            key={user.userHashId}
                            onClick={() => handleUserClick(user.userHashId)}
                        >
                            <td>{index + 1}</td> {/* ⭐ 번호 표시 */}
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{formatPhoneNumber(user.tel)}</td>
                            <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                            <td>
                                {/* ⭐ 상태 뱃지 적용 */}
                                <span className={`${styles.statusBadge} ${getStatusBadgeClass(user.state)}`}>
                                        {getUserStatusDisplayName(user.state)}
                                    </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className={styles.noDataRow}> {/* ⭐ colSpan 변경 */}
                            {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : '등록된 유저가 없습니다.'}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}