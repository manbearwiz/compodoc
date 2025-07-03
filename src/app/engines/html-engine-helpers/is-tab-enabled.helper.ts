import { IHtmlEngineHelper, IHandlebarsOptions } from './html-engine-helper.interface';

export class IsTabEnabledHelper implements IHtmlEngineHelper {
    public helperFunc(context: any, tabs: Array<any>, tabId: String, options: IHandlebarsOptions) {
        const isTabEnabled = tabs.some(tab => tab.id === tabId);
        return isTabEnabled ? options.fn(context) : options.inverse(context);
    }
}
