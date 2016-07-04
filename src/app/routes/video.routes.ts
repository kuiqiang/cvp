import {PATHS} from "../shared/paths";
import {VideoComponent} from "../components/video/video.component";
import {AuthGuard} from "../guards/auth.guard";

export const VIDEO_ROUTES = [
    {path: `${PATHS.video}/:id`, component: VideoComponent, canActivate: [AuthGuard]}
];
