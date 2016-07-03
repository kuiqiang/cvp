import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
    selector: "cvp-auth",
    template: require("./auth-form.html")
})
export class AuthFormComponent {
    private _username:string;
    private _password:string;
    private _hasError:boolean;
    private _error:string;

    constructor(private _authService:AuthService, private _router:Router) {
    }

    /**
     * Respond when the user submits the form
     */
    private _onSubmit() {
        this._authService.login(this._username, this._password)
            .then(() => {
                this._router.navigate(["/"]);
            })
            .catch(error => {
                this._handleError(error);
            });
    }

    /**
     * Handle error
     *
     * @param error
     * @private
     */
    private _handleError(error:any) {
        this._hasError = true;
        this._error = error;
    }

    /**
     * Clear error
     *
     * @private
     */
    private _clearError() {
        this._hasError = false;
        this._error = "";
    }
}
