export type ElnkOptions = {
  message: string;
  apiKey?: string;
  apiUrl?: string;
  longUrl?: string;
  shortUrl?: string;
  senderId?: string;
  domainId?: number,
  endPoints: {
    links: string;
    domains: string;
  }
}

export type ElnkResponse = {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}
