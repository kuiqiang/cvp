import {provideRouter, RouterConfig} from "@angular/router";
import {HOME_ROUTES} from "./home.routes";
import {AUTH_ROUTES, AUTH_PROVIDERS} from "./auth.routes";

export const ROUTES:RouterConfig = [
    ...HOME_ROUTES,
    ...AUTH_ROUTES
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(ROUTES),
    AUTH_PROVIDERS
];
