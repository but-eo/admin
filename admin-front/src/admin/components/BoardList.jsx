import React, { useEffect, useState } from "react";
import apiClient from "../../api/index.js";

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("title");

    // API 호출 함수
    const fetchBoards = async (pageNum = 0) => {
        try {
            const params = { page: pageNum, size: 10 };
            if (searchKeyword.trim()) {
                params[searchType] = searchKeyword.trim();
            }

            const res = await apiClient.get("/boards/all", { params });
            setBoards(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("게시판 불러오기 실패:", error);
            alert("게시판 목록을 불러오는 데 실패했습니다.");
        }
    };

    // 상태 변경 함수
    const changeState = async (boardId, newState) => {
        try {
            await apiClient.patch(`/boards/${boardId}/state`, null, { params: { newState } });
            alert("상태 변경 완료");
            fetchBoards(page); // 현재 페이지 새로고침
        } catch {
            alert("상태 변경 실패");
        }
    };

    // 삭제 함수
    const deleteBoard = async (boardId) => {
        if (!window.confirm("정말 삭제하시겠습니까? 복구 불가합니다.")) return;
        try {
            await apiClient.delete(`/boards/${boardId}/hard`);
            alert("삭제 완료");
            fetchBoards(page);
        } catch {
            alert("삭제 실패");
        }
    };

    // 처음 렌더링 시 데이터 로드
    useEffect(() => {
        fetchBoards(0);
    }, []);

    // 검색 핸들러
    const handleSearch = () => fetchBoards(0);
    const handleKeyPress = (e) => e.key === 'Enter' && handleSearch();
    const handlePrev = () => page > 0 && fetchBoards(page - 1);
    const handleNext = () => page < totalPages - 1 && fetchBoards(page + 1);

    return (
        <div>
            <h2>게시판 관리</h2>

            {/* 검색 영역 */}
            <div className="d-flex gap-2 mb-3">
                <select className="form-select" style={{ width: '120px' }} value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="title">제목</option>
                    <option value="userName">작성자</option>
                </select>
                <input
                    type="text"
                    className="form-control"
                    placeholder="검색어 입력"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary" onClick={handleSearch}>검색</button>
            </div>

            {/* 테이블 */}
            <table className="table table-hover">
                <thead className="table-light">
                <tr>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>카테고리</th>
                    <th>종목</th>
                    <th>생성일</th>
                    <th>상태 변경</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {boards.map((board) => (
                    <tr key={board.boardId}>
                        <td>{board.title}</td>
                        <td>{board.userName}</td>
                        <td>{board.category}</td>
                        <td>{board.event}</td>
                        <td>{new Date(board.createdAt).toLocaleDateString()}</td>
                        <td>
                            <select className="form-select form-select-sm" value={board.state} onChange={(e) => changeState(board.boardId, e.target.value)}>
                                <option value="PUBLIC">PUBLIC</option>
                                <option value="PRIVATE">PRIVATE</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteBoard(board.boardId)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <nav className="d-flex justify-content-center">
                <ul className="pagination">
                    <li className={`page-item ${page === 0 && 'disabled'}`}>
                        <button className="page-link" onClick={handlePrev}>이전</button>
                    </li>
                    <li className="page-item active" aria-current="page">
                        <span className="page-link">{page + 1} / {totalPages}</span>
                    </li>
                    <li className={`page-item ${page >= totalPages - 1 && 'disabled'}`}>
                        <button className="page-link" onClick={handleNext}>다음</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}