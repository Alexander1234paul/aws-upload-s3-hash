"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Date_1 = require("./Date");
const ErrorThrower_1 = require("./ErrorThrower");
const Url_1 = __importDefault(require("./Url"));
const Policy_1 = __importDefault(require("./Policy"));
const Signature_1 = __importDefault(require("./Signature"));
class AWSS3UploadAshClient {
    constructor(config) {
        this.config = {};
        if (config && config !== undefined) {
            this.config = config;
        }
    }
    async uploadFile(file, contentType, presignedURL, newFileName, acl) {
        if (!file) {
            throw new Error(`File cannot be empty`);
        }
        if (!presignedURL) {
            ErrorThrower_1.throwError(this.config, file);
        }
        if (presignedURL) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const payload = {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                };
                await fetch(presignedURL, payload);
                return Promise.resolve({
                    status: 200,
                    body: "Upload complete"
                });
            }
            catch (err) {
                return Promise.resolve({
                    status: 400,
                    body: "Upload failed"
                });
            }
        }
        else {
            const fd = new FormData();
            const fileName = `${newFileName}`;
            const key = `${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`;
            const url = Url_1.default(this.config);
            const aclFinal = acl === undefined || acl === "" ? "public-read" : acl;
            fd.append("key", key);
            fd.append("acl", aclFinal);
            fd.append("Content-Type", contentType);
            fd.append("x-amz-meta-uuid", "14365123651274");
            fd.append("x-amz-server-side-encryption", "AES256");
            fd.append("X-Amz-Date", Date_1.xAmzDate);
            fd.append("X-Amz-Credential", `${this.config.accessKeyId}/${Date_1.dateYMD}/${this.config.region}/s3/aws4_request`);
            fd.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
            fd.append("x-amz-meta-tag", "");
            fd.append("Policy", Policy_1.default.getPolicy(this.config, aclFinal));
            fd.append("X-Amz-Signature", Signature_1.default.getSignature(this.config, Date_1.dateYMD, Policy_1.default.getPolicy(this.config, aclFinal)));
            fd.append("file", file);
            const data = await fetch(url, { method: "post", body: fd });
            if (!data.ok)
                return Promise.reject(data);
            return Promise.resolve({
                bucket: this.config.bucketName,
                key: `${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`,
                location: `${url}${this.config.dirName ? `${this.config.dirName}/` : ""}${fileName}`,
                status: data.status
            });
        }
    }
    async deleteFile(fileName) {
        const url = `https://${this.config.bucketName}.s3${this.config.region ? "-" + this.config.region : ""}.amazonaws.com/${this.config.dirName ? this.config.dirName + "/" : ""}${fileName}`;
        const deleteResult = await fetch(url, { method: "delete" });
        if (!deleteResult.ok)
            return Promise.reject(deleteResult);
        return Promise.resolve({
            ok: deleteResult.ok,
            status: deleteResult.status,
            message: "File Deleted",
            fileName: this.config.dirName ? `${this.config.dirName}/${fileName}` : fileName
        });
    }
}
exports.default = AWSS3UploadAshClient;
