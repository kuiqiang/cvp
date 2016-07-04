import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Router} from "@angular/router";
import "rxjs/add/operator/toPromise";
import {MD5EncryptionComponent} from "./components/md5_encryption.component";
import {AuthToken} from "../../classes/auth_token.class";
import {PATHS} from "../../shared/paths";

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
     *  Handle error
     *
     * @param error
     * @private
     */
    private static _handleError(error:any) {
        console.error(error);
        Promise.reject(error);
    }

    /**
     * Authenticate user with given credentials
     *
     * @param username
     * @param password
     * @returns {any}
     */
    login(username:string, password:string) {
        let headers = new Headers({"Content-Type": "application/json"});
        let credentials = JSON.stringify({username: username, password: MD5EncryptionComponent.getHash(password)});

        return new Promise((resolve, reject) => {
            this._http.post(`/${PATHS.authenticate}`, credentials, {headers: headers}).subscribe(
                response => {
                    let token:AuthToken = response.json();
                    if (token.status === "success") {
                        this._sessionId = token.sessionId;
                        this._username = token.username;
                        this._isAuthenticated = true;
                        resolve();
                    } else {
                        reject(token.error);
                    }
                },
                AuthService._handleError
            );
        });
    }

    /**
     * Deauthenticate user
     */
    logout() {
        this._http.get(`/${PATHS.logout}?sessionId=${this._sessionId}`).subscribe(
            response => {
                if (response.json().status === "success") {
                    this._sessionId = undefined;
                    this._username = undefined;
                    this._isAuthenticated = false;
                    this._router.navigate([`/${PATHS.login}`]);
                } else {
                    AuthService._handleError(response.json().message);
                }
            },
            AuthService._handleError
        );
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
