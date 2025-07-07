import type { ts } from 'ts-morph';
import type { Deps } from '../../dependencies.interfaces';
import type { ComponentCache } from './component-helper';
import { type IParseDeepIdentifierResult, SymbolHelper } from './symbol-helper';

export class ModuleHelper {
    constructor(
        private cache: ComponentCache,
        private symbolHelper: SymbolHelper = new SymbolHelper()
    ) {}

    public getModuleProviders(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): IParseDeepIdentifierResult[] {
        return this.symbolHelper
            .getSymbolDeps(props, 'providers', srcFile)
            .map(providerName => this.symbolHelper.parseDeepIndentifier(providerName, srcFile));
    }

    public getModuleControllers(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): IParseDeepIdentifierResult[] {
        return this.symbolHelper
            .getSymbolDeps(props, 'controllers', srcFile)
            .map(providerName => this.symbolHelper.parseDeepIndentifier(providerName, srcFile));
    }

    public getModuleDeclarations(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): Deps[] {
        return this.symbolHelper.getSymbolDeps(props, 'declarations', srcFile).map(name => {
            const component = this.cache.get(name);

            if (component) {
                return component;
            }

            return this.symbolHelper.parseDeepIndentifier(name, srcFile);
        });
    }

    public getModuleEntryComponents(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): Deps[] {
        return this.symbolHelper.getSymbolDeps(props, 'entryComponents', srcFile).map(name => {
            const component = this.cache.get(name);

            if (component) {
                return component;
            }

            return this.symbolHelper.parseDeepIndentifier(name, srcFile);
        });
    }

    private cleanImportForRootForChild(name: string): string {
        const nsModule = name.split('.');
        if (nsModule.length > 0) {
            name = nsModule[0];
        }
        return name;
    }

    public getModuleImports(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): IParseDeepIdentifierResult[] {
        return this.symbolHelper
            .getSymbolDeps(props, 'imports', srcFile)
            .map(name => this.cleanImportForRootForChild(name))
            .map(name => this.symbolHelper.parseDeepIndentifier(name));
    }

    public getModuleExports(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): IParseDeepIdentifierResult[] {
        return this.symbolHelper
            .getSymbolDeps(props, 'exports', srcFile)
            .map(name => this.symbolHelper.parseDeepIndentifier(name, srcFile));
    }

    public getModuleImportsRaw(
        props: readonly ts.ObjectLiteralElementLike[],
        _srcFile: ts.SourceFile
    ): ts.ObjectLiteralElementLike[] {
        return this.symbolHelper.getSymbolDepsRaw(props, 'imports');
    }

    public getModuleId(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): IParseDeepIdentifierResult[] {
        const _id = this.symbolHelper.getSymbolDeps(props, 'id', srcFile);
        let id;
        if (_id.length === 1) {
            id = _id[0];
        }
        return id;
    }

    public getModuleSchemas(props: readonly ts.ObjectLiteralElementLike[], srcFile: ts.SourceFile) {
        return this.symbolHelper.getSymbolDeps(props, 'schemas', srcFile);
    }

    public getModuleBootstrap(
        props: readonly ts.ObjectLiteralElementLike[],
        srcFile: ts.SourceFile
    ): IParseDeepIdentifierResult[] {
        return this.symbolHelper
            .getSymbolDeps(props, 'bootstrap', srcFile)
            .map(name => this.symbolHelper.parseDeepIndentifier(name, srcFile));
    }
}
