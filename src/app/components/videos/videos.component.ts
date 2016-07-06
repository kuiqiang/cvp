import {Component, NgZone} from "@angular/core";
import {Http} from "@angular/http";
import {Video} from "../../classes/video.class";
import {AuthService} from "../../services/auth/auth.service";
import {PATHS} from "../../shared/paths";
import {CONFIG} from "../../shared/config";
import {RatingComponent} from "../rating/rating.component";
import {SpinnerComponent} from "../spinner/spinner";
import {PlaysVideoTrait} from "../../classes/plays-video.trait";
import {Helper} from "../../classes/helper.class";

@Component({
    selector: "cvp-videos",
    template: require("./videos.html"),
    directives: [RatingComponent, SpinnerComponent]
})
export class VideosComponent extends PlaysVideoTrait {
    private _videos:Array<Video> = [];
    private _loading:boolean;
    private _paths = PATHS;

    /**
     * Initialize component
     *
     * @param _http
     * @param _authService
     */
    constructor(private _http:Http, private  _authService:AuthService, private _zone:NgZone) {
        super();

        this._loadVideos();
        this._lazyLoadVideos();
    }

    /**
     * Load videos
     *
     * @private
     */
    private _loadVideos() {
        if (!this._loading) {
            this._loading = true;

            this._http.get(`/${PATHS.videos}${this._getQueryString()}`).subscribe(
                response => {
                    let data = response.json();

                    if (data.status === "success") {
                        this._videos = this._videos.concat(data.data);
                    } else {
                        Helper.handleError("Could not load videos.");
                    }
                },
                Helper.handleError,
                () => {
                    this._loading = false;
                }
            );
        }
    }

    /**
     * Lazy load videos
     *
     * @private
     */
    private _lazyLoadVideos() {
        window.onscroll = () => {
            if (this._reachedBottom()) {
                this._zone.run(() => {
                    this._loadVideos();
                });
            }
        };
    }

    /**
     * Check if bottom of document is reached
     *
     * @returns {boolean}
     * @private
     */
    private _reachedBottom() {
        return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    }

    /**
     * Compose query string
     *
     * @returns {string}
     * @private
     */
    private _getQueryString() {
        return `?sessionId=${this._authService.sessionId}&skip=${this._videos.length}&limit=${CONFIG.SETTINGS.LAZY_LOAD_BATCH_SIZE}`;
    }

    /**
     * Handle video rating update
     *
     * @param rating
     * @param i
     * @private
     */
    private _onRate(rating:number, i:number) {
        this._videos[i].ratings.push(rating);
    }
}
