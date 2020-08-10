import axios from 'axios';
import { ApisRequestInterceptor } from "./interceptors";
import { Params } from "../typescript/Params";

const instance = axios.create();

instance.interceptors.request.use(ApisRequestInterceptor);

const apis = {
    list: (params?: Params): Promise<any> => {
        return instance.get('/entries', {
            params
        })
    },
    categories: (): Promise<any> => {
        return instance.get('/categories')
    },
    random: (params?: Params): Promise<any> => {
        return instance.get('/random', {
            params
        })
    }
};

export default apis;
