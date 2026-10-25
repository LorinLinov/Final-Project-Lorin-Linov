import request from "../../utils/request";

export const getAll = () => request('/products?order=created_at.desc', 'GET');
export const create = async (data) => request('/products', 'POST', data);
export const update = async (data, productId) => await request(`/product?id=eq.${productId}`, 'PUT', data);
export const remove = async (productId) => await request(`/product?id=eq.${productId}`, 'DELETE');