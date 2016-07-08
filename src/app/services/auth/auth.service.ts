import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import "rxjs/add/operator/toPromise";
import {MD5EncryptionComponent} from "./components/md5_encryption.component";
import {PATHS} from "../../shared/paths";
import {Helper} from "../../classes/helper.class";

@Injectable()
export class AuthService {
    private _isAuthenticated:boolean;
    private _sessionId:string;
    private _username:string;

    /**
     * Initialize service
     */
    constructor(private _http:Http, private _router:Router) {
    }

    /**
     * Authenticate user with given credentials
     *
     * @param username
     * @param password
     * @returns {Thenable<U>|PromiseLike<TResult>}
     */
    login(username:string, password:string) {
        let headers = new Headers({"Content-Type": "application/json"});
        let credentials = JSON.stringify({username: username, password: MD5EncryptionComponent.getHash(password)});

        return this._http.post(`/${PATHS.authenticate}`, credentials, {headers: headers})
            .map(response => response.json())
            .toPromise().then(response => {
                if (response.status === "success") {
                    this._sessionId = response.sessionId;
                    this._username = response.username;
                    this._isAuthenticated = true;
                    Promise.resolve(response);
                } else {
                    Helper.handleError(response.error);
                    throw new Error(response.error);
                }
            });
    }

    /**
     * De-authenticate user
     *
     * @returns {Thenable<U>}
     */
    logout() {
        return this._http.get(`/${PATHS.logout}?sessionId=${this._sessionId}`)
            .map(response => response.json())
            .toPromise()
            .then(response => {
                if (response.status === "success") {
                    this._sessionId = undefined;
                    this._username = undefined;
                    this._isAuthenticated = false;
                    this._router.navigate([`/${PATHS.login}`]);
                    Promise.resolve(response);
                } else {
                    Helper.handleError(response.error);
                    throw new Error(response.error);
                }
            });
    }

    /**
     * Get if user is authenticated
     *
     * @returns {boolean}
     */
    get isAuthenticated():boolean {
        return this._isAuthenticated;
    }

    /**
     * Get session ID
     *
     * @returns {string}
     */
    get sessionId():string {
        return this._sessionId;
    }

    /**
     * Get username
     *
     * @returns {string}
     */
    get username():string {
        return this._username;
    }
}
