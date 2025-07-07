import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class JsdocReturnsCommentHelper implements IHtmlEngineHelper {
    public helperFunc(_context: any, jsdocTags: any[], _options: IHandlebarsOptions) {
        return (
            jsdocTags.find(tag => tag.tagName?.text === 'returns' || tag.tagName?.text === 'return')
                ?.comment || ''
        );
    }
}
