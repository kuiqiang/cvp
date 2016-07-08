export class MockAuthService {
    static ERROR:string = "error";
    isAuthenticated:boolean;
    sessionId:string;

    login(username:string, password:string) {
        return new Promise((resolve) => {
            if (username && password) {
                resolve();
            } else {
                throw new Error(MockAuthService.ERROR);
            }
        });
    }

    logout() {
        return new Promise((resolve) => {
            resolve();
        });
    }
}
