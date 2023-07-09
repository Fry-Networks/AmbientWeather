import * as fs from 'fs';
import * as path from 'path';
import SftpClient from 'ssh2-sftp-client';
import 'dotenv/config'

export default class Sftp {
    private sftp: SftpClient;
    private host: string;
    private port: number;
    private user: string;
    private pass: string;

    constructor() {
        this.host = process.env.FTP_HOST!;
        this.port = parseInt(process.env.FTP_PORT!);
        this.user = process.env.FTP_USER!;
        this.pass = process.env.FTP_PASS!;
        this.sftp = new SftpClient();
    }

    public async connect() {
        console.log(`Connecting to ${this.host}:${this.port}`);
        await this.sftp.connect({
            host: this.host,
            port: this.port,
            username: this.user,
            password: this.pass
        });
        console.log(`Connected to ${this.host}:${this.port}`);
    }

    public async uploadFile(localPath: string, remotePath: string): Promise<void> {
        try {
            await this.sftp.put(fs.createReadStream(localPath), remotePath);
            console.log(`Uploaded ${localPath} to ${remotePath}`);
        } catch (err) {
            console.error(`Error uploading ${localPath} to ${remotePath}`);
            console.error(err);
        }
    }

    public async disconnect(): Promise<void> {
        console.log(`Disconnecting from ${this.host}:${this.port}`);
        await this.sftp.end();
        console.log(`Disconnected from ${this.host}:${this.port}`);
    }
}
