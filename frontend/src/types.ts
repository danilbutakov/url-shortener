export interface Url {
	id: number;
	originalUrl: string;
	shortUrl: string;
	alias?: string;
	clickCount: number;
	createdAt: string;
	expiresAt?: string;
	clicks?: { ipAddress: string; createdAt: string }[];
}
