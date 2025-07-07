export interface IDep {
    id?: string;
    type?: string;
    ctype?: string;
    name: string;
}

export interface IInjectableDep extends IDep {
    file: any;
    properties: any[];
    methods: any[];
    deprecated: boolean;
    deprecationMessage: string;
    description: string;
    rawdescription: string;
    sourceCode: string;
    exampleUrls?;
    extends?;

    accessors?: object;
    constructorObj?: object;
    jsdoctags?: string[];
}

export interface IInterceptorDep extends IDep {
    file: any;
    properties: any[];
    methods: any[];
    deprecated: boolean;
    deprecationMessage: string;
    description: string;
    sourceCode: string;

    accessors?: object;
    constructorObj?: object;
    jsdoctags?: string[];
}

export interface IGuardDep extends IDep {
    file: any;
    properties: any[];
    methods: any[];
    deprecated: boolean;
    deprecationMessage: string;
    description: string;
    sourceCode: string;

    accessors?: object;
    constructorObj?: object;
    jsdoctags?: string[];
}

export interface IPipeDep extends IDep {
    file: any;
    deprecated: boolean;
    deprecationMessage: string;
    description: string;
    rawdescription: string;
    sourceCode: string;
    exampleUrls?;

    standalone: boolean;

    methods: any[];
    properties: any[];
    pure: string;
    ngname: string;

    jsdoctags?: string[];
}

export interface IInterfaceDep extends IDep {
    file: any;
    sourceCode: string;

    properties?: any[];
    indexSignatures?: any;
    kind?: any;
    deprecated: boolean;
    deprecationMessage: string;
    description?: string;
    rawdescription?: string;
    methods?: any[];
    extends?: any[];
}

export interface IFunctionDecDep extends IDep {
    file: any;
    subtype: string;
    deprecated: boolean;
    deprecationMessage: string;
    description: string;

    returnType?: string;
    args?: any[];
    jsdoctags?: string;
}

export interface IEnumDecDep extends IDep {
    childs: any[];
    subtype: string;
    deprecated: boolean;
    deprecationMessage: string;
    description: string;
    file: any;
}

export interface ITypeAliasDecDep extends IDep {
    subtype: string;
    file: any;
    rawtype: any;
    deprecated: boolean;
    deprecationMessage: string;
    description: string;

    kind?;
}

export interface Deps {
    id: string;
    name: string;
    type: string;
    subtype?: string;
    rawtype?: any;
    kind?: string;
    label?: string;
    file?: string;
    sourceCode?: string;
    deprecated?: boolean;
    deprecationMessage?: string;
    description?: string;

    // Component

    animations?: string[]; // TODO
    changeDetection?: string;
    encapsulation?: string;
    entryComponents?: string; // TODO
    exportAs?: string;
    host?: string;
    inputs?: string[];
    interpolation?: string; // TODO
    moduleId?: string;
    outputs?: string[];
    queries?: Deps[]; // TODO
    selector?: string;
    styleUrls?: string[];
    styles?: string[];
    template?: string;
    templateUrl?: string[];
    viewProviders?: Deps[];
    exampleUrls?: string[];

    implements?;
    extends?;

    inputsClass?: object[];
    outputsClass?: object[];
    propertiesClass?: object[];
    methodsClass?: object[];

    hostBindings?: object[];
    hostListeners?: object[];

    // common
    providers?: Deps[];

    // module
    declarations?: Deps[];
    bootstrap?: Deps[];

    imports?: Deps[];
    exports?: Deps[];

    routesTree?;
}

export interface SymbolDeps {
    full: string;
    alias: string;
}
