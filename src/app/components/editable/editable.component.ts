import {XHRComponent} from "../xhr/xhr.component";

export abstract class EditableComponent extends XHRComponent {
    private _editMode:boolean = false;

    constructor() {
        super();

        this.toggleIdleStatus();
    }

    /**
     * Get if component is edit mode
     *
     * @returns {boolean}
     */
    get isInEditMode():boolean {
        return this._editMode;
    }

    /**
     * Enter edit mode
     */
    enterEditMode() {
        this._editMode = true;
        this._setDefaultValue();
    }

    /**
     * Exit edit mode
     */
    exitEditMode() {
        if (this.isPending)
            return;

        this._editMode = false;
        this.toggleIdleStatus();
    }

    /**
     * Respond when the user submits changes
     *
     * @private
     */
    abstract submit();

    /**
     * Set the default value of the component
     *
     * @private
     */
    protected abstract _setDefaultValue();
}
