import {createBrowserRouter} from "react-router-dom";
import {Layout} from "@/app/Layout.tsx";
import {ErrorPage} from "@/pages/error/ErrorPage.tsx";
import {ProtectedRoute} from "@/app/ProtectedRoute.tsx";
import {LoginPage} from "@/pages/login/LoginPage.tsx";
import {RegisterPage} from "@/pages/register/RegisterPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/register',
        element: <RegisterPage/>,
        errorElement: <ErrorPage/>
    },
    {
        element: <Layout/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                element: <ProtectedRoute/>,
                children: [
                    {
                        path: '/trips',
                        element: <div>Поездки</div>
                    }
                ]
            }
        ],
    },
    {
        path: '*',
        element: <div>Not Found Page</div>
    }
])