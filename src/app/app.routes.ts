import {provideRouter, RouterConfig} from "@angular/router";
import {HOME_ROUTES} from "./components/home/home.routes";
import {AUTH_ROUTES} from "./components/auth-form/auth-form.routes";

const routes:RouterConfig = [
    ...HOME_ROUTES,
    ...AUTH_ROUTES
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
