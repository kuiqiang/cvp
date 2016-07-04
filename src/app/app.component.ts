import {Component, ViewEncapsulation} from "@angular/core";
import {NavbarComponent} from "./components/navbar/navbar.component";

@Component({
    selector: "cvp-app",
    template: require("./app.html"),
    encapsulation: ViewEncapsulation.None,
    styleUrls: [require("!style!css!sass!../sass/main.scss")],
    directives: [NavbarComponent]
})
export class AppComponent {
    /**
     * Bootstrap application
     */
    constructor() {
    }
}
