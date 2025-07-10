import { IHtmlEngineHelper } from './html-engine-helper.interface';
import Configuration from '../../configuration';

export class IsNotToggleHelper implements IHtmlEngineHelper {
    constructor() {}

    public helperFunc(context: any, type: string, options: any) {
        if (Configuration.mainData.toggleMenuItems.includes('all')) {
            return options.inverse(context);
        } else if (Configuration.mainData.toggleMenuItems.includes(type)) {
            return options.fn(context);
        } else {
            return options.inverse(context);
        }
    }
}
