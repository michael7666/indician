// src/api/urlApi.ts
import axios, { AxiosError } from 'axios';
import {
  ShortenUrlRequest,
  ShortenUrlResponse,
  UrlStats,
  DecodeUrlResponse,
  BackendUrl,
  Url,
} from '../types/url';

export const API_BASE_URL = 'http://localhost:8800/api/url';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shorten URL
export const shortenUrl = async (
  data: ShortenUrlRequest
): Promise<ShortenUrlResponse> => {
  try {
    const response = await apiClient.post<ShortenUrlResponse>('/encode', data);
    return response.data;
  } catch (error) {
    throw new Error(
        'Failed to shorten URL'
    );
  }
};

// Get URL Stats
export const getUrlStats = async (shortUrl: string): Promise<UrlStats> => {
  try {
    const response = await apiClient.get<UrlStats>(`/statistic/${shortUrl}`);
    return response.data;
  } catch (error) {
    throw new Error(
     'Failed to fetch URL stats'
    );
  }
};

// Decode URL
export const decodeUrl = async (shortUrl: string): Promise<DecodeUrlResponse> => {
  try {
    const response = await apiClient.get<DecodeUrlResponse>(
      `/decode/${shortUrl}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
     'Failed to decode URL'
    );
  }
};

// Get All URLs
export const getAllUrls = async (): Promise<Url[]> => {
  try {
    const response = await apiClient.get<BackendUrl[]>('/');
    // Map backend response to frontend Url interface
    return response.data.map((backendUrl) => ({
      id: backendUrl._id,
      longUrl: backendUrl.longUrl,
      shortUrl: `${API_BASE_URL}/${backendUrl.shortUrl}`,
      createdAt: backendUrl.createdAt,
      visits: backendUrl.clickCount,
    }));
  } catch (error) {
    throw new Error(
     'Failed to fetch URLs'
    );
  }
};