import {Http} from "@angular/http";
import {BaseRequestOptions} from "@angular/http/index";
import {MockBackend} from "@angular/http/testing";

export const MOCK_HTTP_PROVIDER = {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions],
    useFactory: (backend:MockBackend, defaultOptions:BaseRequestOptions) => {
        return new Http(backend, defaultOptions);
    }
};
