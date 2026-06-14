import {isRouteErrorResponse, Link, useRouteError} from "react-router-dom";

export function ErrorPage() {
    const error = useRouteError();

    let message = 'Что-то пошло не так'

    if (isRouteErrorResponse(error)) {
        message = `${error.status} - ${error.statusText}`
    }

    return (
        <div style={{padding: 48, textAlign: 'center'}}>
            <h1>Упс, наши шаловливые ручки что-то сломали</h1>
            <p>{message}</p>
            <Link to={'/trips'}>Вернуться к поездкам</Link>
        </div>
    );
}