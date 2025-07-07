import * as _ from 'lodash';
import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class IsTabEnabledHelper implements IHtmlEngineHelper {
    public helperFunc(context: any, tabs: any[], tabId: string, options: IHandlebarsOptions) {
        const isTabEnabled = -1 !== _.findIndex(tabs, { id: tabId });
        return isTabEnabled ? options.fn(context) : options.inverse(context);
    }
}
