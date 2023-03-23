import axios from 'axios';

const getProccessedUrlWithQuery = (url: string, query: Object = null) => {
  if(query) {
    const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    return `${url}?${queryString}`;
  }
  return url;
}

const getAxiosInstance = (isProp: boolean = false) => {
  const serverUrl = isProp ? process.env.NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL_LOCAL;
  const serverInstance = axios.create({
    baseURL: serverUrl,
    timeout: 1000,
  });
  return serverInstance;
}

export const getFromServer = async <T>(url: string, query: Object = null, isProp: boolean = false): Promise<T> => {
  const processedUrl = getProccessedUrlWithQuery(url, query);
  const serverInstance = getAxiosInstance(isProp);
  const response = await serverInstance.get(processedUrl);
  const data = response.data as T;
  return data;
}

export const postToServer = async <T>(url: string, body: Object = {}, query: Object = null): Promise<T> => {
  const processedUrl = getProccessedUrlWithQuery(url, query);
  const serverInstance = getAxiosInstance();
  const response = await serverInstance.post(processedUrl, body);
  const data = response.data as T;
  return data;
}