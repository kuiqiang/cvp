import {Observable} from "rxjs/Observable";

export class MockRouter {
    navigate(path:string) {
    }

    createUrlTree() {
    }
}
export class MockActivatedRoute {
    videoId = "video_id";
    url = new Observable(observer => {
        observer.next([{}, {path: this.videoId}]);
    });
}
