import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {PATHS} from "../../shared/paths";
import {XHRComponent} from "../xhr/xhr.component";

@Component({
    selector: "cvp-auth",
    template: require("./auth-form.html")
})
export class AuthFormComponent extends XHRComponent {
    private _username:string;
    private _password:string;
    private _error:string;

    constructor(private _authService:AuthService, private _router:Router) {
        super();
    }

    /**
     * Respond when the user submits the form
     *
     * @param formValue
     * @returns {Thenable<U>}
     */
    onSubmit(formValue:any) {
        if (this.isPending)
            return;

        this.togglePendingStatus();
        return this._authService
            .login(formValue.username, formValue.password)
            .then(() => {
                this._router.navigate([PATHS.index]);
                this.toggleIdleStatus();
            })
            .catch(error => this._handleError(error));
    }

    /**
     * Handle error
     *
     * @param error
     * @private
     */
    protected _handleError(error:Error) {
        this._error = error.message;
        this.toggleFailedStatus();
    }

    /**
     * Clear error
     *
     * @private
     */
    private _clearError() {
        this.toggleIdleStatus();
        this._error = "";
    }
}
