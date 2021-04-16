export const secretKey = process.env.SECRET_KEY ?? "secret_test";
export const sendGridApiKey = process.env.SENDGRID_API_KEY!;
export const supportEmail = process.env.SUPPORT_EMAIL!;
export const linkExpirationTime = 15;

export const jwtExpirationTime = process.env.JWT_EXPIRATION_TIME ?? "1d";
export const env = process.env.NODE_ENV!;

export const urlActivateAccount = process.env.URL_ACTIVATE_ACCOUNT!;
export const urlRecoverPassword = process.env.URL_RECOVER_PASSWORD!;
