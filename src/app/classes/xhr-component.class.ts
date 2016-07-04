export class XHRComponent {
    STATUSES = {
        idle: 100,
        pending: 102,
        failed: 424
    };

    private _status:number;

    /**
     * Get whether component is idle
     *
     * @returns {boolean}
     * @private
     */
    protected _isIdle() {
        return this._status === this.STATUSES.idle;
    }

    /**
     * Get whether component is pending
     *
     * @returns {boolean}
     * @private
     */
    protected _isPending() {
        return this._status === this.STATUSES.pending;
    }

    /**
     * Get whether the previous request has failed
     *
     * @returns {boolean}
     * @private
     */
    protected _hasFailed() {
        return this._status === this.STATUSES.failed;
    }

    /**
     * Component is idle
     *
     * @private
     */
    protected _toggleIdleStatus() {
        this._status = this.STATUSES.idle;
    }

    /**
     * Component is in the process of an XHR request
     *
     * @private
     */
    protected _togglePendingStatus() {
        this._status = this.STATUSES.pending;
    }

    /**
     * Component failed the last XHR request
     *
     * @private
     */
    protected _toggleFailedStatus() {
        this._status = this.STATUSES.failed;
    }
}
