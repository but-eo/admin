import React from 'react';

// 메뉴 항목 데이터
const menuItems = [
    { id: 'inquiry', name: '문의 관리' },
    { id: 'stadium', name: '경기장 관리' },
    { id: 'user', name: '유저 관리' },
    { id: 'board', name: '게시판 관리' },
    { id: 'chat', name: '채팅방 관리' },
];

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
            <a href="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">SPORTS ADMIN</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map(item => (
                    <li className="nav-item" key={item.id}>
                        <a
                            href="#"
                            className={`nav-link text-white ${activeTab === item.id ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(item.id);
                            }}
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
            <hr />
            <button className="btn btn-outline-light" onClick={onLogout}>
                로그아웃
            </button>
        </div>
    );
}