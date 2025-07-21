import axios from "axios";

// Axios 인스턴스 생성
const apiClient = axios.create({
    // 모든 요청에 '/api'를 기본으로 붙임
    // Vite 프록시 설정을 통해 백엔드 서버로 요청이 전달됩니다.
    baseURL: "/api",
});

// 요청 인터셉터: 모든 API 요청이 보내지기 전에 실행
apiClient.interceptors.request.use(
    (config) => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            // 헤더에 자동으로 Bearer 토큰을 추가
            config.headers["Authorization"] = `Bearer ${jwt}`;
        }
        return config;
    },
    (error) => {
        // 요청 에러 처리
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 모든 API 응답을 받은 후 실행 (선택사항)
apiClient.interceptors.response.use(
    (response) => {
        // 정상 응답은 그대로 반환
        return response;
    },
    (error) => {
        // 응답 에러 처리 (예: 401 Unauthorized 에러 시 자동 로그아웃)
        if (error.response && error.response.status === 401) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.removeItem("jwt");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);


export default apiClient;