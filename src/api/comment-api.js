import request from "../../utils/request";

const getAll = (product_id) => {
    return request(`/comments?product_id=eq.${product_id}`);
};
// &order=created_at.desc
const create = async (data) => {
    return await request('/comments', 'POST', data);
}

export const comment_api={
    getAll,
    create
}