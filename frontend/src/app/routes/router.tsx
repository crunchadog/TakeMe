import {createBrowserRouter} from "react-router-dom";
import {Layout} from "@/app/Layout/Layout.tsx";
import {ErrorPage} from "@/pages/error/ErrorPage.tsx";
import {ProtectedRoute} from "@/app/routes/ProtectedRoute.tsx";
import {LoginPage} from "@/pages/login/LoginPage.tsx";
import {RegisterPage} from "@/pages/register/RegisterPage.tsx";
import {TripsPage} from "@/pages/trips/TripsPage.tsx";
import {CreateTripPage} from "@/pages/create-trip/CreateTripPage.tsx";
import {TripDetailsPage} from "@/pages/trip-details/TripDetailsPage.tsx";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage/>,
        errorElement: <ErrorPage/>,
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
                        element: <TripsPage/>
                    },
                    {
                        path: '/trips/new',
                        element: <CreateTripPage/>
                    },
                    {
                        path: '/trips/:id',
                        element: <TripDetailsPage/>
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