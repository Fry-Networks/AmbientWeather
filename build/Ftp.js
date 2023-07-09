var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
import SftpClient from 'ssh2-sftp-client';
import 'dotenv/config';
export default class Sftp {
    constructor() {
        this.host = process.env.FTP_HOST;
        this.port = parseInt(process.env.FTP_PORT);
        this.user = process.env.FTP_USER;
        this.pass = process.env.FTP_PASS;
        this.sftp = new SftpClient();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Connecting to ${this.host}:${this.port}`);
            yield this.sftp.connect({
                host: this.host,
                port: this.port,
                username: this.user,
                password: this.pass
            });
            console.log(`Connected to ${this.host}:${this.port}`);
        });
    }
    uploadFile(localPath, remotePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sftp.put(fs.createReadStream(localPath), remotePath);
                console.log(`Uploaded ${localPath} to ${remotePath}`);
            }
            catch (err) {
                console.error(`Error uploading ${localPath} to ${remotePath}`);
                console.error(err);
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sftp.end();
        });
    }
}
