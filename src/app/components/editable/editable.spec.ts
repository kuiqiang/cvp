import {describe} from "@angular/core/testing";
import {EditableComponent} from "./editable.component";

describe("EditableComponent", () => {
    let component;

    beforeEach(() => {
        component = new MockEditableComponent();
    });

    it("should be idle when created", () => {
        expect(component.isIdle).toBe(true);
    });

    describe("enterEditMode", () => {
        it("should enter edit mode", () => {
            spyOn(component, "_setDefaultValue");

            component.enterEditMode();

            expect(component._setDefaultValue).toHaveBeenCalled();
            expect(component.isInEditMode).toBe(true);
        });
    });

    describe("exitEditMode", () => {
        beforeEach(() => {
            component.enterEditMode();
        });

        it("should exit edit mode", () => {
            spyOn(component, "toggleIdleStatus");

            component.exitEditMode();

            expect(component.isInEditMode).not.toBe(true);
            expect(component.toggleIdleStatus).toHaveBeenCalled();
            expect(component.isIdle).toBe(true);
        });

        it("should not exit edit mode when pending", () => {
            component.togglePendingStatus();
            component.exitEditMode();

            expect(component.isInEditMode).toBe(true);
        });
    });
});

class MockEditableComponent extends EditableComponent {
    submit() {
    }

    protected _setDefaultValue() {
    }
}
