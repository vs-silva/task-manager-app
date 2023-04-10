import {Route, Routes } from "react-router-dom";
import {RoutePathConstants} from "./route-path.constants";
import {HomePage} from "../pages/home-page";

export function Router(): JSX.Element {
    return (<Routes>
        <Route path={RoutePathConstants.HOME} element={<HomePage />}></Route>
    </Routes>);
}
