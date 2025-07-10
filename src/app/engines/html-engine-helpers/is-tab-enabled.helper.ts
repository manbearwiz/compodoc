import { IHtmlEngineHelper, IHandlebarsOptions } from './html-engine-helper.interface';

export class IsTabEnabledHelper implements IHtmlEngineHelper {
    public helperFunc(context: any, tabs: Array<any> | null | undefined, tabId: String, options: IHandlebarsOptions) {
        return tabs?.some(tab => tab.id === tabId) ? options.fn(context) : options.inverse(context);
    }
}
