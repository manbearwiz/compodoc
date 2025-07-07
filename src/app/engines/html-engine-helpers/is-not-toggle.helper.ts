import Configuration from '../../configuration';
import type { IHtmlEngineHelper } from './html-engine-helper.interface';

export class IsNotToggleHelper implements IHtmlEngineHelper {
    public helperFunc(context: any, type, options) {
        const result = Configuration.mainData.toggleMenuItems.indexOf(type);

        if (Configuration.mainData.toggleMenuItems.includes('all')) {
            return options.inverse(context);
        }
        if (result !== -1) {
            return options.fn(context);
        }
        return options.inverse(context);
    }
}
