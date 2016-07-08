import {Router, ActivatedRoute} from "@angular/router";
import {TestComponentBuilder} from "@angular/compiler/testing";
import {describe, it, inject, fakeAsync, beforeEachProviders} from "@angular/core/testing";
import {MockAuthService} from "../../test-utils/auth.service.mock";
import {AuthService} from "../../services/auth/auth.service";
import {MockRouter, MockActivatedRoute} from "../../test-utils/router.mock";
import {AuthFormComponent} from "./auth-form.component";
import {PATHS} from "../../shared/paths";

describe("AuthFormComponent", () => {
    let formValue = {username: "username", password: "password"};
    let keydownEvent = document.createEvent("KeyboardEvent");
    keydownEvent.initEvent("keydown", true, false);

    beforeEachProviders(() => {
        return [
            {provide: Router, useClass: MockRouter},
            {provide: ActivatedRoute, useClass: MockActivatedRoute},
            {provide: AuthService, useClass: MockAuthService}
        ];
    });

    it("should clear form error and toggle idle status on username input element keydown event", inject(
        [TestComponentBuilder],
        fakeAsync((tcb:TestComponentBuilder) => {
            tcb.createAsync(AuthFormComponent).then(fixture => {
                let authFormCmpInstance = fixture.componentInstance;
                let authForm = fixture.nativeElement;
                let usernameInput:HTMLInputElement = <HTMLInputElement>authForm.querySelector("#username");

                authFormCmpInstance.onSubmit({}).then(() => {
                    usernameInput.dispatchEvent(keydownEvent);

                    fixture.detectChanges();
                    expect(authForm.querySelector(".form-error").textContent).toEqual("");
                    expect(authFormCmpInstance.isIdle).toBe(true);
                });
            });
        }))
    );

    it("should clear form error on password input element keydown event", inject(
        [TestComponentBuilder],
        fakeAsync((tcb:TestComponentBuilder) => {
            tcb.createAsync(AuthFormComponent).then(fixture => {
                let authFormCmpInstance = fixture.componentInstance;
                let authForm = fixture.nativeElement;
                let passwordInput:HTMLInputElement = <HTMLInputElement>authForm.querySelector("#password");

                authFormCmpInstance.onSubmit({}).then(() => {
                    passwordInput.dispatchEvent(keydownEvent);

                    fixture.detectChanges();
                    expect(authForm.querySelector(".form-error").textContent).toEqual("");
                    expect(authFormCmpInstance.isIdle).toBe(true);
                });
            });
        }))
    );

    describe("onSubmit", () => {
        it("should toggle pending status", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                tcb.createAsync(AuthFormComponent).then(fixture => {
                    let authFormCmpInstance = fixture.componentInstance;

                    authFormCmpInstance.onSubmit(formValue);
                    expect(authFormCmpInstance.isPending).toBe(true);
                });
            }))
        );

        it("should not resubmit if pending", inject(
            [TestComponentBuilder, AuthService],
            fakeAsync((tcb:TestComponentBuilder, authService:MockAuthService) => {
                tcb.createAsync(AuthFormComponent).then(fixture => {
                    let authFormCmpInstance = fixture.componentInstance;

                    spyOn(authService, "login");

                    authFormCmpInstance.togglePendingStatus();
                    authFormCmpInstance.onSubmit();
                    expect(authService.login).not.toHaveBeenCalled();
                });
            }))
        );

        it("should toggle idle status on success", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                tcb.createAsync(AuthFormComponent).then(fixture => {
                    let authFormCmpInstance = fixture.componentInstance;

                    authFormCmpInstance.onSubmit(formValue).then(() => {
                        expect(authFormCmpInstance.isIdle).toBe(true);
                    });
                });
            }))
        );

        it("should redirect to index page on success", inject(
            [TestComponentBuilder, Router],
            fakeAsync((tcb:TestComponentBuilder, router:MockRouter) => {
                tcb.createAsync(AuthFormComponent).then(fixture => {
                    let authFormCmpInstance = fixture.componentInstance;

                    spyOn(router, "navigate");

                    authFormCmpInstance.onSubmit(formValue).then(() => {
                        expect(router.navigate).toHaveBeenCalledWith([PATHS.index]);
                    });
                });
            }))
        );

        it("display error message on failure", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                tcb.createAsync(AuthFormComponent).then(fixture => {
                    let authFormCmpInstance = fixture.componentInstance;
                    let authForm = fixture.nativeElement;

                    authFormCmpInstance.onSubmit({}).then(() => {
                        fixture.detectChanges();
                        expect(authForm.querySelector(".form-error").textContent).toMatch(MockAuthService.ERROR);
                    });
                });
            }))
        );

        it("toggle failed status on failure", inject(
            [TestComponentBuilder],
            fakeAsync((tcb:TestComponentBuilder) => {
                tcb.createAsync(AuthFormComponent).then(fixture => {
                    let authFormCmpInstance = fixture.componentInstance;

                    authFormCmpInstance.onSubmit({}).then(() => {
                        expect(authFormCmpInstance.hasFailed).toBe(true);
                    });
                });
            }))
        );
    });
});
