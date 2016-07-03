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
     *  Handle error
     *
     * @param error
     * @private
     */
    private static _handleError(error:any) {
        console.error(error);
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
            this._http.post(AuthService._URL.login, credentials, {headers: headers}).subscribe(
                response => {
                    let token:AuthToken = response.json();
                    if (token.status === "success") {
                        this._sessionId = token.sessionId;
                        this._username = token.username;
                        this._isAuthenticated = true;
                        resolve();
                    }
                    reject(token.error);
                },
                error => {
                    AuthService._handleError(error);
                    reject(error);
                }
            );
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
}
