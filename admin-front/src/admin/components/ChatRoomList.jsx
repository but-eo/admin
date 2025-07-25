import React, { useEffect, useState } from "react";

const API_HOST = "http://13.125.250.158:714";

export default function ChatRoomList() {
    const [chatRooms, setChatRooms] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const jwt = localStorage.getItem("jwt");

    useEffect(() => {
        if (!jwt) {
            console.warn("JWT 토큰이 없습니다. 로그인 상태를 확인하세요.");
            return;
        }

        fetch(`${API_HOST}/allChatRooms`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401) {
                        throw new Error("인증 실패: 로그인 세션이 만료되었거나 유효하지 않습니다.");
                    }
                    throw new Error(`채팅방 목록 조회 실패: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                // 백엔드에서 ChattingDTO 객체들의 배열을 기대합니다.
                setChatRooms(data);
                console.log("최종 채팅방 목록 (Unique Chat Rooms):", data);
            })
            .catch(error => {
                console.error("채팅방 목록을 가져오는 중 오류 발생:", error);
                alert(`채팅방 목록을 불러오지 못했습니다: ${error.message}`);
            });
    }, [refresh, jwt]);

    const handleExitChatRoom = async (roomId) => {
        if (!window.confirm("정말 이 채팅방에서 나가시겠습니까?")) return;
        if (!jwt) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const res = await fetch(`${API_HOST}/exit/ChatRoom/${roomId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            if (res.ok) {
                alert("채팅방 나가기 완료.");
                setRefresh(r => r + 1);
            } else if (res.status === 401) {
                alert("인증 실패: 로그인 세션이 만료되었거나 유효하지 않습니다.");
            } else {
                const errorData = await res.text();
                alert(`채팅방 나가기 실패: ${res.status} - ${errorData}`);
            }
        } catch (error) {
            console.error("채팅방 나가기 중 오류 발생:", error);
            alert("네트워크 오류 또는 서버 응답이 없습니다.");
        }
    };

    const fetchChatMessages = async (roomId) => {
        try {
            const res = await fetch(`${API_HOST}/load/messages/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            if (!res.ok) {
                throw new Error(`메시지 로드 실패: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            setChatMessages(data);
            console.log("채팅 메시지:", data);
        } catch (error) {
            console.error("채팅 메시지를 가져오는 중 오류 발생:", error);
            alert(`채팅 메시지를 불러오지 못했습니다: ${error.message}`);
            setChatMessages([]);
        }
    };

    const handleSelectChatRoom = (roomId) => {
        setSelectedChatRoomId(roomId);
        fetchChatMessages(roomId);
    };

    if (selectedChatRoomId) {
        const selectedRoom = chatRooms.find(x => x.roomId === selectedChatRoomId);
        if (!selectedRoom) return null;

        return (
            <div className="border rounded p-4 mb-4">
                <button className="btn btn-link mb-2" onClick={() => setSelectedChatRoomId(null)}>
                    &lt; 목록으로 돌아가기
                </button>
                <h4>{selectedRoom.roomName}</h4>
                <div>채팅방 ID: {selectedRoom.roomId}</div>
                {/* ChattingDTO에 createdAt 필드가 없으므로 생성일은 표시하지 않습니다. */}
                {/* <div>생성 일자: {new Date(selectedRoom.createdAt).toLocaleDateString()}</div> */}

                <h5 className="mt-4">채팅 메시지</h5>
                <div className="chat-messages-container" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    {chatMessages.length === 0 ? (
                        <p className="text-muted">아직 메시지가 없습니다.</p>
                    ) : (
                        chatMessages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: '8px' }}>
                                <strong>{msg.nickName || msg.sender}</strong>: {msg.message}
                                <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '10px' }}>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3>채팅방 목록</h3>
            {chatRooms.length === 0 ? (
                <p className="text-muted">채팅방이 존재하지 않습니다.</p>
            ) : (
                <table className="table">
                    <thead>
                        {/* <tr> 태그와 <th> 태그 사이에 불필요한 공백을 모두 제거합니다. */}
                        <tr>
                            <th>채팅방 이름</th><th>채팅방 ID</th><th>생성일</th><th>상세 보기</th><th>나가기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chatRooms.map(room => (
                            // <tr> 태그와 <td> 태그 사이에 불필요한 공백을 모두 제거합니다.
                            <tr key={room.roomId}>
                                <td>{room.roomName}</td><td>{room.roomId}</td><td></td>{/* 생성일 데이터가 없으므로 빈 칸으로 둡니다. */}<td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleSelectChatRoom(room.roomId)}
                                    >
                                        상세
                                    </button>
                                </td><td>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleExitChatRoom(room.roomId)}
                                    >
                                        나가기
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}