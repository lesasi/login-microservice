import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const serverInstance = axios.create({
  baseURL: serverUrl,
  timeout: 1000,
  // withCredentials: true
  // headers: {'X-Custom-Header': 'foobar'}
});

const getProccessedUrlWithQuery = (url: string, query: Object = null) => {
  if(query) {
    const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    return `${url}?${queryString}`;
  }
  return url;
}

export const getFromServer = async <T>(url: string, query: Object = null): Promise<T> => {
  const processedUrl = getProccessedUrlWithQuery(url, query);
  const response = await serverInstance.get(processedUrl);
  const data = response.data as T;
  return data;
}

export const postToServer = async <T>(url: string, body: Object = {}, query: Object = null): Promise<T> => {
  const processedUrl = getProccessedUrlWithQuery(url, query);
  const response = await serverInstance.post(processedUrl, body);
  const data = response.data as T;
  return data;
}