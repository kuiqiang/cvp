import {Component} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";

@Component({
    selector: "cvp-auth",
    template: require("./auth-form.html")
})
export class AuthFormComponent {
    private _username:string;
    private _password:string;

    constructor(private auth:AuthService) {
    }

    /**
     * Respond when the user submits the form
     */
    private _onSubmit() {
        this.auth.login(this._username, this._password).then(result => {
            console.log(result);
        });
    }
}
