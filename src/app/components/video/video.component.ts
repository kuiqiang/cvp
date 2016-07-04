import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import {Video} from "../../classes/video.class";
import {AuthService} from "../../services/auth/auth.service";
import {RatingComponent} from "../rating/rating.component";
import {PATHS} from "../../shared/paths";
import {CONFIG} from "../../shared/config";
import {PlaysVideoTrait} from "../../classes/plays-video.trait";

@Component({
    selector: "cvp-video",
    template: require("./video.html"),
    directives: [RatingComponent]
})
export class VideoComponent extends PlaysVideoTrait {
    private _videoId:string;
    private _video:Video;
    private _suggestedVideos:Array<Video> = [];
    private _paths = PATHS;

    /**
     * Initialize component
     *
     * @param _http
     * @param _authService
     * @param _activatedRoute
     */
    constructor(private _http:Http, private  _authService:AuthService, private _activatedRoute:ActivatedRoute) {
        super();

        this._activatedRoute.url.subscribe(
            value => {
                this._videoId = value[1].path;
                this._loadVideo();
                this._loadSuggestions();

                if (this._activeVideoId) {
                    let activeVideo = <HTMLVideoElement>document.getElementById(this._activeVideoId);
                    this._stopVideo(activeVideo);
                }
            },
            VideoComponent._handleError
        );
    }

    /**
     * Handle error
     *
     * @param error
     * @private
     */
    private static _handleError(error:any) {
        console.error(error);
    }

    /**
     * Load main video
     *
     * @private
     */
    private _loadVideo() {
        this._http.get(`/${PATHS.video}?sessionId=${this._authService.sessionId}&videoId=${this._videoId}`).subscribe(
            response => {
                let data = response.json();

                if (data.status === "success") {
                    this._video = data.data;
                } else {
                    VideoComponent._handleError("Could not load video.");
                }
            },
            VideoComponent._handleError
        );
    }

    /**
     * Load suggestions
     *
     * @private
     */
    private _loadSuggestions() {
        this._http.get(`/${PATHS.videos}${this._getVideosQueryString()}`).subscribe(
            response => {
                let data = response.json();

                if (data.status === "success") {
                    this._suggestedVideos = data.data;
                } else {
                    VideoComponent._handleError("Could not load videos.");
                }
            },
            VideoComponent._handleError
        );
    }

    /**
     * Compose videos query string
     *
     * @returns {string}
     * @private
     */
    private _getVideosQueryString() {
        return `?sessionId=${this._authService.sessionId}&skip=${
            Math.floor(Math.random() * (CONFIG.SETTINGS.LAZY_LOAD_BATCH_SIZE + 1))}&limit=${2}`;
    }

    /**
     * Handle video rating update
     *
     * @param rating
     * @private
     */
    private _onRate(rating:number) {
        this._video.ratings.push(rating);
    }
}
