import { IApiSourceResult } from './api-source-result.interface';

const AngularAPIs: Array<IAngularMainApi> = require('../src/data/api-list.json');

export class AngularApiUtil {
    private static instance: AngularApiUtil;
    private constructor() {}
    public static getInstance() {
        if (!AngularApiUtil.instance) {
            AngularApiUtil.instance = new AngularApiUtil();
        }
        return AngularApiUtil.instance;
    }

    public findApi(type: string): IApiSourceResult<IAngularMainApi> {
        const foundApi = AngularAPIs.find(mainApi =>
            mainApi.items.some(api => api.title === type)
        )?.items.find(api => api.title === type);

        return {
            source: 'external',
            data: foundApi
        };
    }
}

export default AngularApiUtil.getInstance();

export interface IAngularMainApi {
    title: string;
    name: string;
    items: IAngularApi[];
}

export interface IAngularApi {
    title: string;
    path: string;
    docType: string;
    stability: string;
    secure: string;
    barrel: string;
}
