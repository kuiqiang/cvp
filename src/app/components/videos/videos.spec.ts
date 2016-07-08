import {Http, RequestMethod, BaseRequestOptions, Response, ResponseOptions, ResponseType} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Router} from "@angular/router";
import {describe, it, inject, fakeAsync, beforeEachProviders} from "@angular/core/testing";
import {TestComponentBuilder} from "@angular/compiler/testing";
import {VideosComponent} from "./videos.component";
import {AuthService} from "../../services/auth/auth.service";
import {MockAuthService} from "../../test-utils/auth.service.mock";
import {MOCK_HTTP_PROVIDER} from "../../test-utils/constants";
import {MockRouter} from "../../test-utils/router.mock";
import {Video} from "../../classes/video.class";
import {PATHS} from "../../shared/paths";
import {CONFIG} from "../../shared/config";

describe("VideosComponent", () => {
    let video = new Video("1", "name", "description", "url", [5]);
    let sessionId = "session_id";

    beforeEachProviders(() => {
        return [
            MockBackend, BaseRequestOptions, MOCK_HTTP_PROVIDER,
            {provide: Router, useClass: MockRouter},
            {provide: AuthService, useClass: MockAuthService}
        ];
    });

    describe("ngOnInit", () => {
        it("should load video and lazy load videos", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    spyOn(videosCmpInstance, "loadVideos");
                    spyOn(videosCmpInstance, "lazyLoadVideos");

                    videosCmpInstance.ngOnInit();

                    expect(videosCmpInstance.loadVideos).toHaveBeenCalled();
                    expect(videosCmpInstance.lazyLoadVideos).toHaveBeenCalled();
                });
            }))
        );
    });

    describe("loadVideos", () => {
        it("should toggle pending status when called", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    videosCmpInstance.loadVideos();
                    expect(videosCmpInstance.isPending).toBe(true);
                });
            }))
        );

        it("should use an HTTP GET request to load videos", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.method).toBe(RequestMethod.Get);
                    });

                    videosCmpInstance.loadVideos();
                });
            }))
        );

        it("should provide a session ID, the number of videos to skip and to load in the HTTP request", inject(
            [TestComponentBuilder, MockBackend, AuthService],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend, authService:MockAuthService) => {
                authService.sessionId = sessionId;

                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.url)
                            .toBe(`/${PATHS.videos}?sessionId=${sessionId}&skip=0&limit=${CONFIG.SETTINGS.LAZY_LOAD_BATCH_SIZE}`);
                    });

                    videosCmpInstance.loadVideos();
                });
            }))
        );

        it("should provide the correct number of videos to skip in the HTTP request", inject(
            [TestComponentBuilder, MockBackend, AuthService],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend, authService:MockAuthService) => {
                authService.sessionId = sessionId;

                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.url)
                            .toBe(`/${PATHS.videos}?sessionId=${sessionId}&skip=${videosCmpInstance.videos.length}` +
                                `&limit=${CONFIG.SETTINGS.LAZY_LOAD_BATCH_SIZE}`);
                    });

                    videosCmpInstance.videos = [video];
                    videosCmpInstance.loadVideos();
                });
            }))
        );

        it("should extract videos and toggle idle status upon success", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success",
                            data: [video]
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    videosCmpInstance.loadVideos().then(() => {
                        expect(videosCmpInstance.videos.length).toBe(1);
                    });
                });
            }))
        );

        it("should toggle failed status and log error upon failure", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

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

                    videosCmpInstance.loadVideos().then(() => {
                        expect(videosCmpInstance.hasFailed).toBe(true);
                        expect(console.error).toHaveBeenCalled();
                    });
                });
            }))
        );

        it("should not make an HTTP request when component is pending", inject(
            [TestComponentBuilder, Http],
            fakeAsync((tcb:TestComponentBuilder, http:Http) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    spyOn(http, "get");

                    videosCmpInstance.togglePendingStatus();
                    videosCmpInstance.loadVideos();

                    expect(http.get).not.toHaveBeenCalled();
                });
            })
        ));
    });

    describe("lazyLoadVideos", () => {
        it("should load videos when scroll reaches window's bottom", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;
                    let windowInnerHeight = 300;
                    let scrollYDistance = windowInnerHeight;
                    let scrollEvent = document.createEvent("UIEvents");

                    scrollEvent.initUIEvent("scroll", true, true, window, 1);

                    spyOn(videosCmpInstance, "loadVideos");

                    videosCmpInstance.lazyLoadVideos();

                    document.body.style.height = `${windowInnerHeight * 3}px`;
                    window.resizeTo(window.innerWidth, windowInnerHeight);

                    window.scrollTo(0, scrollYDistance);
                    window.dispatchEvent(scrollEvent);

                    expect(videosCmpInstance.loadVideos).toHaveBeenCalled();
                });
            }))
        );
    });

    describe("onRate", () => {
        it("should change target video rating", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(VideosComponent).then(fixture => {
                    let videosCmpInstance:VideosComponent = <VideosComponent>fixture.componentInstance;

                    videosCmpInstance.videos = [video];
                    videosCmpInstance.onRate(5, 0);

                    expect(videosCmpInstance.videos[0].ratings).toEqual([5, 5]);
                });
            }))
        );
    });
});
