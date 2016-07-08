import {Router, ActivatedRoute} from "@angular/router";
import {describe, it, inject, fakeAsync, beforeEachProviders} from "@angular/core/testing";
import {AuthGuard} from "./auth.guard";
import {PATHS} from "../shared/paths";
import {MockActivatedRoute, MockRouter} from "../test-utils/router.mock";
import {MockAuthService} from "../test-utils/auth.service.mock";
import {AuthService} from "../services/auth/auth.service";

describe("AuthGuard", () => {
    beforeEachProviders(() => {
        return [
            AuthGuard,
            {provide: AuthService, useClass: MockAuthService},
            {provide: Router, useClass: MockRouter},
            {provide: ActivatedRoute, useClass: MockActivatedRoute}
        ];
    });

    describe("canActivate", () => {
        it("should be true if user is authenticated", inject(
            [AuthGuard, AuthService],
            fakeAsync((authGuard:AuthGuard, authService:MockAuthService) => {
                authService.isAuthenticated = true;

                expect(authGuard.canActivate()).toBe(true);
            })
        ));

        it("should be false if user is not authenticated", inject(
            [AuthGuard, AuthService],
            fakeAsync((authGuard:AuthGuard, authService:MockAuthService) => {
                authService.isAuthenticated = false;

                expect(authGuard.canActivate()).toBe(false);
            })
        ));

        it("should redirect to login if user is not authenticated", inject(
            [AuthGuard, AuthService, Router],
            fakeAsync((authGuard:AuthGuard, authService:MockAuthService, router:MockRouter) => {
                authService.isAuthenticated = false;

                spyOn(router, "navigate");

                authGuard.canActivate();

                let loginRoute = [`/${PATHS.login}`];

                expect(router.navigate).toHaveBeenCalledWith(loginRoute);
            })
        ));
    });
});
