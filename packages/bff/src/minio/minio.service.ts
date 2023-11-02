// minio.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as uuid from 'uuid';
@Injectable()
export class MinioService {
  public readonly minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    const port = this.configService.get('MINIO_PORT');
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_URL'),
      port: Number(port),
      useSSL: Number(port) === 443 ? true : false,
      accessKey: this.configService.get('MINIO_ACCESSKEY'),
      secretKey: this.configService.get('MINIO_SECRET'),
    });
  }

  async uploadFile(
    bucketName: string,
    filename: string,
    file: Buffer,
    meta?: any,
  ): Promise<any> {
    const _filename = `${uuid.v4()}.${filename.split('.').pop()}`;
    const result = await this.minioClient.putObject(
      bucketName,
      _filename,
      file,
      file.length,
    );

    //const url = await this.getFileLink(bucketName, _filename);
    return { filename: _filename, msg: result, meta: meta ?? {} };
  }

  async getDownloadURL(bucketName: string, filename: string) {
    return await this.minioClient.presignedUrl('GET', bucketName, filename);
  }

  async getFileLink(bucket: string, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.minioClient.presignedGetObject(bucket, filename, (err, url) => {
        if (err) reject(err);
        resolve(url);
      });
    });
  }
}
