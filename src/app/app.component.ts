import {Component, ViewEncapsulation} from "@angular/core";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {CONSTANTS} from "./shared";

@Component({
    selector: "cvp-app",
    template: require("./app.html"),
    encapsulation: ViewEncapsulation.None,
    styleUrls: [require("!style!css!sass!../sass/main.scss")],
    directives: [NavbarComponent]
})
export class AppComponent {
    public appBrand:string;

    constructor() {
        this.appBrand = CONSTANTS.MAIN.APP.BRAND;
    }
}
