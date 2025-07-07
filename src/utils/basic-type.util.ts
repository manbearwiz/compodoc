enum BasicTypes {
    number = 0,
    boolean = 1,
    string = 2,
    object = 3,
    date = 4,
    function = 5
}

enum BasicTypeScriptTypes {
    any = 0,
    void = 1
}

export class BasicTypeUtil {
    private static instance: BasicTypeUtil;
    private constructor() {}
    public static getInstance() {
        if (!BasicTypeUtil.instance) {
            BasicTypeUtil.instance = new BasicTypeUtil();
        }
        return BasicTypeUtil.instance;
    }

    /**
     * Checks if a given types is a basic javascript type
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
     * @param type The type to check
     */
    public isJavascriptType(type: string): boolean {
        if (typeof type !== 'undefined' && type.toLowerCase) {
            return type.toLowerCase() in BasicTypes;
        }
        return false;
    }

    /**
     * Checks if a given type is a typescript type (That is not a javascript type)
     * https://www.typescriptlang.org/docs/handbook/basic-types.html
     * @param type The type to check
     */
    public isTypeScriptType(type: string): boolean {
        if (typeof type !== 'undefined' && type.toLowerCase) {
            return type.toLowerCase() in BasicTypeScriptTypes;
        }
        return false;
    }

    /**
     * Check if the type is a typescript or javascript type
     * @param type The type to check
     */
    public isKnownType(type: string): boolean {
        return this.isJavascriptType(type) || this.isTypeScriptType(type);
    }

    /**
     * Returns a official documentation link to either the javascript or typescript type
     * @param type The type to check
     * @returns The documentation link or undefined if type not found
     */
    public getTypeUrl(type: string): string | undefined {
        if (this.isJavascriptType(type)) {
            return `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${type}`;
        }

        if (this.isTypeScriptType(type)) {
            return 'https://www.typescriptlang.org/docs/handbook/basic-types.html';
        }

        return undefined;
    }
}

export default BasicTypeUtil.getInstance();
