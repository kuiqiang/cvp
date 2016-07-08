import {Component, NgZone} from "@angular/core";
import {Http} from "@angular/http";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Video} from "../../classes/video.class";
import {AuthService} from "../../services/auth/auth.service";
import {PATHS} from "../../shared/paths";
import {CONFIG} from "../../shared/config";
import {RatingComponent} from "../rating/rating.component";
import {SpinnerComponent} from "../spinner/spinner";
import {PlaysVideoComponent} from "../plays-video/plays-video.component";

@Component({
    selector: "cvp-videos",
    template: require("./videos.html"),
    directives: [ROUTER_DIRECTIVES, RatingComponent, SpinnerComponent],
    animations: CONFIG.ANIMATIONS.FADE_IN
})
export class VideosComponent extends PlaysVideoComponent {
    private _videos:Array<Video> = [];
    private _paths = PATHS;

    /**
     * Initialize component
     *
     * @param _http
     * @param _authService
     * @param _zone
     */
    constructor(private _http:Http, private  _authService:AuthService, private _zone:NgZone) {
        super();
    }

    /**
     * Load videos after initialization
     */
    ngOnInit() {
        this.loadVideos();
        this.lazyLoadVideos();
    }

    /**
     * Get videos
     *
     * @returns {Array<Video>}
     */
    get videos():Array<Video> {
        return this._videos;
    }

    /**
     * Set videos
     *
     * @param value
     */
    set videos(value:Array<Video>) {
        this._videos = value;
    }

    /**
     * Load videos
     *
     * @returns {Thenable<U>}
     */
    loadVideos() {
        if (this.isPending)
            return;

        this.togglePendingStatus();
        return this._http.get(`/${PATHS.videos}${this._getQueryString()}`)
            .map(response => response.json())
            .toPromise()
            .then(response => {
                if (response.status === "success") {
                    this._videos = this._videos.concat(response.data);
                    this.toggleIdleStatus();
                } else {
                    this._handleError(response.error);
                }
            })
            .catch(error => this._handleError(error));
    }

    /**
     * Lazy load videos
     *
     * @private
     */
    lazyLoadVideos() {
        window.onscroll = () => {
            this._zone.run(() => {
                if (this._reachedBottom()) {
                    this.loadVideos();
                }
            });
        };
    }

    /**
     * Handle video rating update
     *
     * @param rating
     * @param i
     */
    onRate(rating:number, i:number) {
        this._videos[i].ratings.push(rating);
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
}
