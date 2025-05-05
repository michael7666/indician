export interface ShortenUrlRequest {
  longUrl: string;
}

export interface ShortenUrlResponse {
  shortUrl: string; // e.g., "abc1234"
}

export interface UrlStats {
  shortUrl: string;
  longUrl: string;
  clickCount: number;
}

export interface DecodeUrlResponse {
  longUrl: string;
}

export interface Url {
  id: string; // Maps to _id from MongoDB
  longUrl: string;
  shortUrl: string; // Full URL, e.g., "http://localhost:8800/api/url/abc1234"
  createdAt: string;
  visits: number; // Maps to clickCount from backend
}

// Backend response for GET /api/url
export interface BackendUrl {
  _id: string;
  shortUrl: string;
  longUrl: string;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}
