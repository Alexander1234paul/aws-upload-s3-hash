import { IConfig, DeleteResponse, UploadResponse } from "./types";
declare class AWSS3UploadAshClient {
    private config;
    constructor(config?: IConfig);
    uploadFile(file: File, contentType: string, presignedURL?: string, newFileName?: string, acl?: string): Promise<UploadResponse>;
    deleteFile(fileName: string): Promise<DeleteResponse>;
}
export default AWSS3UploadAshClient;
