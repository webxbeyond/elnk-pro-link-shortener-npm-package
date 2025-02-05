export type ElnkOptions = {
  apiKey: string;
  longUrl?: string;
  shortUrl?: string;
  senderId?: string;
  domainId?: number,
    projectId?: number;

}
export type Variables ={
    apiBaseUrl: string;
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
