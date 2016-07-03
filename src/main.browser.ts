import {bootstrap} from "@angular/platform-browser-dynamic";
import {DIRECTIVES, PIPES, PROVIDERS} from "./platform/browser";
import {ENV_PROVIDERS} from "./platform/environment";
import {AppComponent} from "./app/app.component";

export function main(initialHmrState?:any):Promise<any> {
    return bootstrap(AppComponent, [
        ...PROVIDERS,
        ...ENV_PROVIDERS,
        ...DIRECTIVES,
        ...PIPES
    ]).catch(err => console.error(err));
}

// Hot Module Reload (experimental)
if ("development" === ENV && HMR === true) {
    // Activate hot module reload
    let ngHmr = require("angular2-hmr");
    ngHmr.hotModuleReplacement(main, module);
} else {
    // Bootstrap when document is ready
    document.addEventListener("DOMContentLoaded", () => main());
}
