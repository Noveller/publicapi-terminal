import {AxiosRequestConfig} from "axios";

const ApisRequestInterceptor = (config: AxiosRequestConfig) => {
    return {
        ...config,
        url: `https://api.publicapis.org${config.url}`
    }
};

export {
    ApisRequestInterceptor
}
