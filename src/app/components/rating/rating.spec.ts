import {Component} from "@angular/core";
import {Http, RequestMethod, Response, ResponseOptions, BaseRequestOptions, ResponseType} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {describe, it, expect, inject, fakeAsync, beforeEachProviders} from "@angular/core/testing";
import {TestComponentBuilder} from "@angular/compiler/testing";
import {RatingComponent} from "./rating.component";
import {AuthService} from "../../services/auth/auth.service";
import {PATHS} from "../../shared/paths";
import {MockAuthService} from "../../test-utils/auth.service.mock";
import {MOCK_HTTP_PROVIDER} from "../../test-utils/constants";

describe("RatingComponent", () => {
    beforeEachProviders(() => {
        return [
            MockBackend, BaseRequestOptions, MOCK_HTTP_PROVIDER,
            {provide: AuthService, useClass: MockAuthService}
        ];
    });

    describe("submit", () => {
        it("should toggle pending status when called", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit();
                    expect(ratingCmpInstance.isPending).toBe(true);
                });
            }))
        );

        it("should use an HTTP POST request to submit rating", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.method).toBe(RequestMethod.Post);
                    });

                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit();
                });
            }))
        );

        it("should provide session ID and ratings in the HTTP request", inject(
            [TestComponentBuilder, MockBackend, AuthService],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend, authService:MockAuthService) => {
                authService.sessionId = "session_id";

                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        expect(connection.request.url).toBe(`/${PATHS.rate}?sessionId=${authService.sessionId}`);
                        expect(JSON.parse(connection.request.getBody()).rating).toBe(5);
                    });

                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit();
                });
            }))
        );

        it("should toggle idle status and exit edit mode upon success", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success"
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    ratingCmpInstance.enterEditMode();
                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit().then(
                        () => {
                            expect(ratingCmpInstance.isIdle).toBe(true);
                            expect(ratingCmpInstance.isInEditMode).toBe(false);
                        }
                    );
                });
            }))
        );

        it("should trigger rate event on parent component upon success", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(WrapperComponent).then(fixture => {
                    let wrapper:WrapperComponent = <WrapperComponent>fixture.componentInstance;
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.debugElement.children[0].componentInstance;

                    backend.connections.subscribe((connection:MockConnection) => {
                        let mockResponseBody = {
                            status: "success"
                        };
                        let response = new Response(new ResponseOptions({body: JSON.stringify(mockResponseBody)}));

                        connection.mockRespond(response);
                    });

                    spyOn(wrapper, "onRate");

                    ratingCmpInstance.enterEditMode();
                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit().then(
                        () => {
                            expect(wrapper.onRate).toHaveBeenCalled();
                        }
                    );
                });
            }))
        );

        it("should toggle failed status and remain in edit mode upon failure", inject(
            [TestComponentBuilder, MockBackend],
            fakeAsync((tcb:TestComponentBuilder, backend:MockBackend) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

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

                    ratingCmpInstance.enterEditMode();
                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit().then(
                        () => {
                            expect(ratingCmpInstance.hasFailed).toBe(true);
                            expect(ratingCmpInstance.isInEditMode).toBe(true);
                        }
                    );
                });
            }))
        );

        it("should not make an HTTP request when component is pending", inject(
            [TestComponentBuilder, Http],
            fakeAsync((tcb:TestComponentBuilder, http:Http) => {
                return tcb.createAsync(WrapperComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.debugElement.children[0].componentInstance;

                    spyOn(http, "post");

                    ratingCmpInstance.togglePendingStatus();
                    ratingCmpInstance.rate(5);
                    ratingCmpInstance.submit();

                    expect(http.post).not.toHaveBeenCalled();
                });
            })
        ));

        it("should not make an HTTP request when no rating is given", inject(
            [TestComponentBuilder, Http],
            fakeAsync((tcb:TestComponentBuilder, http:Http) => {
                return tcb.createAsync(WrapperComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.debugElement.children[0].componentInstance;

                    spyOn(http, "post");

                    ratingCmpInstance.togglePendingStatus();
                    ratingCmpInstance.submit();

                    expect(http.post).not.toHaveBeenCalled();
                });
            })
        ));
    });

    describe("getAverageRating", () => {
        it("should return a correct average rating", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(WrapperComponent).then(fixture => {
                    let wrapper:WrapperComponent = <WrapperComponent>fixture.componentInstance;
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.debugElement.children[0].componentInstance;

                    wrapper.mockRatings = [4, 5, 2, 4, 6, 5];
                    fixture.detectChanges();
                    expect(ratingCmpInstance.getAverageRating()).toBe(4.333333333333333);

                    wrapper.mockRatings = [4, 4, 4, 4];
                    fixture.detectChanges();
                    expect(ratingCmpInstance.getAverageRating()).toBe(4);
                });
            })
        ));

        it("should return a value not more than 5", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(WrapperComponent).then(fixture => {
                    let wrapper:WrapperComponent = <WrapperComponent>fixture.componentInstance;
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.debugElement.children[0].componentInstance;

                    wrapper.mockRatings = [6, 7, 6, 8, 9, 10];
                    fixture.detectChanges();
                    expect(ratingCmpInstance.getAverageRating()).toBe(5);
                });
            })
        ));
    });

    describe("rate", () => {
        it("should not rate when pending", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    ratingCmpInstance.togglePendingStatus();
                    ratingCmpInstance.rate(5);
                    expect(ratingCmpInstance.rating).toBeUndefined();
                });
            })
        ));
    });

    describe("setTmpRating", () => {
        it("should set temporary rating", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    ratingCmpInstance.setTmpRating(5);
                    expect(ratingCmpInstance.tmpRating).toBe(5);
                });
            })
        ));

        it("should not set when pending", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                return tcb.createAsync(RatingComponent).then(fixture => {
                    let ratingCmpInstance:RatingComponent = <RatingComponent>fixture.componentInstance;

                    ratingCmpInstance.togglePendingStatus();
                    ratingCmpInstance.setTmpRating(5);
                    expect(ratingCmpInstance.tmpRating).toBeUndefined();
                });
            })
        ));
    });
});

@Component({
    selector: "wrapper",
    template: "<rating [ratings]='mockRatings' (rate)='onRate()'></rating>",
    directives: [RatingComponent]
})
class WrapperComponent {
    mockRatings:Array<number>;
    onRate:Function = () => {
    };
}
