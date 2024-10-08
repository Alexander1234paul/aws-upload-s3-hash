"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buildUrl = ({ bucketName, region }) => {
    const countryCode = region.split("-")[0];
    switch (countryCode) {
        case "cn":
            return `https://${bucketName}.s3.${region}.amazonaws.com.${countryCode}`;
        default:
            return `https://${bucketName}.s3-${region}.amazonaws.com`;
    }
};
exports.default = (config) => {
    if (config.s3Url && config.s3Url !== '') {
        return config.s3Url;
    }
    return buildUrl(config);
};
