import { toast } from "react-toastify";
import { auth_api } from "../api/auth-api";
import { useNavigate } from "react-router";
import usePersistedState from "../hooks/usePersistedState";
import { createContext } from "react";

const AuthContext = createContext({
    accessToken: '',
    isAuthenticated: '',
    user: {},
    login() { },
    register() { }
})

export function AuthProvider({
    children
}) {

    const navigate = useNavigate();

    const [auth, setAuth] = usePersistedState('auth', null);

    const register = async (userData) => {

        try {
            const result = await auth_api.register(userData)

            if (!result) {
                return toast.error('Invalid input!');
            }

            setAuth(result);

            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    }

    const login = async (userData) => {
        try {
            const result = await auth_api.login(userData)

            if (!result) {
                return toast.error('Invalid input!');
            }

            setAuth(result);

            navigate('/');

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logoutAction = async () => {
        try {
            await auth_api.logout();
        } catch (error) {
            toast.error(error.message);

        } finally {

            setAuth(null);
        }
    }

    const contextValue = {
        accessToken: auth?.access_token,
        user: auth?.user,
        isAuthenticated: !!auth,
        register,
        login,
        logout: logoutAction,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;