import axios from 'axios';
import STRINGS from '../assets/strings';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
	timeout: 60000,
	headers: {
		'Content-Type': 'application/json'
	}
});

/* Request Interceptor (Attach Token) */
axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		const sessionId = localStorage.getItem('sessionId');

		if (token && sessionId) {
			config.headers.Authorization = `Bearer ${token}`;
			config.headers.sessionID = sessionId;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

/* Response Interceptor */

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const FATAL_ERRORS = [
			STRINGS.API_ERRORS.invalid_token,
			STRINGS.API_ERRORS.seesionid_required,
			STRINGS.API_ERRORS.session_expired,
			STRINGS.API_ERRORS.token_required
		];
		if (error.response?.status === 401 && error.response.data.error === STRINGS.API_ERRORS.token_expired) {
			originalRequest._retry = true;
			const response = await axiosInstance.get('/auth/v1/refresh_token');
			if (response.data.success) {
				const newToken = response.data.access_token;
				localStorage.setItem('token', newToken);
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axiosInstance(originalRequest);
			}
		} else if (error.response?.status === 401 && FATAL_ERRORS.includes(error.response.data.error)) {
			localStorage.removeItem('token');
			localStorage.removeItem('sessionId');
			localStorage.removeItem('isSystem');
			localStorage.removeItem('userId');
			localStorage.removeItem('username');
			const { setIsLoggedIn } = useAuth();
			setIsLoggedIn(false);
			const navigate = useNavigate();
			navigate('/login');
		}
		return error.response;
	}
);

export default axiosInstance;
