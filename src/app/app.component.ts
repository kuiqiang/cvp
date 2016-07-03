import {Component, ViewEncapsulation} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {CONSTANTS} from "./shared";
import {AuthService} from "./services/auth/auth.service";

@Component({
    selector: "cvp-app",
    template: require("./app.html"),
    encapsulation: ViewEncapsulation.None,
    styleUrls: [require("!style!css!sass!../sass/main.scss")],
    directives: [NavbarComponent, ROUTER_DIRECTIVES],
    providers: [AuthService]
})
export class AppComponent {
    public appBrand:string;

    constructor() {
        this.appBrand = CONSTANTS.MAIN.APP.BRAND;
    }
}
