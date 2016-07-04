import {AuthGuard} from "../guards/auth.guard";
import {AuthService} from "../services/auth/auth.service";
import {AuthFormComponent} from "../components/auth-form/auth-form.component";
import {PATHS} from "../shared/paths";

export const AUTH_ROUTES = [
    {path: PATHS.login, component: AuthFormComponent}
];

export const AUTH_PROVIDERS = [AuthService, AuthGuard];
