export interface JwtPayload {
	iss?: string;
	sub?: string;
	aud?: string | string[];
	exp?: number;
	nbf?: number;
	iat?: number;
	jti?: string;
	[key: string]: unknown;
}

export function decodeJwt(token: string) {
	const [, payloadB64] = token.split('.');
	return JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as JwtPayload;
}