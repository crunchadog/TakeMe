import {useIsAuthenticated} from "@/features/auth/model/selectors.ts";
import {Navigate, Outlet} from "react-router-dom";

export function ProtectedRoute() {
    const isAuth = useIsAuthenticated()

    return isAuth ? <Outlet/> : <Navigate to={'/login'} replace/>
}