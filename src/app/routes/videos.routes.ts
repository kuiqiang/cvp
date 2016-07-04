import {VideosComponent} from "../components/videos/videos.component";
import {PATHS} from "../shared/paths";
import {AuthGuard} from "../guards/auth.guard";

export const VIDEOS_ROUTES = [
    {path: PATHS.index, component: VideosComponent, canActivate: [AuthGuard]}
];
