import {XHRComponent} from "../xhr/xhr.component";

export class PlaysVideoComponent extends XHRComponent {
    protected _activeVideoId:string;

    /**
     * Play video
     *
     * @param videoId
     */
    playVideo(videoId:string) {
        let targetVideo = <HTMLVideoElement>document.getElementById(videoId);

        this._stopActiveVideo();

        targetVideo.play();
        this._activeVideoId = videoId;
    }

    /**
     * Stop the active video
     *
     * @private
     */
    private _stopActiveVideo() {
        let activeVideo = <HTMLVideoElement>document.getElementById(this._activeVideoId);

        if (activeVideo) {
            this._stopVideo(activeVideo);
        }
    }

    /**
     * Stop video
     *
     * @param video
     * @private
     */
    private _stopVideo(video:HTMLVideoElement) {
        video.pause();
        video.currentTime = 0;
    }
}
