import { useRoutes } from "react-router-dom"
import Login from "./login/Login"

const RouterController = () => {
return useRoutes([
    {
        path: '/',
        element: <Login/>
    }
])
}

export default RouterController