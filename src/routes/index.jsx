import { useContext, useState, createContext } from "react"
import { BrowserRouter, useRoutes } from "react-router-dom"
import dynamicRoutes from "./routes.dynamic"

export const RoutesContext = createContext()

const Routes = () => {
    const [routesData] = useContext(RoutesContext)
    return useRoutes(routesData)
}

const RoutesConfig = () => {
    const [routesData, setRoutesData] = useState(dynamicRoutes())
    return (
        <RoutesContext.Provider value={[routesData, setRoutesData]}>
            <BrowserRouter>
                <Routes></Routes>
            </BrowserRouter>
        </RoutesContext.Provider>
    )
}

export default RoutesConfig;
