import { ImageAnnotatorClient } from "@google-cloud/vision";
import { Injectable } from "@nestjs/common";

@Injectable()
export class VisionClient {
    private client: ImageAnnotatorClient;

    constructor() {
        this.client = new ImageAnnotatorClient({
            keyFilename: './gcp.json'
        });
    }

    async visionAPI(imagePath: string) {
        try {
            const [result] = await this.client.textDetection(`./static/${imagePath}`);
            return result.textAnnotations[0].description.split('\n');
        }
        catch (e) {
            throw e;
        }
    }
}