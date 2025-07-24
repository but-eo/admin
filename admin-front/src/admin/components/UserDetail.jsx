import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "./../../api/apiClient.js";
import styles from "./UserDetail.module.css";

export default function UserDetail() {
    const { userHashId } = useParams();
    const navigate = useNavigate();
    const [userDetail, setUserDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        region: '',
        preferSports: '',
        tel: '',
        gender: '',
        password: '',
    });
    // 프로필 이미지 관련 상태
    const [currentProfileUrl, setCurrentProfileUrl] = useState('');
    const [newProfileFile, setNewProfileFile] = useState(null);

    // 사용자 상세 정보를 불러오는 함수
    const fetchUserDetail = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/users/${userHashId}`);
            const userData = res.data;
            setUserDetail(userData); // 상세 정보 표시용

            setFormData({
                name: userData.name || '',
                region: userData.region || '',
                preferSports: userData.preferSports || '',
                tel: userData.tel || '',
                gender: userData.gender || '',
                password: '', // 비밀번호는 불러올 때 비워둠
            });
            setCurrentProfileUrl(userData.profile || ''); // 기존 프로필 URL 저장

        } catch (err) {
            console.error("Failed to fetch user detail:", err);
            setError(err.response?.data?.detail || err.response?.data?.error || err.message || "유저 상세 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [userHashId]);

    useEffect(() => {
        const jwtFromStorage = localStorage.getItem("jwt");
        if (!jwtFromStorage) {
            setError("로그인이 필요합니다.");
            navigate('/');
            setLoading(false);
            return;
        }

        if (!userHashId) {
            setError("유저 ID를 찾을 수 없습니다.");
            setLoading(false);
            return;
        }

        fetchUserDetail(); // 컴포넌트 로드 시 사용자 정보 불러오기
    }, [userHashId, navigate, fetchUserDetail]);

    // 수정 모드 진입 핸들러
    const handleEditMode = () => {
        setIsEditMode(true);
    };

    // 입력 필드 값 변경 핸들러 (수정 폼용)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 파일 입력 필드 변경 핸들러
    const handleFileChange = (e) => {
        setNewProfileFile(e.target.files[0]);
    };

    // 폼 제출 핸들러 (사용자 정보 업데이트 API 호출)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const dataToSend = new FormData();

            // 텍스트 필드 추가
            for (const key in formData) {
                if (key === 'password' && formData[key].trim() === '') {
                    continue;
                }
                dataToSend.append(key, formData[key]);
            }

            // 새 프로필 파일이 있으면 추가
            if (newProfileFile) {
                dataToSend.append('profile', newProfileFile);
            }

            const res = await apiClient.patch(`/users/admin/update/${userHashId}`, dataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(res.data || '사용자 정보가 성공적으로 수정되었습니다.');
            setIsEditMode(false);
            fetchUserDetail();

        } catch (err) {
            console.error('사용자 정보 수정 실패:', err);
            setError(err.response?.data?.error || err.message || '사용자 정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 수정 취소 핸들러
    const handleCancelEdit = () => {
        setIsEditMode(false);
        fetchUserDetail();
    };

    // '유저 정지' (논리적 삭제) 핸들러
    const handleSuspendUser = async () => {
        if (window.confirm("정말로 이 유저를 정지(탈퇴 대기)시키겠습니까?")) {
            try {
                // 백엔드의 deleteUserByAdmin (논리적 삭제) 엔드포인트 호출
                const res = await apiClient.delete(`/users/admin/delete/${userHashId}`);
                alert(res.data || "유저가 성공적으로 정지(탈퇴 대기)되었습니다.");
                fetchUserDetail(); // 상태 변경을 반영하기 위해 상세 정보를 다시 불러옴
            } catch (err) {
                console.error("유저 정지(탈퇴 대기) 중 오류 발생:", err);
                setError(`유저 정지(탈퇴 대기) 실패: ${err.response?.data?.detail || err.response?.data?.error || err.message}`);
            }
        }
    };

    // '정지 해제' (활성으로 변경) 핸들러
    // 백엔드에 activateUserByAdmin API가 없다고 가정하고, 프론트엔드에서만 메시지 표시
    const handleActivateUser = async () => {
        if (window.confirm("정말로 이 유저의 정지를 해제(활성)하시겠습니까?")) {
            alert("죄송합니다. 현재 '정지 해제' 기능을 위한 백엔드 API가 구현되지 않았습니다. 개발자에게 문의해주세요.");
            console.warn("백엔드에 /users/admin/activate/{userHashId} 같은 활성화 API가 구현되어야 합니다.");
            // 실제 API 호출 로직은 백엔드 구현 후 여기에 추가
            // try {
            //     const res = await apiClient.post(`/users/admin/activate/${userHashId}`);
            //     alert(res.data || "유저 정지가 성공적으로 해제되었습니다.");
            //     fetchUserDetail();
            // } catch (err) {
            //     console.error("유저 정지 해제 중 오류 발생:", err);
            //     setError(`유저 정지 해제 실패: ${err.response?.data?.detail || err.response?.data?.error || err.message}`);
            // }
        }
    };


    // 유저 영구 삭제 핸들러 (DB에서 완전히 제거)
    const handlePermanentDeleteUser = async () => {
        if (window.confirm("경고: 이 유저를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            try {
                const res = await apiClient.delete(`/users/admin/permanent/${userHashId}`);
                alert(res.data || "유저가 성공적으로 영구 삭제되었습니다.");
                navigate('/admin/users'); // 삭제 후 목록 페이지로 이동
            } catch (err) {
                console.error("유저 영구 삭제 중 오류 발생:", err);
                setError(`유저 영구 삭제 실패: ${err.response?.data?.detail || err.response?.data?.error || err.message}`);
            }
        }
    };

    //  사용자 상태를 한글로 변환하는 핵심 로직 (프론트엔드 처리)
    const getUserStatusDisplayName = (state) => {
        switch (state) {
            case 'DELETED_WAIT':
                return '정지'; // 'DELETED_WAIT'는 '정지'로 표시
            default:
                return '활성'; // 그 외 모든 상태는 '활성'으로 표시
        }
    };

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
            <h2 className={styles.title}>{isEditMode ? '유저 정보 수정' : '유저 상세 정보'}</h2>

            {isEditMode ? (
                // 수정 폼
                <form onSubmit={handleSubmit} className={styles.editForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">이름:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.inputField}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="region">지역:</label>
                        <input
                            type="text"
                            id="region"
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="preferSports">선호 종목:</label>
                        <input
                            type="text"
                            id="preferSports"
                            name="preferSports"
                            value={formData.preferSports}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="tel">전화번호:</label>
                        <input
                            type="tel"
                            id="tel"
                            name="tel"
                            value={formData.tel}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="gender">성별:</label>
                        <input
                            type="text"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">새 비밀번호 (변경 시에만 입력):</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.inputField}
                            placeholder="새 비밀번호를 입력하세요"
                        />
                    </div>

                    {/* 프로필 이미지 미리보기 및 업로드 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="profile">프로필 이미지:</label>
                        {currentProfileUrl && (
                            <div className={styles.currentProfile}>
                                <p>현재 이미지:</p>
                                <img src={currentProfileUrl} alt="Current Profile" className={styles.profilePreview} />
                            </div>
                        )}
                        <input
                            type="file"
                            id="profile"
                            name="profile"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                    </div>

                    <div className={styles.actionButtons}>
                        <button type="submit" className={styles.saveButton} disabled={loading}>
                            {loading ? '저장 중...' : '변경 사항 저장'}
                        </button>
                        <button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>
                            취소
                        </button>
                    </div>
                </form>
            ) : (
                // 상세 정보 표시
                <>
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
                        <strong>가입일:</strong> {userDetail.createdAt ? new Date(userDetail.createdAt).toLocaleDateString() : "-"}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>상태:</strong>{" "}
                        <span style={{ fontWeight: "bold", color: userDetail.state === 'DELETED_WAIT' ? 'orange' : 'green' }}>
                            {getUserStatusDisplayName(userDetail.state)}
                        </span>
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={handleEditMode}>유저 수정</button>
                        {/* 상태에 따라 '유저 정지' 또는 '정지 해제' 버튼 조건부 렌더링 */}
                        {/*{userDetail.state === 'DELETED_WAIT' ?
                        {/*    <button className={styles.activateButton} onClick={handleActivateUser}>*/}
                        {/*        정지 해제*/}
                        {/*    </button>*/}
                        {/*    <button className={styles.deleteButton} onClick={handleSuspendUser}>*/}
                        {/*        유저 정지*/}
                        {/*    </button>*/}
                        {/*)}*/}
                        <button className={styles.permanentDeleteButton} onClick={handlePermanentDeleteUser}>유저 영구 삭제</button>
                    </div>
                </>
            )}
        </div>
    );
}