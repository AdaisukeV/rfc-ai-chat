/**
 * Google Cloud サービスアカウント認証の設定
 */
import fs from "node:fs";

export function getVertexAIAuth() {
    const base64 = process.env.GCP_CREDENTIALS_JSON_BASE64;
    if (!base64) {
        throw new Error('Missing env: GCP_CREDENTIALS_JSON_BASE64');
    }
    const json = Buffer.from(base64, "base64").toString("utf-8");
    const credPath = "/tmp/creds.json";
    fs.writeFileSync(credPath, json, { encoding: "utf-8" });

    // サービスアカウント ADC (Application Default Credentials) の最優先ソース: 環境変数 GOOGLE_APPLICATION_CREDENTIALS に JSON ファイルのパス
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;

    return {
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    };
}