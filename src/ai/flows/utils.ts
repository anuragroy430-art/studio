
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Jimp from 'jimp';
import wav from 'wav';
import { Readable } from 'stream';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

export async function textToSpeech(text: string): Promise<string> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}/stream`, {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
        body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
            },
        }),
    });

    if (!response.body) {
        throw new Error('Response body is null');
    }

    const audioBuffer = await streamToBuffer(response.body as any);
    const uniqueFileName = `audio-${Date.now()}.mp3`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: audioBuffer,
        ContentType: 'audio/mpeg',
    });

    await s3Client.send(command);
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function generateCertificate(name: string, pledge: string, date: string): Promise<string> {
    const template = await Jimp.read('./public/certificate-template.png');
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    const fontPledge = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    template.print(font, 0, 350, {
        text: name,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, template.getWidth(), template.getHeight());

    template.print(fontPledge, 0, 500, {
        text: pledge,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, template.getWidth(), template.getHeight());

    template.print(fontPledge, -350, 750, {
        text: date,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    }, template.getWidth(), template.getHeight());

    const buffer = await template.getBufferAsync(Jimp.MIME_PNG);
    const uniqueFileName = `certificate-${name.replace(/\s+/g, '-')}-${Date.now()}.png`;

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: uniqueFileName,
        Body: buffer,
        ContentType: 'image/png',
    });

    await s3Client.send(command);
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
