import {MD5EncryptionComponent} from "./md5_encryption.component";
import {describe, it} from "@angular/core/testing";


describe("MD5EncryptionComponent", () => {
    it("should return correct hash", () => {
        expect(MD5EncryptionComponent.getHash("password")).toEqual("5f4dcc3b5aa765d61d8327deb882cf99");
    });
});
