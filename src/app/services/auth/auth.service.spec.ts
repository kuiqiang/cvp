import {BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType} from "@angular/http";
import {Router} from "@angular/router";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {describe, it, inject, fakeAsync, beforeEachProviders, expect} from "@angular/core/testing";
import {AuthService} from "../../services/auth/auth.service";
import {MOCK_HTTP_PROVIDER} from "../../test-utils/constants";
import {PATHS} from "../../shared/paths";
import {MockRouter} from "../../test-utils/router.mock";

describe("AuthService", () => {
    let username = "username";
    let password = "password";
    let sessionId = "session_id";

    beforeEachProviders(() => {
        return [
            MockBackend, BaseRequestOptions, MOCK_HTTP_PROVIDER, AuthService,
            {provide: Router, useClass: MockRouter}
        ];
    });

    describe("login", () => {
        it("should use an HTTP POST request to authenticate", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {

                backend.connections.subscribe((connection:MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Post);
                    expect(connection.request.url).toBe(`/${PATHS.authenticate}`);
                });

                authService.login(username, password);
            }))
        );

        it("should provide given credentials in the HTTP request", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {

                backend.connections.subscribe((connection:MockConnection) => {
                    let credentials = JSON.parse(connection.request.getBody());

                    expect(credentials.username).toBe(username);
                    expect(credentials.password).toBe("5f4dcc3b5aa765d61d8327deb882cf99");
                });

                authService.login(username, password);
            }))
        );

        it("should become authenticated when server returns success", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {

                backend.connections.subscribe((connection:MockConnection) => {
                    let mockResponseBody = {
                        status: "success"
                    };

                    let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));
                    connection.mockRespond(response);
                });

                authService.login(username, password).then(
                    () => {
                        expect(authService.isAuthenticated).toBe(true);
                    }
                );
            }))
        );

        it("should capture returned username and session ID when server returns success", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {
                backend.connections.subscribe((connection:MockConnection) => {
                    let mockResponseBody = {
                        status: "success",
                        username: username,
                        sessionId: sessionId
                    };

                    let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));
                    connection.mockRespond(response);
                });

                authService.login(username, password).then(
                    () => {
                        expect(authService.username).toBe(username);
                        expect(authService.sessionId).toBe(sessionId);
                    }
                );
            }))
        );

        it("should log error when server does not return success", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {
                spyOn(console, "error");

                backend.connections.subscribe((connection:MockConnection) => {
                    // Watch bug: https://github.com/angular/angular/issues/9824
                    let response = new Response(new ResponseOptions({
                        status: 400,
                        type: ResponseType.Error,
                        body: JSON.stringify({
                            "status": "error",
                            "error": "Username or password is missing."
                        })
                    }));

                    connection.mockRespond(response);
                });

                authService.login(username, password).catch(() => {
                    expect(console.error).toHaveBeenCalledWith("Username or password is missing.");
                });
            }))
        );
    });

    describe("logout", () => {
        it("should use an HTTP GET request to logout", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {

                backend.connections.subscribe((connection:MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                });

                authService.logout();
            }))
        );

        it("should make HTTP request with session ID parameter in query string", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {
                backend.connections.subscribe((connection:MockConnection) => {
                    if (connection.request.url === `/${PATHS.authenticate}`) {
                        let mockResponseBody = {
                            status: "success",
                            username: username,
                            sessionId: sessionId
                        };

                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));
                        connection.mockRespond(response);
                    } else {
                        expect(connection.request.url).toBe(`/${PATHS.logout}?sessionId=${sessionId}`);
                    }
                });

                authService.login(username, password).then(() => {
                    if (authService.isAuthenticated) {
                        authService.logout();
                    }
                });
            }))
        );

        it("should clear all user authentication data upon successful de-authentication", inject(
            [MockBackend, AuthService],
            fakeAsync((backend:MockBackend, authService:AuthService) => {
                backend.connections.subscribe((connection:MockConnection) => {
                    let mockResponseBody, response;
                    if (connection.request.url === `/${PATHS.authenticate}`) {
                        mockResponseBody = {
                            status: "success",
                            username: username,
                            sessionId: sessionId
                        };
                        response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    } else {
                        mockResponseBody = {
                            status: "success"
                        };
                        response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    }
                });

                authService.login(username, password).then(() => {
                    if (authService.isAuthenticated) {
                        authService.logout().then(() => {
                            expect(authService.isAuthenticated).toBe(false);
                            expect(authService.sessionId).toBeUndefined();
                            expect(authService.username).toBeUndefined();
                        });
                    }
                });
            }))
        );

        it("should redirect user to login path upon successful de-authentication", inject(
            [MockBackend, AuthService, Router],
            fakeAsync((backend:MockBackend, authService:AuthService, router:MockRouter) => {

                spyOn(router, "navigate");

                backend.connections.subscribe((connection:MockConnection) => {
                    let mockResponseBody = {
                        status: "success"
                    };
                    let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));
                    connection.mockRespond(response);
                });

                authService.login(username, password).then(() => {
                    if (authService.isAuthenticated) {
                        authService.logout().then(() => {
                            expect(router.navigate).toHaveBeenCalledWith([`/${PATHS.login}`]);
                        });
                    }
                });
            }))
        );

        it("should log error when server does not return success", inject(
            [MockBackend, Http, AuthService],
            fakeAsync((backend:MockBackend, http:Http, authService:AuthService) => {
                spyOn(console, "error");

                backend.connections.subscribe((connection:MockConnection) => {
                    // Watch bug: https://github.com/angular/angular/issues/9824
                    let response = new Response(new ResponseOptions({
                        status: 401,
                        type: ResponseType.Error,
                        body: JSON.stringify({
                            "status": "error",
                            "error": "Not Authorized."
                        })
                    }));

                    connection.mockRespond(response);
                });

                authService.logout().catch(() => {
                    expect(console.error).toHaveBeenCalledWith("Not Authorized.");
                });
            }))
        );
    });
});
