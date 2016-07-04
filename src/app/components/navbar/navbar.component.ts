import {Component} from "@angular/core";
import {CONFIG} from "../../shared/config";
import {AuthService} from "../../services/auth/auth.service";
import {PATHS} from "../../shared/paths";

@Component({
    selector: "cvp-navbar",
    template: require("./navbar.html")
})
export class NavbarComponent {
    private _brand:string = CONFIG.META.BRAND;
    private _paths = PATHS;

    constructor(private _authService:AuthService) {
    }
}
