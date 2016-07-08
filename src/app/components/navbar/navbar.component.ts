import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {CONFIG} from "../../shared/config";
import {AuthService} from "../../services/auth/auth.service";
import {PATHS} from "../../shared/paths";
import {XHRComponent} from "../xhr/xhr.component";

@Component({
    selector: "cvp-navbar",
    template: require("./navbar.html"),
    directives: [ROUTER_DIRECTIVES]
})
export class NavbarComponent extends XHRComponent {
    private _brand:string = CONFIG.META.BRAND;
    private _paths = PATHS;

    /**
     * Initialize component
     *
     * @param _authService
     */
    constructor(private _authService:AuthService) {
        super();
    }

    /**
     * Logout user
     */
    logout() {
        if (this.isPending)
            return;

        this.togglePendingStatus();
        return this._authService.logout().then(() => {
            this.toggleIdleStatus();
        });
    }
}
