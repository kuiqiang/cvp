import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {MD5EncryptionComponent} from "./components/md5_encryption.component";
import {AuthToken} from "../../classes/auth_token.class";

@Injectable()
export class AuthService {
    private static _URL = {
        login: "/user/auth"
    };
    private _isAuthenticated:boolean;
    private _sessionId:string;
    private _username:string;

    /**
     * Initialize service
     */
    constructor(private _http:Http) {
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

        // noinspection TypeScriptUnresolvedFunction
        return this._http.post(AuthService._URL.login, credentials, {headers: headers})
            .toPromise()
            .then(response => {
                let token:AuthToken = response.json();
                if (token.status === "success") {
                    this._sessionId = token.sessionId;
                    this._username = token.username;
                }
                // noinspection TypeScriptUnresolvedVariable
                Promise.resolve(token.status === "success");
            })
            .catch(this._handleError);
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
     * Handle asynchronous errors
     *
     * @param error
     * @returns {Promise}
     * @private
     */
    private _handleError(error:any) {
        console.error("An error occurred", error);
        // noinspection TypeScriptUnresolvedVariable
        return Promise.reject(error.message || error);
    }
}
