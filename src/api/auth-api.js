import { authRequest } from "../../utils/request";

export default async function register(data){
    return authRequest('/signup', 'POST', data)
}

export default function login(data){
    return authRequest('/token?grant_type=password', 'POST', data)
}

export default function logout(){
    return authRequest('/logout', 'POST')
}