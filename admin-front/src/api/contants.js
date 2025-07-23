
const API_BASE_URL = "http://192.168.79.17:714";
// 맥북 ip 명령어 ipconfig getifaddr en0

const API_ENDPOINTS = {
    USERS_ADMIN_LIST: `${API_BASE_URL}/api/users/admin/list`,
    USERS_DETAIL: (userHashId) => `${API_BASE_URL}/api/users/${userHashId}`
};

export default API_ENDPOINTS;
