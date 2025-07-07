import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class OrHelper implements IHtmlEngineHelper {
    public helperFunc(context: any /* any, any, ..., options */) {
        const len = arguments.length - 1;
        const options: IHandlebarsOptions = arguments[len];

        // We start at 1 because of options
        for (let i = 1; i < len; i++) {
            if (arguments[i]) {
                return options.fn(context);
            }
        }

        return options.inverse(context);
    }
}
