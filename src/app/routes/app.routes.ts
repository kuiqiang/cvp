import {provideRouter, RouterConfig} from "@angular/router";
import {AUTH_ROUTES, AUTH_PROVIDERS} from "./auth.routes";
import {VIDEOS_ROUTES} from "./videos.routes";
import {VIDEO_ROUTES} from "./video.routes";

export const ROUTES:RouterConfig = [
    ...AUTH_ROUTES,
    ...VIDEOS_ROUTES,
    ...VIDEO_ROUTES
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(ROUTES),
    AUTH_PROVIDERS
];
