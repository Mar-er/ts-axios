import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types';
import xhr from './xhr';
import { transformRequest, transformResponse } from './helpers/data';
import { buildURL } from './helpers/url';
import { processHeaders } from './helpers/header';

function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then(res => transformResponseData(res));
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  // 需要将headers处理放在data之前，data处理之后会被转为字符串
  config.headers = transformHeader(config);
  config.data = transformRequestData(config);
}

function transformRequestData (config: AxiosRequestConfig): any {
  return transformRequest(config.data);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params);
}

function transformHeader(config: AxiosRequestConfig): any {
  return processHeaders(config.headers = {}, config.data);
}

function transformResponseData(res: AxiosResponse): AxiosResponse  {
  res.data = transformResponse(res.data);
  return res;
}

export default axios;
