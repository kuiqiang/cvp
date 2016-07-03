import {HTTP_PROVIDERS} from "@angular/http";
import {APP_ROUTER_PROVIDERS} from "../../app/routes/app.routes";

export const APPLICATION_PROVIDERS = [
    ...HTTP_PROVIDERS,
    ...APP_ROUTER_PROVIDERS
];

export const PROVIDERS = [
    ...APPLICATION_PROVIDERS
];
