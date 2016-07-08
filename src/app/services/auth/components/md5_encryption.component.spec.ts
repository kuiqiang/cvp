import {MD5EncryptionComponent} from "./md5_encryption.component";

describe("MD5EncryptionComponent", () => {
    describe("getHash", () => {
        it("should return correct hash", () => {
            expect(MD5EncryptionComponent.getHash("password")).toEqual("5f4dcc3b5aa765d61d8327deb882cf99");
            expect(MD5EncryptionComponent.getHash("password" + String.fromCharCode(1000))).toEqual("c3b8408b74b4b0b38a581bf07adca958");
            expect(MD5EncryptionComponent.getHash("password" + String.fromCharCode(2049))).toEqual("bd0b537bd466153b0682304bce9efe0d");
        });
    });
});
