import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth/auth.service";
import {PATHS} from "../shared/paths";

@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * Initialize guard
     *
     * @param _authService
     * @param _router
     */
    constructor(private _authService:AuthService, private _router:Router) {
    }

    /**
     * Control if user can activate route
     *
     * @returns {boolean}
     */
    canActivate() {
        if (this._authService.isAuthenticated) {
            return true;
        }
        this._router.navigate([`/${PATHS.login}`]);
        return false;
    }
}
