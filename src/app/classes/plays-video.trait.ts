export class PlaysVideoTrait {
    protected _activeVideoId:string;

    /**
     * Play video
     *
     * @param videoId
     * @private
     */
    protected _playVideo(videoId:string) {
        let targetVideo = <HTMLVideoElement>document.getElementById(videoId);

        this._stopActiveVideo();

        targetVideo.play();
        this._activeVideoId = videoId;
    }

    /**
     * Stop video
     *
     * @param video
     */
    protected _stopVideo(video:HTMLVideoElement) {
        video.pause();
        video.currentTime = 0;
    }

    /**
     * Stop the active video
     *
     * @private
     */
    protected _stopActiveVideo() {
        let activeVideo = <HTMLVideoElement>document.getElementById(this._activeVideoId);

        if (activeVideo) {
            this._stopVideo(activeVideo);
        }
    }
}