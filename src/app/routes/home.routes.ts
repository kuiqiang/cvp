import {HomeComponent} from "../components/home/home.component";
import {AuthGuard} from "../guards/auth.guard";

export const HOME_ROUTES = [
    {path: "", component: HomeComponent, canActivate: [AuthGuard]}
];
