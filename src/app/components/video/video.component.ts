import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {Video} from "../../classes/video.class";
import {AuthService} from "../../services/auth/auth.service";
import {RatingComponent} from "../rating/rating.component";
import {PATHS} from "../../shared/paths";
import {CONFIG} from "../../shared/config";
import {PlaysVideoComponent} from "../plays-video/plays-video.component";

@Component({
    selector: "cvp-video",
    template: require("./video.html"),
    directives: [ROUTER_DIRECTIVES, RatingComponent],
    animations: CONFIG.ANIMATIONS.FADE_IN
})
export class VideoComponent extends PlaysVideoComponent {
    private _videoId:string;
    private _video:Video;
    private _suggestedVideos:Array<Video> = [];
    private _paths = PATHS;

    /**
     * Initialize component
     *
     * @param _http
     * @param _authService
     */
    constructor(private _http:Http, private  _authService:AuthService, private _activatedRoute:ActivatedRoute) {
        super();
    }

    /**
     * Subscribe to route changes
     */
    ngOnInit() {
        this.subscribeToRouteChanges();
    }

    /**
     * Get the video
     *
     * @returns {Video}
     */
    get video():Video {
        return this._video;
    }

    /**
     * Get suggested videos
     *
     * @returns {Array<Video>}
     */
    get suggestedVideos():Array<Video> {
        return this._suggestedVideos;
    }

    /**
     * Get video ID
     *
     * @returns {string}
     */
    get videoId():string {
        console.log("get");

        return this._videoId;
    }

    /**
     * Load main video
     *
     * @returns {Thenable<U>}
     */
    loadVideo() {
        if (this.isPending)
            return;

        this.togglePendingStatus();
        return this._http.get(`/${PATHS.video}?sessionId=${this._authService.sessionId}&videoId=${this._videoId}`)
            .map(response => response.json())
            .toPromise()
            .then(response => {
                if (response.status === "success") {
                    this._video = response.data;
                    this.toggleIdleStatus();
                } else {
                    this._handleError(response.error);
                }
            })
            .catch(error => this._handleError(error));
    }

    /**
     * Load suggestions
     *
     * @returns {Thenable<U>}
     */
    loadSuggestions(skip:number = Math.floor(Math.random() * (CONFIG.SETTINGS.LAZY_LOAD_BATCH_SIZE + 1))) {
        if (this.isPending)
            return;

        this.togglePendingStatus();
        return this._http.get(`/${PATHS.videos}${this._getVideosQueryString(skip)}`)
            .map(response => response.json())
            .toPromise()
            .then(response => {
                if (response.status === "success") {
                    this._suggestedVideos = response.data;
                    this.toggleIdleStatus();
                } else {
                    this._handleError(response.error);
                }
            })
            .catch(error => this._handleError(error));
    }

    /**
     * Handle video rating update
     *
     * @param rating
     * @param i
     */
    onRate(rating:number, i?:number) {
        if (i === undefined) {
            this._video.ratings.push(rating);
        } else {
            this._suggestedVideos[i].ratings.push(rating);
        }
    }

    /**
     * Subscribe to route changes
     */
    subscribeToRouteChanges() {
        // Path: video/:id
        this._activatedRoute.url
            .subscribe(
                value => {
                    this._videoId = value[1].path;

                    // Cannot convert to promise to test: must use subscribe to pick up route changes
                    this.loadVideo().then(() => {
                        this.loadSuggestions();
                    });
                }
            );
    }

    /**
     * Compose videos query string
     *
     * @param skip
     * @returns {string}
     * @private
     */
    private _getVideosQueryString(skip:number) {
        return `?sessionId=${this._authService.sessionId}&skip=${skip}&limit=${2}`;
    }
}
