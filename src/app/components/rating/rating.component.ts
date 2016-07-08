import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {SpinnerComponent} from "../spinner/spinner";
import {AuthService} from "../../services/auth/auth.service";
import {EditableComponent} from "../editable/editable.component";
import {PATHS} from "../../shared/paths";
import "rxjs/add/operator/do";

@Component({
    selector: "rating",
    template: require("./rating.html"),
    directives: [SpinnerComponent]
})
export class RatingComponent extends EditableComponent {
    @Input("videoId") private _videoId:string;
    @Input("ratings") private _ratings:Array<number>;
    @Output("rate") private _update:EventEmitter<number> = new EventEmitter<number>();
    private _RATINGS = [1, 2, 3, 4, 5];
    private _tmpRating:number;
    private _rating:number;
    private _rated:boolean;

    /**
     * Initialize component
     */
    constructor(private _http:Http, private _authService:AuthService) {
        super();
    }

    /**
     * Respond when the user submits changes
     *
     * @returns {Thenable<U>}
     */
    submit() {
        if (this.isPending || !this._rating)
            return;

        let headers = new Headers({"Content-Type": "application/json"});
        let payload = JSON.stringify({videoId: this._videoId, rating: this._rating});

        this.togglePendingStatus();
        return this._http.post(`/${PATHS.rate}?sessionId=${this._authService.sessionId}`, payload, {headers: headers})
            .map(response => response.json())
            .toPromise()
            .then(
                response => {
                    if (response.status === "success") {
                        this._handleSuccess();
                    } else {
                        this._handleError(response.message);
                    }
                }
            )
            .catch(error => this._handleError(error));
    }

    /**
     * Calculate average rating given a ratings array
     *
     * @returns {number}
     */
    getAverageRating() {
        let sum = 0, MAXIMUM_RATING = this._RATINGS[this._RATINGS.length - 1], average:number;

        for (let i = 0; i < this._ratings.length; i++) {
            sum += this._ratings[i];
        }

        average = sum / this._ratings.length;

        return average > MAXIMUM_RATING ? MAXIMUM_RATING : average;
    }

    /**
     * Fix the video rating
     *
     * @param rating
     */
    rate(rating:number) {
        if (this.isPending)
            return;

        this._rated = true;
        this._rating = rating;
    }

    /**
     * Set the  temporary rating
     *
     * @param rating
     */
    setTmpRating(rating:number) {
        if (this.isPending)
            return;

        this._tmpRating = rating;
    }

    /**
     * Get the rating
     *
     * @returns {number}
     */
    get rating():number {
        return this._rating;
    }

    /**
     * Get the temporary rating
     *
     * @returns {number}
     */
    get tmpRating():number {
        return this._tmpRating;
    }

    /**
     * Set the default value of the component
     *
     * @private
     */
    protected _setDefaultValue() {
        this._rated = false;
        this._rating = 0;
        this._resetTmpRating();
    }

    /**
     * Clear user rating
     *
     * @private
     */
    private _resetTmpRating() {
        if (this.isPending)
            return;

        this._tmpRating = this._rated ? this._rating : 0;
    }

    /**
     * Handle success
     *
     * @private
     */
    private _handleSuccess() {
        this.toggleIdleStatus();
        this.exitEditMode();
        this._update.emit(this._rating);
    }
}
