import axiosInstance from './apiCall';

const get_all_users = async (params) => axiosInstance.get('/api/v1/users', params);
const get_user = async (id) => axiosInstance.get(`/api/v1/users/${id}`);
const create_user = async (data) => axiosInstance.post('/api/v1/users', data);
const update_user = async (id, data) => axiosInstance.patch(`/api/v1/users/${id}`, data);
const update_user_status = async (data) => axiosInstance.post(`/auth/v1/update_user_status`, data);

export const USERS = {
	get_all: (params) => get_all_users(params),
	get: (params) => get_user(params),
	create: (data) => create_user(data),
	update: (id, data) => update_user(id, data),
	activate_deactivate: (data) => update_user_status(data)
};

const get_all_creads = async (params) => axiosInstance.get('/api/v1/credentials', params);
const get_creads = async (id) => axiosInstance.get(`/api/v1/credentials/${id}`);
const create_creads = async (data) => axiosInstance.post('/api/v1/credentials', data);
const update_creads = async (id, data) => axiosInstance.patch(`/api/v1/credentials/${id}`, data);
const delete_creads = async (id) => axiosInstance.delete(`/api/v1/credentials/${id}`);
const clear_creads = async (data) => axiosInstance.delete(`/api/v1/credentials/clear`, data);

export const CREDENTIALS = {
    get_all: (params) => get_all_creads(params),
    get: (id) => get_creads(id),
    create: (data) => create_creads(data),
    update: (id, data) => update_creads(id, data),
    delete: (id) => delete_creads(id),
    clear: () => clear_creads()
}

const get_all_resource = async (params) => axiosInstance.get('/api/v1/resources', params);
const get_resource = async (id) => axiosInstance.get(`/api/v1/resources/${id}`);
const create_resource = async (data) => axiosInstance.post('/api/v1/resources', data);
const update_resource = async (id, data) => axiosInstance.patch(`/api/v1/resources/${id}`, data);
const delete_resource = async (id) => axiosInstance.delete(`/api/v1/resources/${id}`);

export const RESOURCES = {
    get_all: (params) => get_all_resource(params),
    get: (id) => get_resource(id),
    create: (data) => create_resource(data),
    update: (id, data) => update_resource(id, data),
    delete: (id) => delete_resource(id),
}