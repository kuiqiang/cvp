export class XHRComponent {
    STATUSES = {
        idle: 100,
        pending: 102,
        failed: 424
    };

    private _status:number;

    /**
     * Get status number
     *
     * @returns {number}
     */
    get status():number {
        return this._status;
    }

    /**
     * Get whether component is idle
     *
     * @returns {boolean}
     * @private
     */
    get isIdle() {
        return this._status === this.STATUSES.idle;
    }

    /**
     * Get whether component is pending
     *
     * @returns {boolean}
     * @private
     */
    get isPending() {
        return this._status === this.STATUSES.pending;
    }

    /**
     * Get whether the previous request has failed
     *
     * @returns {boolean}
     * @private
     */
    get hasFailed() {
        return this._status === this.STATUSES.failed;
    }

    /**
     * Component is idle
     *
     * @private
     */
    toggleIdleStatus() {
        this._status = this.STATUSES.idle;
    }

    /**
     * Component is in the process of an XHR request
     *
     * @private
     */
    togglePendingStatus() {
        this._status = this.STATUSES.pending;
    }

    /**
     * Component failed the last XHR request
     *
     * @private
     */
    toggleFailedStatus() {
        this._status = this.STATUSES.failed;
    }

    /**
     * Handle error
     *
     * @param error
     * @private
     */
    protected _handleError(error:any) {
        this.toggleFailedStatus();
        console.error(error);
    }
}
