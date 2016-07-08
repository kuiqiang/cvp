import {Router, ActivatedRoute} from "@angular/router";
import {Http, RequestMethod, Response, ResponseOptions, BaseRequestOptions, ResponseType} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {describe, it, expect, inject, fakeAsync, beforeEachProviders} from "@angular/core/testing";
import {TestComponentBuilder} from "@angular/compiler/testing";
import {VideoComponent} from "./video.component";
import {AuthService} from "../../services/auth/auth.service";
import {MockAuthService} from "../../test-utils/auth.service.mock";
import {MOCK_HTTP_PROVIDER} from "../../test-utils/constants";
import {MockRouter, MockActivatedRoute} from "../../test-utils/router.mock";
import {Video} from "../../classes/video.class";
import {PATHS} from "../../shared/paths";

describe("VideoComponent", () => {
    let video = new Video("1", "name", "description", "url", [5]);
    let sessionId = "session_id";

    beforeEachProviders(() => {
        return [
            MockBackend, BaseRequestOptions, MOCK_HTTP_PROVIDER,
            {provide: ActivatedRoute, useClass: MockActivatedRoute},
            {provide: Router, useClass: MockRouter},
            {provide: AuthService, useClass: MockAuthService}
        ];
    });

    describe("ngOnInit", () => {
        it("should subscribe to route changes", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    spyOn(videoCmpInstance, "subscribeToRouteChanges");

                    videoCmpInstance.ngOnInit();

                    expect(videoCmpInstance.subscribeToRouteChanges).toHaveBeenCalled();
                });
            }))
        );
    });

    describe("loadVideo", () => {
        it("should toggle pending status when called", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    videoCmpInstance.loadVideo();
                    expect(videoCmpInstance.isPending).toBe(true);
                });
            }))
        );

        it("should use an HTTP GET request to load video", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.method).toBe(RequestMethod.Get);
                    });

                    videoCmpInstance.loadVideo();
                });
            }))
        );

        it("should extract video and toggle idle status upon success", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success",
                            data: video
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    expect(videoCmpInstance.video).toBeUndefined();
                    videoCmpInstance.loadVideo().then(
                        () => {
                            // Possible improvement http://stackoverflow.com/questions/8736886
                            expect(videoCmpInstance.video).not.toBeUndefined();
                            expect(videoCmpInstance.isIdle).toBe(true);
                        }
                    );
                });
            }))
        );

        it("should toggle failed status and log error upon failure", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        // Watch bug: https://github.com/angular/angular/issues/9824
                        let response = new Response(new ResponseOptions({
                            status: 400,
                            type: ResponseType.Error,
                            body: JSON.stringify({
                                "status": "error",
                                "error": "Video Id not supplied."
                            })
                        }));

                        connection.mockRespond(response);
                    });

                    spyOn(console, "error");

                    videoCmpInstance.loadVideo().then(() => {
                        expect(videoCmpInstance.hasFailed).toBe(true);
                        expect(console.error).toHaveBeenCalled();
                    });
                });
            }))
        );

        it("should not make an HTTP request when component is pending", inject(
            [TestComponentBuilder, Http],
            fakeAsync((tcb:TestComponentBuilder, http:Http) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    spyOn(http, "get");

                    videoCmpInstance.togglePendingStatus();
                    videoCmpInstance.loadVideo();

                    expect(http.get).not.toHaveBeenCalled();
                });
            }))
        );
    });

    describe("loadSuggestions", () => {
        it("should toggle pending status when called", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    videoCmpInstance.loadSuggestions();
                    expect(videoCmpInstance.isPending).toBe(true);
                });
            }))
        );

        it("should use an HTTP GET request to load video", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.method).toBe(RequestMethod.Get);
                    });

                    videoCmpInstance.loadSuggestions();
                });
            }))
        );

        it("should provide a session ID, the number of videos to skip and to load in the HTTP request", inject(
            [TestComponentBuilder, MockBackend, AuthService],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend, authService:MockAuthService) => {
                authService.sessionId = sessionId;

                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;
                    let skip = 0;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.url)
                            .toBe(`/${PATHS.videos}?sessionId=session_id&skip=${skip}&limit=${2}`);
                    });

                    videoCmpInstance.loadSuggestions(skip);
                });
            }))
        );

        it("should extract video and toggle idle status upon success", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success",
                            data: [video]
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    expect(videoCmpInstance.suggestedVideos.length).toBe(0);
                    videoCmpInstance.loadSuggestions().then(
                        () => {
                            expect(videoCmpInstance.suggestedVideos.length).toBe(1);
                            expect(videoCmpInstance.isIdle).toBe(true);
                        }
                    );
                });
            }))
        );

        it("should toggle failed status and log error upon failure", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        // Watch bug: https://github.com/angular/angular/issues/9824
                        let response = new Response(new ResponseOptions({
                            status: 400,
                            type: ResponseType.Error,
                            body: JSON.stringify({
                                "status": "error",
                                "error": "Video Id not supplied."
                            })
                        }));

                        connection.mockRespond(response);
                    });

                    spyOn(console, "error");

                    videoCmpInstance.loadSuggestions().then(() => {
                        expect(videoCmpInstance.hasFailed).toBe(true);
                        expect(console.error).toHaveBeenCalled();
                    });
                });
            }))
        );

        it("should not make an HTTP request when component is pending", inject(
            [TestComponentBuilder, Http],
            fakeAsync((tcb:TestComponentBuilder, http:Http) => {
                    return tcb.createAsync(VideoComponent).then(fixture => {
                        let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                        spyOn(http, "get");

                        videoCmpInstance.togglePendingStatus();
                        videoCmpInstance.loadSuggestions();

                        expect(http.get).not.toHaveBeenCalled();
                    });
                }
            ))
        );
    });

    describe("onRate", () => {
        it("should set video rating when given rating only", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success",
                            data: video
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    videoCmpInstance.loadVideo().then(
                        () => {
                            videoCmpInstance.onRate(5);
                            expect(videoCmpInstance.video.ratings).toEqual(video.ratings.concat([5]));
                        }
                    );
                });
            }))
        );

        it("should set suggested video rating when given rating and index", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success",
                            data: [video]
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    videoCmpInstance.loadSuggestions().then(
                        () => {
                            videoCmpInstance.onRate(5, 0);
                            expect(videoCmpInstance.suggestedVideos[0].ratings).toEqual(video.ratings.concat([5]));
                        }
                    );
                });
            }))
        );
    });

    describe("subscribeToRouteChanges", () => {
        it("should subscribe to router route", inject(
            [TestComponentBuilder, ActivatedRoute],
            fakeAsync((tcb:TestComponentBuilder, activatedRoute:MockActivatedRoute) => {
                return tcb.createAsync(VideoComponent).then(fixture => {
                    let videoCmpInstance:VideoComponent = <VideoComponent>fixture.componentInstance;

                    videoCmpInstance.subscribeToRouteChanges();
                    expect(videoCmpInstance.videoId).toEqual(activatedRoute.videoId);
                });
            }))
        );
    });
});
