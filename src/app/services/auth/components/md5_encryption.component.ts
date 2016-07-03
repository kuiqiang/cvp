// Adapted from https://css-tricks.com/snippets/javascript/javascript-md5/
export class MD5EncryptionComponent {
    /**
     * Get md5 hash
     * @param word
     * @returns {string}
     */
    public static getHash(word:string) {
        let x, k, AA, BB, CC, DD, a, b, c, d;
        let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        let S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        word = MD5EncryptionComponent._utf8Encode(word);

        x = MD5EncryptionComponent._convertToWordArray(word);

        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = MD5EncryptionComponent._FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = MD5EncryptionComponent._FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = MD5EncryptionComponent._FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = MD5EncryptionComponent._FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = MD5EncryptionComponent._FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = MD5EncryptionComponent._FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = MD5EncryptionComponent._FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = MD5EncryptionComponent._FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = MD5EncryptionComponent._FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = MD5EncryptionComponent._FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = MD5EncryptionComponent._FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = MD5EncryptionComponent._FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = MD5EncryptionComponent._FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = MD5EncryptionComponent._FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = MD5EncryptionComponent._FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = MD5EncryptionComponent._FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = MD5EncryptionComponent._GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = MD5EncryptionComponent._GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = MD5EncryptionComponent._GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = MD5EncryptionComponent._GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = MD5EncryptionComponent._GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = MD5EncryptionComponent._GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = MD5EncryptionComponent._GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = MD5EncryptionComponent._GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = MD5EncryptionComponent._GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = MD5EncryptionComponent._GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = MD5EncryptionComponent._GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = MD5EncryptionComponent._GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = MD5EncryptionComponent._GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = MD5EncryptionComponent._GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = MD5EncryptionComponent._GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = MD5EncryptionComponent._GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = MD5EncryptionComponent._HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = MD5EncryptionComponent._HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = MD5EncryptionComponent._HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = MD5EncryptionComponent._HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = MD5EncryptionComponent._HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = MD5EncryptionComponent._HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = MD5EncryptionComponent._HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = MD5EncryptionComponent._HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = MD5EncryptionComponent._HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = MD5EncryptionComponent._HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = MD5EncryptionComponent._HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = MD5EncryptionComponent._HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = MD5EncryptionComponent._HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = MD5EncryptionComponent._HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = MD5EncryptionComponent._HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = MD5EncryptionComponent._HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = MD5EncryptionComponent._II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = MD5EncryptionComponent._II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = MD5EncryptionComponent._II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = MD5EncryptionComponent._II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = MD5EncryptionComponent._II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = MD5EncryptionComponent._II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = MD5EncryptionComponent._II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = MD5EncryptionComponent._II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = MD5EncryptionComponent._II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = MD5EncryptionComponent._II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = MD5EncryptionComponent._II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = MD5EncryptionComponent._II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = MD5EncryptionComponent._II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = MD5EncryptionComponent._II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = MD5EncryptionComponent._II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = MD5EncryptionComponent._II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = MD5EncryptionComponent._addUnsigned(a, AA);
            b = MD5EncryptionComponent._addUnsigned(b, BB);
            c = MD5EncryptionComponent._addUnsigned(c, CC);
            d = MD5EncryptionComponent._addUnsigned(d, DD);
        }

        let temp = MD5EncryptionComponent._wordToHex(a) +
            MD5EncryptionComponent._wordToHex(b) +
            MD5EncryptionComponent._wordToHex(c) +
            MD5EncryptionComponent._wordToHex(d);

        return temp.toLowerCase();
    }

    private static _rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    private static _addUnsigned(lX, lY) {
        let lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    private static _F(x, y, z) {
        return (x & y) | ((~x) & z);
    }

    private static _G(x, y, z) {
        return (x & z) | (y & (~z));
    }

    private static _H(x, y, z) {
        return (x ^ y ^ z);
    }

    private static _I(x, y, z) {
        return (y ^ (x | (~z)));
    }

    private static _FF(a, b, c, d, x, s, ac) {
        a = MD5EncryptionComponent._addUnsigned(a,
            MD5EncryptionComponent._addUnsigned(
                MD5EncryptionComponent._addUnsigned(
                    MD5EncryptionComponent._F(b, c, d), x), ac));
        return MD5EncryptionComponent._addUnsigned(this._rotateLeft(a, s), b);
    };

    private static _GG(a, b, c, d, x, s, ac) {
        a = MD5EncryptionComponent._addUnsigned(a,
            MD5EncryptionComponent._addUnsigned(
                MD5EncryptionComponent._addUnsigned(
                    MD5EncryptionComponent._G(b, c, d), x), ac));
        return MD5EncryptionComponent._addUnsigned(this._rotateLeft(a, s), b);
    };

    private static _HH(a, b, c, d, x, s, ac) {
        a = MD5EncryptionComponent._addUnsigned(a,
            MD5EncryptionComponent._addUnsigned(
                MD5EncryptionComponent._addUnsigned(
                    MD5EncryptionComponent._H(b, c, d), x), ac));
        return MD5EncryptionComponent._addUnsigned(this._rotateLeft(a, s), b);
    };

    private static _II(a, b, c, d, x, s, ac) {
        a = MD5EncryptionComponent._addUnsigned(a,
            MD5EncryptionComponent._addUnsigned(
                MD5EncryptionComponent._addUnsigned(
                    MD5EncryptionComponent._I(b, c, d), x), ac));
        return MD5EncryptionComponent._addUnsigned(this._rotateLeft(a, s), b);
    };

    private static _convertToWordArray(word) {
        let lWordCount;
        let lMessageLength = word.length;
        let lNumberOfWordsTemp1 = lMessageLength + 8;
        let lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
        let lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
        let lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (word.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    private static _wordToHex(lValue) {
        let wordToHexValue = "", wordToHexValueTemp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValueTemp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
        }
        return wordToHexValue;
    };

    private static _utf8Encode(word) {
        word = word.replace(/\r\n/g, "\n");
        let utftext = "";

        for (let n = 0; n < word.length; n++) {

            let c = word.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };
}
