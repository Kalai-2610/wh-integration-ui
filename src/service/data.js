import axiosInstance from './apiCall';

const get_all_users = async (params) => axiosInstance.get('/api/v1/users', params);
const get_user = async (params) => axiosInstance.get('/api/v1/users', params);
const create_user = async (data) => axiosInstance.post('/api/v1/users', data);
const update_user = async (id, data) => axiosInstance.patch(`/api/v1/users/${id}`, data);
const update_user_status = async (data) => axiosInstance.post(`/auth/v1/update_user_status`, data);

export const USERS = {
    get_all: (params) => get_all_users(params),
    get: (params) => get_user(params),
    create: (data) => create_user(data),
    update: (id, data) => update_user(id, data),
    activate_deactivate: (data) => update_user_status(data) 
}