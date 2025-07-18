import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("title"); // 기본: 제목

    const jwt = localStorage.getItem("jwt");

    // 실제 API 호출
    const fetchBoards = async (pageNum = 0, keyword = "", type = "title") => {
        try {
            const params = {
                page: pageNum,
                size: 10,
            };

            if (keyword.trim() !== "") {
                if (type === "title") {
                    params.title = keyword;
                } else if (type === "userName") {
                    params.userName = keyword;
                }
            }

            const res = await axios.get("/api/boards/all", {
                headers: { Authorization: `Bearer ${jwt}` },
                params,
            });
            setBoards(res.data.content);
            setPage(res.data.number);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error("게시판 불러오기 실패:", error);
        }
    };

    const changeState = async (boardId, newState) => {
        try {
            await axios.patch(`/api/boards/${boardId}/state`, null, {
                headers: { Authorization: `Bearer ${jwt}` },
                params: { newState },
            });
            alert("상태 변경 완료");
            fetchBoards(page, searchKeyword, searchType);
        } catch {
            alert("상태 변경 실패");
        }
    };

    const deleteBoard = async (boardId) => {
        if (!window.confirm("정말 삭제하시겠습니까? 복구 불가합니다.")) return;
        try {
            await axios.delete(`/api/boards/${boardId}/hard`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            alert("삭제 완료");
            fetchBoards(page, searchKeyword, searchType);
        } catch {
            alert("삭제 실패");
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    // 검색 버튼 클릭 시 호출
    const handleSearch = () => {
        fetchBoards(0, searchKeyword, searchType); // 검색하면 0페이지부터
    };

    // Enter 키 눌렀을 때 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handlePrev = () => {
        if (page > 0) fetchBoards(page - 1, searchKeyword, searchType);
    };

    const handleNext = () => {
        if (page < totalPages - 1) fetchBoards(page + 1, searchKeyword, searchType);
    };

    return (
        <div>
            <h3>게시판 목록</h3>

            {/* 검색 영역 */}
            <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                    type="text"
                    placeholder={searchType === "title" ? "제목 검색" : "작성자 검색"}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ padding: "0.4rem", width: "200px" }}
                    aria-label="검색어 입력"
                />
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    style={{ padding: "0.4rem", width: "120px" }}
                    aria-label="검색 기준 선택"
                >
                    <option value="title">제목</option>
                    <option value="userName">작성자</option>
                </select>
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "0.4rem 1rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                    aria-label="검색 버튼"
                >
                    검색
                </button>
            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>카테고리</th>
                    <th>종목</th>
                    <th>생성일자</th>
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
                        <td>{new Date(board.createdAt).toLocaleString()}</td>
                        <td>
                            <select
                                defaultValue={board.state}
                                onChange={(e) => changeState(board.boardId, e.target.value)}
                            >
                                <option value="PUBLIC">PUBLIC</option>
                                <option value="PRIVATE">PRIVATE</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteBoard(board.boardId)}>
                                삭제
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 페이지네이션 UI */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "1rem",
                    userSelect: "none",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <button
                    style={
                        page === 0
                            ? {
                                padding: "0.4rem 0.8rem",
                                borderRadius: "4px",
                                border: "1px solid #c0c0c0",
                                backgroundColor: "#c0c0c0",
                                cursor: "not-allowed",
                                color: "#666",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }
                            : {
                                padding: "0.4rem 0.8rem",
                                borderRadius: "4px",
                                border: "1px solid #007bff",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }
                    }
                    onClick={handlePrev}
                    disabled={page === 0}
                    aria-label="이전 페이지"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L6.707 7l4.647 4.646a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708 0z"
                        />
                    </svg>
                    이전
                </button>

                <span style={{ fontWeight: "600" }}>
          {page + 1} / {totalPages}
        </span>

                <button
                    style={
                        page >= totalPages - 1
                            ? {
                                padding: "0.4rem 0.8rem",
                                borderRadius: "4px",
                                border: "1px solid #c0c0c0",
                                backgroundColor: "#c0c0c0",
                                cursor: "not-allowed",
                                color: "#666",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }
                            : {
                                padding: "0.4rem 0.8rem",
                                borderRadius: "4px",
                                border: "1px solid #007bff",
                                backgroundColor: "#007bff",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }
                    }
                    onClick={handleNext}
                    disabled={page >= totalPages - 1}
                    aria-label="다음 페이지"
                >
                    다음
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.646 14.354a.5.5 0 0 1 0-.708L9.293 9 4.646 4.354a.5.5 0 1 1 .708-.708l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708 0z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
