import {Router, ActivatedRoute} from "@angular/router";
import {TestComponentBuilder} from "@angular/compiler/testing";
import {describe, it, inject, fakeAsync, beforeEachProviders} from "@angular/core/testing";
import {NavbarComponent} from "./navbar.component";
import {MockAuthService} from "../../test-utils/auth.service.mock";
import {AuthService} from "../../services/auth/auth.service";
import {MockRouter, MockActivatedRoute} from "../../test-utils/router.mock";
import {CONFIG} from "../../shared/config";

describe("NavbarComponent", () => {
    beforeEachProviders(() => {
        return [
            {provide: Router, useClass: MockRouter},
            {provide: ActivatedRoute, useClass: MockActivatedRoute},
            {provide: AuthService, useClass: MockAuthService}
        ];
    });

    it("should display brand", inject(
        [TestComponentBuilder],
        fakeAsync((tcb:TestComponentBuilder) => {
            tcb.createAsync(NavbarComponent).then(fixture => {
                let navbar = fixture.nativeElement;

                fixture.detectChanges();

                expect(navbar.querySelector(".navbar-brand").textContent).toMatch(`${CONFIG.META.BRAND}`);
            });
        }))
    );

    it("should show navbar toggle and navbar collapse when user is authenticated", inject(
        [TestComponentBuilder, AuthService],
        fakeAsync((tcb:TestComponentBuilder, authService:MockAuthService) => {
            tcb.createAsync(NavbarComponent).then(fixture => {
                let navbar = fixture.nativeElement;

                authService.isAuthenticated = true;

                fixture.detectChanges();

                expect(navbar.querySelector(".navbar-toggle")).not.toBeNull();
                expect(navbar.querySelector(".navbar-collapse")).not.toBeNull();
            });
        }))
    );

    it("should hide navbar toggle and navbar collapse when user is not authenticated", inject(
        [TestComponentBuilder, AuthService],
        fakeAsync((tcb:TestComponentBuilder, authService:MockAuthService) => {
            tcb.createAsync(NavbarComponent).then(fixture => {
                let navbar = fixture.nativeElement;

                authService.isAuthenticated = false;

                fixture.detectChanges();

                expect(navbar.querySelector(".navbar-toggle")).toBeNull();
                expect(navbar.querySelector(".navbar-collapse")).toBeNull();
            });
        }))
    );

    describe("logout", () => {
        it("should toggle pending status when called", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                tcb.createAsync(NavbarComponent).then(fixture => {
                    let navbarCmpInstance = fixture.componentInstance;

                    navbarCmpInstance.logout();

                    expect(navbarCmpInstance.isPending).toBe(true);
                });
            }))
        );

        it("should toggle idle status on success", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                tcb.createAsync(NavbarComponent).then(fixture => {
                    let navbarCmpInstance = fixture.componentInstance;

                    navbarCmpInstance.logout().then(() => {
                        expect(navbarCmpInstance.isIdle).toBe(true);
                    });
                });
            }))
        );

        it("should not make more than one logout request at a time", inject(
            [TestComponentBuilder, AuthService],
            fakeAsync((tcb:TestComponentBuilder, authService:MockAuthService) => {
                tcb.createAsync(NavbarComponent).then(fixture => {
                    let navbarCmpInstance = fixture.componentInstance;

                    spyOn(authService, "login");

                    navbarCmpInstance.togglePendingStatus();
                    navbarCmpInstance.logout();

                    expect(authService.login).not.toHaveBeenCalled();
                });
            }))
        );
    });
});
