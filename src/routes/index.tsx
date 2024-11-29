import { useRoutes } from "react-router-dom"
import Login from "./login/Login"
import Contracts from "./contracts/Contracts"

const RouterController = () => {
return useRoutes([
    {
        path: '/',
        element: <Login/>
    },
    {
        path: '/contracts',
        element: <Contracts/>
    }
])
}

export default RouterController