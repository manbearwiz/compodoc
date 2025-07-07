import type { JsdocTagInterface } from '../../interfaces/jsdoc-tag.interface';
import type { IHandlebarsOptions, IHtmlEngineHelper } from './html-engine-helper.interface';

export class JsdocCodeExampleHelper implements IHtmlEngineHelper {
    private cleanTag(comment: string): string {
        if (comment.startsWith('*')) {
            comment = comment.substring(1, comment.length);
        }
        if (comment.startsWith(' ')) {
            comment = comment.substring(1, comment.length);
        }
        if (comment.startsWith('<p>')) {
            comment = comment.substring(3, comment.length);
        }
        if (comment.substr(-1) === '\n') {
            comment = comment.substring(0, comment.length - 1);
        }
        if (comment.substr(-4) === '</p>') {
            comment = comment.substring(0, comment.length - 4);
        }
        return comment;
    }

    private getHtmlEntities(str): string {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    public helperFunc(context: any, jsdocTags: JsdocTagInterface[], options: IHandlebarsOptions) {
        let i = 0;
        const len = jsdocTags.length;
        const tags = [];
        let type = 'html';

        if (options.hash.type) {
            type = options.hash.type;
        }

        for (i; i < len; i++) {
            if (jsdocTags[i].tagName) {
                if (jsdocTags[i].tagName.text === 'example') {
                    const tag = {} as JsdocTagInterface;
                    if (jsdocTags[i].comment) {
                        if (jsdocTags[i].comment.includes('<caption>')) {
                            tag.comment = jsdocTags[i].comment
                                .replace(/<caption>/g, '<b><i>')
                                .replace(/\/caption>/g, '/b></i>');
                        } else {
                            tag.comment = `<pre class="line-numbers"><code class="language-${type}">${this.getHtmlEntities(this.cleanTag(jsdocTags[i].comment))}</code></pre>`;
                        }
                        tags.push(tag);
                    }
                }
            }
        }

        if (tags.length > 0) {
            context.tags = tags;
            return options.fn(context);
        }
    }
}
