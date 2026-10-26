import { authRequest } from "../../utils/request";

const register = async (data) => {
    return await authRequest('/signup', 'POST', data)
}

const login = async (data) => {
    return await authRequest('/token?grant_type=password', 'POST', data)
}

const logout = async () => {
    return await authRequest('/logout', 'POST')
}

export const auth_api = {
    register,
    login,
    logout
}