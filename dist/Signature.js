"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
class Signature {
    static getSignature(config, date, policyBase64) {
        const getSignatureKey = (key, dateStamp, regionName) => {
            const kDate = crypto_js_1.default.HmacSHA256(dateStamp, "AWS4" + key);
            const kRegion = crypto_js_1.default.HmacSHA256(regionName, kDate);
            const kService = crypto_js_1.default.HmacSHA256("s3", kRegion);
            const kSigning = crypto_js_1.default.HmacSHA256("aws4_request", kService);
            return kSigning;
        };
        const signature = (policyEncoded) => {
            return crypto_js_1.default.HmacSHA256(policyEncoded, getSignatureKey(config.secretAccessKey, date, config.region)).toString(crypto_js_1.default.enc.Hex);
        };
        return signature(policyBase64);
    }
}
exports.default = Signature;
