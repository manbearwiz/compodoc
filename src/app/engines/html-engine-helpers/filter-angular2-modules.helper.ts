import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class FilterAngular2ModulesHelper implements IHtmlEngineHelper {
    public helperFunc(context: any, text: string, options: IHandlebarsOptions) {
        const NG2_MODULES = ['BrowserModule', 'FormsModule', 'HttpModule', 'RouterModule'] as const;
        if (NG2_MODULES.some(module => text.includes(module))) {
            return options.fn(context);
        }
        return options.inverse(context);
    }
}
