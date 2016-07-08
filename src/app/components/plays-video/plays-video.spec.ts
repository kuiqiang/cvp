import {describe} from "@angular/core/testing";
import {PlaysVideoComponent} from "./plays-video.component";

describe("PlaysVideoComponent", () => {
    let component, video1, video2;

    let video1Id = "video1";
    let video2Id = "video2";

    describe("playVideo", () => {
        beforeEach(() => {
            component = new PlaysVideoComponent();
            video1 = getVideo(video1Id);
            video2 = getVideo(video2Id);
            document.body.appendChild(video1);
            document.body.appendChild(video2);
        });

        it("should play the requested video", () => {
            spyOn(video1, "play");

            component.playVideo(video1Id);

            expect(video1.play).toHaveBeenCalled();
        });

        it("should stop another playing video", () => {
            component.playVideo(video1Id);
            component.playVideo(video2Id);

            expect(video1.paused).toBe(true);
        });

        afterEach(() => {
            document.body.removeChild(video1);
            document.body.removeChild(video2);
        });
    });
});

/**
 * Get video element
 *
 * @param id
 * @returns {HTMLVideoElement}
 */
function getVideo(id:string):HTMLVideoElement {
    let video:HTMLVideoElement = <HTMLVideoElement>document.createElement("VIDEO");

    video.setAttribute("id", id);

    return video;
}
