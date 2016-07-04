import {XHRComponent} from "./xhr-component.class";

export abstract class EditableComponent extends XHRComponent {
    protected _editMode:boolean = false;

    constructor() {
        super();

        this._toggleIdleStatus();
    }

    /**
     * Enter edit mode
     */
    protected _enterEditMode() {
        this._editMode = true;
        this._setDefaultValue();
    }

    /**
     * Exit edit mode
     */
    protected _exitEditMode() {
        if (this._isPending())
            return;

        this._editMode = false;
        this._toggleIdleStatus();
    }

    /**
     * Handle error
     *
     * @param error
     * @private
     */
    protected _handleError(error:any) {
        this._toggleFailedStatus();
        console.error(error);
    }

    /**
     * Set the default value of the component
     *
     * @private
     */
    protected abstract _setDefaultValue();

    /**
     * Respond when the user submits changes
     *
     * @private
     */
    protected abstract _onSubmit();
}
