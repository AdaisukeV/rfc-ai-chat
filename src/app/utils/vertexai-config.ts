/**
 * Google Cloud サービスアカウント認証の設定
 */
export function getVertexAIAuth() {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const projectId = process.env.GCLOUD_PROJECT;
  
  if (!projectId) {
    throw new Error('GCLOUD_PROJECT environment variable is required');
  }

  // GOOGLE_APPLICATION_CREDENTIALS が JSON 文字列の場合、パース
  if (credentials) {
    try {
      const credentialsObject = JSON.parse(credentials);
      return {
        credentials: credentialsObject,
        projectId: projectId,
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
      };
    } catch {
      // JSON のパースに失敗した場合、ファイルパスとして扱う
      console.warn('Failed to parse GOOGLE_APPLICATION_CREDENTIALS as JSON, treating as file path');
      return {
        projectId: projectId,
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
      };
    }
  }

  // 環境変数から認証情報を構築
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID || projectId,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
  };

  // 必須フィールドをチェック
  if (!serviceAccount.private_key || !serviceAccount.client_email) {
    throw new Error(
      'Google Cloud credentials are required. Please set either:\n' +
      '1. GOOGLE_APPLICATION_CREDENTIALS (JSON string), or\n' +
      '2. Individual environment variables (GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL, etc.)'
    );
  }

  return {
    credentials: serviceAccount,
    projectId: projectId,
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
  };
}