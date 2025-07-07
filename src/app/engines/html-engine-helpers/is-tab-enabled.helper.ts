import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class IsTabEnabledHelper implements IHtmlEngineHelper {
    public helperFunc(
        context: string,
        tabs: any[] | null | undefined,
        tabId: string,
        options: IHandlebarsOptions
    ) {
        return tabs?.some(tab => tab.id === tabId) ? options.fn(context) : options.inverse(context);
    }
}
