import { IConfig } from "./types";
export default class Policy {
    static getPolicy(config: IConfig, acl?: string): string;
}
