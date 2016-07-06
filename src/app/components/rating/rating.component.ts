import {Component, Input, Output, EventEmitter} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {EditableComponent} from "../../classes/editable-component.class";
import {PATHS} from "../../shared/paths";
import {SpinnerComponent} from "../spinner/spinner";
import {AuthService} from "../../services/auth/auth.service";

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
     * @private
     */
    protected _onSubmit() {
        if (this._isPending() || !this._rating)
            return;

        let headers = new Headers({"Content-Type": "application/json"});
        let payload = JSON.stringify({videoId: this._videoId, rating: this._rating});

        this._togglePendingStatus();
        this._http.post(`/${PATHS.rate}?sessionId=${this._authService.sessionId}`, payload, {headers: headers}).subscribe(
            response => {
                if (response.json().status === "success") {
                    this._handleSuccess();
                } else {
                    this._handleError(response.json().message);
                }
            },
            error => {
                this._handleError(error);
            }
        );
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
     * Calculate average rating given a ratings array
     *
     * @returns {number}
     */
    private _getAverageRating() {
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
     * @private
     */
    private _rate(rating:number) {
        if (this._isPending())
            return;

        this._rated = true;
        this._rating = rating;
    }

    /**
     * Set temporary rating
     *
     * @param rating
     * @private
     */
    private _setTmpRating(rating:number) {
        if (this._isPending())
            return;

        this._tmpRating = rating;
    }

    /**
     * Clear user rating
     *
     * @private
     */
    private _resetTmpRating() {
        if (this._isPending())
            return;

        this._tmpRating = this._rated ? this._rating : 0;
    }

    /**
     * Handle success
     *
     * @private
     */
    private _handleSuccess() {
        this._toggleIdleStatus();
        this._exitEditMode();
        this._update.emit(this._rating);
    }
}
