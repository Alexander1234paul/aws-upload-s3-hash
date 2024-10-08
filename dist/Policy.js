"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Date_1 = require("./Date");
class Policy {
    static getPolicy(config, acl) {
        let aclFinal = acl === undefined || acl === "" ? "public-read" : acl;
        const policy = () => {
            return {
                expiration: Date_1.dateISOString,
                conditions: [
                    { acl: aclFinal },
                    { bucket: config.bucketName },
                    ["starts-with", "$key", `${config.dirName ? config.dirName + "/" : ""}`],
                    ["starts-with", "$Content-Type", ""],
                    ["starts-with", "$x-amz-meta-tag", ""],
                    { "x-amz-algorithm": "AWS4-HMAC-SHA256" },
                    {
                        "x-amz-credential": `${config.accessKeyId}/${Date_1.dateYMD}/${config.region}/s3/aws4_request`
                    },
                    { "x-amz-date": Date_1.xAmzDate },
                    { "x-amz-meta-uuid": "14365123651274" },
                    { "x-amz-server-side-encryption": "AES256" }
                ]
            };
        };
        //Returns a base64 policy;
        let newVersionResponse = btoa(JSON.stringify(policy())).replace(/\n|\r/, "");
        return newVersionResponse;
    }
    ;
}
exports.default = Policy;
;
