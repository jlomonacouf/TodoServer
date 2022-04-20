import { S3 } from 'aws-sdk';
import { Logger, Injectable } from '@nestjs/common';
import { S3_BUCKET, SSKEY, SSKEYID } from 'environment';

import { v4 as uuid } from 'uuid';
import { extname } from 'path';


@Injectable()
export class FileService {

    async delete(fileName) {
        const s3 = this.getS3();
        const params = {
            Bucket: S3_BUCKET,
            Key: fileName,
        };

        return s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                return { success: false };
            }

            return { success: true };
        });
    }

    async getFile(fileName) {
        try {
            const s3 = this.getS3();
            const params = {
                Bucket: S3_BUCKET,
                Key: fileName
            };
            
            return s3.getObject(params);
        }
        catch {
            return null;
        }
    }

    async upload(file) {
        return await this.uploadS3(file.buffer, S3_BUCKET, `${uuid()}${extname(file.originalname)}`);
    }

    private async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
            if (err) {
                Logger.error(err);
                reject(err.message);
            }
            resolve(data);
            });
        });
    }

    private getS3() {
        return new S3({
            accessKeyId: SSKEYID,
            secretAccessKey: SSKEY,
            region: 'us-east-2'
        });
    }
}