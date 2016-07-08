import {describe, it} from "@angular/core/testing";
import {XHRComponent} from "./xhr.component";

describe("XHRComponent", () => {
    let component;

    beforeEach(() => {
        component = new XHRComponent();
    });

    describe("isIdle", () => {
        it("should be true when component is idle", () => {
            component.toggleIdleStatus();
            expect(component.status).toBe(component.STATUSES.idle);
            expect(component.isIdle).toBe(true);
        });
    });

    describe("isPending", () => {
        it("should be true when component is pending", () => {
            component.togglePendingStatus();
            expect(component.status).toBe(component.STATUSES.pending);
            expect(component.isPending).toBe(true);
        });
    });

    describe("hasFailed", () => {
        it("should be true when component has failed", () => {
            component.toggleFailedStatus();
            expect(component.status).toBe(component.STATUSES.failed);
            expect(component.hasFailed).toBe(true);
        });
    });

    describe("toggleIdleStatus", () => {
        it("should toggle idle status", () => {
            component.toggleIdleStatus();
            expect(component.status).toBe(component.STATUSES.idle);
        });
    });

    describe("togglePendingStatus", () => {
        it("should toggle pending status", () => {
            component.togglePendingStatus();
            expect(component.status).toBe(component.STATUSES.pending);
        });
    });

    describe("toggleFailedStatus", () => {
        it("should toggle failed status", () => {
            component.toggleFailedStatus();
            expect(component.status).toBe(component.STATUSES.failed);
        });
    });

    describe("_handleError", () => {
        let error = "spec: _handleError";

        it("should toggle failed status", () => {
            component._handleError(error);

            expect(component.hasFailed).toBe(true);
        });

        it("should output error", () => {
            spyOn(console, "error");

            component._handleError(error);

            expect(console.error).toHaveBeenCalledWith(error);
        });
    });
});
