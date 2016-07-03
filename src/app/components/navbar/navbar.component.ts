import {Component, Input} from "@angular/core";

@Component({
    selector: "cvp-navbar",
    template: require("./navbar.html")
})
export class NavbarComponent {
    @Input() brand:string;
}
