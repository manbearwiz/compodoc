import Configuration from '../../configuration';
import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class IsNotToggleHelper implements IHtmlEngineHelper {
    public helperFunc(context: string, type: string, options: IHandlebarsOptions) {
        if (Configuration.mainData.toggleMenuItems.includes('all')) {
            return options.inverse(context);
        } else if (Configuration.mainData.toggleMenuItems.includes(type)) {
            return options.fn(context);
        } else {
            return options.inverse(context);
        }
    }
}
