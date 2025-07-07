import * as path from 'node:path';
import { Project, SyntaxKind, ts } from 'ts-morph';
import { v4 as uuidv4 } from 'uuid';
import {
    getModuleWithProviders,
    isIgnore,
    isModuleWithProviders,
    JsdocParserUtil
} from '../../utils';
import ExtendsMerger from '../../utils/extends-merger.util';
import ImportsUtil from '../../utils/imports.util';
import { IsKindType, kindToType } from '../../utils/kind-to-type';
import { logger } from '../../utils/logger';
import { markedAcl } from '../../utils/marked.acl';
import { getNodeDecorators, nodeHasDecorator } from '../../utils/node.util';
import RouterParserUtil from '../../utils/router-parser.util';
import { cleanLifecycleHooksFromMethods, markedtags, mergeTagsAndArgs } from '../../utils/utils';
import Configuration from '../configuration';
import ComponentsTreeEngine from '../engines/components-tree.engine';
import { CodeGenerator } from './angular/code-generator';
import type {
    IDep,
    IEnumDecDep,
    IFunctionDecDep,
    IInjectableDep,
    IInterfaceDep,
    IPipeDep,
    ITypeAliasDecDep
} from './angular/dependencies.interfaces';
import { ComponentDepFactory } from './angular/deps/component-dep.factory';
import { ControllerDepFactory } from './angular/deps/controller-dep.factory';
import { DirectiveDepFactory } from './angular/deps/directive-dep.factory';
import { EntityDepFactory } from './angular/deps/entity-dep.factory';
import { ComponentCache } from './angular/deps/helpers/component-helper';
import { JsDocHelper } from './angular/deps/helpers/js-doc-helper';
import { ModuleHelper } from './angular/deps/helpers/module-helper';
import { SymbolHelper } from './angular/deps/helpers/symbol-helper';
import { ModuleDepFactory } from './angular/deps/module-dep.factory';
import { FrameworkDependencies } from './framework-dependencies';

const crypto = require('node:crypto');
const project = new Project();

// TypeScript reference : https://github.com/Microsoft/TypeScript/blob/master/lib/typescript.d.ts

export class AngularDependencies extends FrameworkDependencies {
    private engine;
    private cache: ComponentCache = new ComponentCache();
    private moduleHelper = new ModuleHelper(this.cache);
    private jsDocHelper = new JsDocHelper();
    private symbolHelper = new SymbolHelper();
    private jsdocParserUtil = new JsdocParserUtil();

    public getDependencies(): {
        aliases: Record<string, string[]>;
        modules: any[];
        modulesForGraph: any[];
        components: any[];
        controllers: any[];
        entities: any[];
        injectables: any[];
        interceptors: any[];
        guards: any[];
        pipes: any[];
        directives: any[];
        routes: any[];
        classes: any[];
        interfaces: any[];
        typescriptImports: any[];
        miscellaneous: {
            variables: any[];
            functions: any[];
            typealiases: any[];
            enumerations: any[];
        };
        routesTree: unknown;
    } {
        let deps = {
            aliases: {} as Record<string, string[]>,
            modules: [] as any[],
            modulesForGraph: [] as any[],
            components: [] as any[],
            controllers: [] as any[],
            entities: [] as any[],
            injectables: [] as any[],
            interceptors: [] as any[],
            guards: [] as any[],
            pipes: [] as any[],
            directives: [] as any[],
            routes: [] as any[],
            classes: [] as any[],
            interfaces: [] as any[],
            typescriptImports: [] as any[],
            miscellaneous: {
                variables: [] as any[],
                functions: [] as any[],
                typealiases: [] as any[],
                enumerations: [] as any[]
            },
            routesTree: undefined as unknown
        };

        const sourceFiles = this.program.getSourceFiles() || [];

        RouterParserUtil.scannedFiles = sourceFiles;

        sourceFiles.map((file: ts.SourceFile) => {
            const filePath = file.fileName;

            if (path.extname(filePath) === '.ts' || path.extname(filePath) === '.tsx') {
                if (!Configuration.mainData.angularJSProject && path.extname(filePath) === '.js') {
                    logger.info('parsing', filePath);
                    this.getSourceFileDecorators(file, deps);
                } else {
                    if (
                        filePath.lastIndexOf('.d.ts') === -1 &&
                        filePath.lastIndexOf('spec.ts') === -1
                    ) {
                        logger.info('parsing', filePath);
                        this.getTypescriptExportsAliases(file, deps);
                        this.getTypescriptImportsAliases(file, deps);
                        this.getSourceFileDecorators(file, deps);
                    }
                }
            }

            return deps;
        });

        // End of file scanning
        // Try merging inside the same file declarated variables & modules with imports | exports | declarations | providers

        if (deps.miscellaneous.variables.length > 0) {
            deps.miscellaneous.variables.forEach(_variable => {
                const newVar = [];

                // link ...VAR to VAR values, recursively
                ((_var, _newVar) => {
                    // getType pr reconstruire....
                    const elementsMatcher = (variabelToReplace: {
                        initializer: { elements: any[] };
                    }) => {
                        if (variabelToReplace.initializer) {
                            if (variabelToReplace.initializer.elements) {
                                if (variabelToReplace.initializer.elements.length > 0) {
                                    variabelToReplace.initializer.elements.forEach(
                                        (element: {
                                            text: string;
                                            kind: ts.SyntaxKind;
                                            expression: { text };
                                        }) => {
                                            // Direct value -> Kind 79
                                            if (
                                                element.text &&
                                                element.kind === SyntaxKind.Identifier
                                            ) {
                                                newVar.push({
                                                    name: element.text,
                                                    type: this.symbolHelper.getType(element.text)
                                                });
                                            }
                                            // if _variable is ArrayLiteralExpression 203
                                            // and has SpreadElements in his elements
                                            // merge them
                                            if (
                                                element.kind === SyntaxKind.SpreadElement &&
                                                element.expression
                                            ) {
                                                const el = deps.miscellaneous.variables.find(
                                                    variable =>
                                                        variable.name === element.expression.text
                                                );
                                                if (el) {
                                                    elementsMatcher(el);
                                                }
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    };
                    elementsMatcher(_var);
                })(_variable, newVar);

                const onLink = mod => {
                    const process = (initialArray, _var) => {
                        const indexToClean = initialArray?.findIndex(el => el.name === _var.name);
                        if (indexToClean !== -1) {
                            initialArray.splice(indexToClean, 1);
                            // Add variable
                            newVar.forEach(newEle => {
                                if (!initialArray?.some(e => e.name === newEle.name)) {
                                    initialArray.push(newEle);
                                }
                            });
                        }
                    };
                    process(mod.imports, _variable);
                    process(mod.exports, _variable);
                    process(mod.controllers, _variable);
                    process(mod.declarations, _variable);
                    process(mod.providers, _variable);
                };

                deps.modules.forEach(onLink);
                deps.modulesForGraph.forEach(onLink);
            });
        }

        /**
         * If one thing extends another, merge them, only for internal sources
         * - classes
         * - components
         * - injectables
         * - directives
         * for
         * - inputs
         * - outputs
         * - properties
         * - methods
         */
        deps = ExtendsMerger.merge(deps);

        // RouterParserUtil.printModulesRoutes();
        // RouterParserUtil.printRoutes();

        if (!Configuration.mainData.disableRoutesGraph) {
            RouterParserUtil.linkModulesAndRoutes();
            RouterParserUtil.constructModulesTree();

            deps.routesTree = RouterParserUtil.constructRoutesTree();
        }

        return deps;
    }

    private processClass(
        node: ts.Node,
        file: string,
        srcFile: ts.SourceFile,
        outputSymbols: { guards: unknown[]; classes: unknown[] },
        fileBody: unknown,
        astFile?: undefined
    ) {
        const name = this.getSymboleName(node);
        const IO = this.getClassIO(file, srcFile, node, fileBody, astFile);
        const sourceCode = srcFile.getText();
        const hash = crypto.createHash('sha512').update(sourceCode).digest('hex');
        const deps: Record<string, unknown> = {
            name,
            id: `class-${name}-${hash}`,
            file: file,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage,
            type: 'class',
            sourceCode: srcFile.getText()
        };
        let excludeFromClassArray = false;

        if (IO.constructor && !Configuration.mainData.disableConstructors) {
            deps.constructorObj = IO.constructor;
        }
        deps.inputsClass = IO.inputs ?? [];
        deps.outputsClass = IO.outputs ?? [];
        if (IO.properties) {
            const { inputSignals, outputSignals, properties } =
                this.componentHelper.getInputOutputSignals(IO.properties);

            deps.inputsClass = deps.inputsClass.concat(inputSignals);
            deps.outputsClass = deps.outputsClass.concat(outputSignals);
            deps.properties = properties;
        }
        if (IO.description) {
            deps.description = IO.description;
        }
        if (IO.rawdescription) {
            deps.rawdescription = IO.rawdescription;
        }
        if (IO.methods) {
            deps.methods = IO.methods;
        }
        if (IO.indexSignatures) {
            deps.indexSignatures = IO.indexSignatures;
        }
        if (IO.extends) {
            deps.extends = IO.extends;
        }
        if (IO.jsdoctags && IO.jsdoctags.length > 0) {
            deps.jsdoctags = IO.jsdoctags[0].tags;
        }
        if (IO.accessors) {
            deps.accessors = IO.accessors;
        }

        if (IO.hostBindings) {
            deps.hostBindings = IO.hostBindings;
        }
        if (IO.hostListeners) {
            deps.hostListeners = IO.hostListeners;
        }
        if (Configuration.mainData.disableLifeCycleHooks) {
            deps.methods = cleanLifecycleHooksFromMethods(deps.methods);
        }
        if (IO.implements && IO.implements.length > 0) {
            deps.implements = IO.implements;

            if (this.isGuard(IO.implements)) {
                // We don't want the Guard to show up in the Classes menu
                excludeFromClassArray = true;
                deps.type = 'guard';

                outputSymbols.guards.push(deps);
            }
        }
        if (typeof IO.ignore === 'undefined') {
            this.debug(deps);

            if (!excludeFromClassArray) {
                outputSymbols.classes.push(deps);
            }
        } else {
            this.ignore(deps);
        }
    }

    private getTypescriptImportsAliases(initialSrcFile: ts.SourceFile, outputSymbols): void {
        const astFile =
            typeof project.getSourceFile(initialSrcFile.fileName) !== 'undefined'
                ? project.getSourceFile(initialSrcFile.fileName)
                : project.addSourceFileAtPath(initialSrcFile.fileName);

        if (astFile) {
            const importDeclarations = astFile.getImportDeclarations();
            if (importDeclarations && importDeclarations.length > 0) {
                importDeclarations.forEach(importDeclaration => {
                    const namedImports = importDeclaration.getNamedImports();
                    if (namedImports && namedImports.length > 0) {
                        namedImports.forEach(namedImport => {
                            if (namedImport.getAliasNode()) {
                                if (Object.hasOwn(outputSymbols.aliases, namedImport.getName())) {
                                    outputSymbols.aliases[namedImport.getName()].push(
                                        namedImport.getAliasNode().getText()
                                    );
                                } else {
                                    outputSymbols.aliases[namedImport.getName()] = [
                                        namedImport.getAliasNode().getText()
                                    ];
                                }
                            }
                        });
                    }
                });
            }
        }
    }

    private getTypescriptExportsAliases(initialSrcFile: ts.SourceFile, outputSymbols): void {
        const astFile =
            typeof project.getSourceFile(initialSrcFile.fileName) !== 'undefined'
                ? project.getSourceFile(initialSrcFile.fileName)
                : project.addSourceFileAtPath(initialSrcFile.fileName);

        if (astFile) {
            const exportDeclarations = astFile.getExportDeclarations();
            if (exportDeclarations && exportDeclarations.length > 0) {
                exportDeclarations.forEach(exportDeclaration => {
                    const hasNamedExports = exportDeclaration.hasNamedExports();
                    if (hasNamedExports) {
                        const namedExports = exportDeclaration.getNamedExports();
                        if (namedExports && namedExports.length > 0) {
                            namedExports.forEach(namedExport => {
                                if (namedExport.getAliasNode()) {
                                    if (
                                        Object.hasOwn(outputSymbols.aliases, namedExport.getName())
                                    ) {
                                        outputSymbols.aliases[namedExport.getName()].push(
                                            namedExport.getAliasNode().getText()
                                        );
                                    } else {
                                        outputSymbols.aliases[namedExport.getName()] = [
                                            namedExport.getAliasNode().getText()
                                        ];
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    private getSourceFileDecorators(initialSrcFile: ts.SourceFile, outputSymbols): void {
        const cleaner = (process.cwd() + path.sep).replace(/\\/g, '/');
        const fileName = initialSrcFile.fileName.replace(cleaner, '');
        let scannedFile = initialSrcFile;

        // Search in file for variable statement as routes definitions

        const astFile =
            project.getSourceFile(initialSrcFile.fileName) ??
            project.addSourceFileAtPath(initialSrcFile.fileName);

        const variableRoutesStatements = astFile.getVariableStatements();
        let hasRoutesStatements = false;

        if (variableRoutesStatements.length > 0) {
            // Clean file for spread and dynamics inside routes definitions
            variableRoutesStatements.forEach(s => {
                hasRoutesStatements = s.getDeclarations().some(declaration => {
                    return (
                        declaration.getTypeNode() &&
                        declaration.getTypeNode().getText() === 'Routes'
                    );
                });
            });
        }

        if (hasRoutesStatements && !Configuration.mainData.disableRoutesGraph) {
            // Clean file for spread and dynamics inside routes definitions
            logger.info('Analysing routes definitions and clean them if necessary');

            // scannedFile = RouterParserUtil.cleanFileIdentifiers(astFile).compilerNode;
            RouterParserUtil.cleanFileSpreads(astFile);

            scannedFile = RouterParserUtil.cleanCallExpressions(astFile).compilerNode;
            scannedFile = RouterParserUtil.cleanFileDynamics(astFile).compilerNode;

            scannedFile.kind = SyntaxKind.SourceFile;
        }

        ts.forEachChild(scannedFile, (initialNode: ts.Node) => {
            if (
                this.jsDocHelper.hasJSDocInternalTag(fileName, scannedFile, initialNode) &&
                Configuration.mainData.disableInternal
            ) {
                return;
            }
            const parseNode = (
                file: string,
                srcFile: ts.SourceFile,
                node: ts.Node,
                fileBody: ts.ModuleBody,
                astFile: ts.SourceFile
            ) => {
                const sourceCode = srcFile.getText();
                const hash = crypto.createHash('sha512').update(sourceCode).digest('hex');

                if (nodeHasDecorator(node)) {
                    let classWithCustomDecorator = false;
                    const nodeDecorators = getNodeDecorators(node);
                    const visitDecorator = (visitedDecorator: ts.Decorator) => {
                        let deps: IDep;

                        const name = this.getSymboleName(node);
                        const props = this.findProperties(visitedDecorator, srcFile);
                        const IO = this.componentHelper.getComponentIO(
                            file,
                            srcFile,
                            node,
                            fileBody,
                            astFile
                        );

                        if (this.isModule(visitedDecorator)) {
                            const moduleDep = new ModuleDepFactory(this.moduleHelper).create(
                                file,
                                srcFile,
                                name,
                                props,
                                IO
                            );
                            if (RouterParserUtil.hasRouterModuleInImports(moduleDep.imports)) {
                                RouterParserUtil.addModuleWithRoutes(
                                    name,
                                    this.moduleHelper.getModuleImportsRaw(props, srcFile),
                                    file
                                );
                            }
                            deps = moduleDep;
                            if (typeof IO.ignore === 'undefined') {
                                RouterParserUtil.addModule(name, moduleDep.imports);
                                outputSymbols.modules.push(moduleDep);
                                outputSymbols.modulesForGraph.push(moduleDep);
                            }
                        } else if (this.isComponent(visitedDecorator)) {
                            if (props.length === 0) {
                                return;
                            }
                            const componentDep = new ComponentDepFactory(
                                this.componentHelper
                            ).create(file, srcFile, name, props, IO);
                            deps = componentDep;
                            if (typeof IO.ignore === 'undefined') {
                                ComponentsTreeEngine.addComponent(componentDep);
                                outputSymbols.components.push(componentDep);
                            }
                        } else if (this.isController(visitedDecorator)) {
                            const controllerDep = new ControllerDepFactory().create(
                                file,
                                srcFile,
                                name,
                                props,
                                IO
                            );
                            deps = controllerDep;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.controllers.push(controllerDep);
                            }
                        } else if (this.isEntity(visitedDecorator)) {
                            const entityDep = new EntityDepFactory().create(
                                file,
                                srcFile,
                                name,
                                props,
                                IO
                            );
                            deps = entityDep;

                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.entities.push(entityDep);
                            }
                        } else if (this.isInjectable(visitedDecorator)) {
                            const injectableDeps: IInjectableDep = {
                                name,
                                id: `injectable-${name}-${hash}`,
                                file: file,
                                properties: IO.properties,
                                methods: IO.methods,
                                deprecated: IO.deprecated,
                                deprecationMessage: IO.deprecationMessage,
                                description: IO.description,
                                rawdescription: IO.rawdescription,
                                sourceCode: srcFile.getText(),
                                exampleUrls: this.componentHelper.getComponentExampleUrls(
                                    srcFile.getText()
                                )
                            };
                            if (IO.constructor && !Configuration.mainData.disableConstructors) {
                                injectableDeps.constructorObj = IO.constructor;
                            }
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                injectableDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            if (IO.accessors) {
                                injectableDeps.accessors = IO.accessors;
                            }
                            if (IO.extends) {
                                injectableDeps.extends = IO.extends;
                            }
                            if (Configuration.mainData.disableLifeCycleHooks) {
                                injectableDeps.methods = cleanLifecycleHooksFromMethods(
                                    injectableDeps.methods
                                );
                            }
                            deps = injectableDeps;
                            if (typeof IO.ignore === 'undefined') {
                                if (IO.implements?.includes('HttpInterceptor')) {
                                    injectableDeps.type = 'interceptor';
                                    outputSymbols.interceptors.push(injectableDeps);
                                } else if (this.isGuard(IO.implements)) {
                                    injectableDeps.type = 'guard';
                                    outputSymbols.guards.push(injectableDeps);
                                } else {
                                    injectableDeps.type = 'injectable';
                                    this.addNewEntityInStore(
                                        injectableDeps,
                                        outputSymbols.injectables
                                    );
                                }
                            }
                        } else if (this.isPipe(visitedDecorator)) {
                            const pipeDeps: IPipeDep = {
                                name,
                                id: `pipe-${name}-${hash}`,
                                file: file,
                                type: 'pipe',
                                deprecated: IO.deprecated,
                                deprecationMessage: IO.deprecationMessage,
                                description: IO.description,
                                rawdescription: IO.rawdescription,
                                properties: IO.properties,
                                methods: IO.methods,
                                standalone: !!this.componentHelper.getComponentStandalone(
                                    props,
                                    srcFile
                                ),
                                pure: this.componentHelper.getComponentPure(props, srcFile),
                                ngname: this.componentHelper.getComponentName(props, srcFile),
                                sourceCode: srcFile.getText(),
                                exampleUrls: this.componentHelper.getComponentExampleUrls(
                                    srcFile.getText()
                                )
                            };
                            if (Configuration.mainData.disableLifeCycleHooks) {
                                pipeDeps.methods = cleanLifecycleHooksFromMethods(pipeDeps.methods);
                            }
                            if (IO.jsdoctags && IO.jsdoctags.length > 0) {
                                pipeDeps.jsdoctags = IO.jsdoctags[0].tags;
                            }
                            deps = pipeDeps;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.pipes.push(pipeDeps);
                            }
                        } else if (this.isDirective(visitedDecorator)) {
                            const directiveDeps = new DirectiveDepFactory(
                                this.componentHelper
                            ).create(file, srcFile, name, props, IO);
                            deps = directiveDeps;
                            if (typeof IO.ignore === 'undefined') {
                                outputSymbols.directives.push(directiveDeps);
                            }
                        } else {
                            const hasMultipleDecoratorsWithInternalOne =
                                this.hasInternalDecorator(nodeDecorators);
                            // Just a class
                            if (
                                !classWithCustomDecorator &&
                                !hasMultipleDecoratorsWithInternalOne
                            ) {
                                classWithCustomDecorator = true;
                                this.processClass(node, file, srcFile, outputSymbols, fileBody);
                            }
                        }
                        this.cache.set(name, deps);

                        if (typeof IO.ignore === 'undefined') {
                            this.debug(deps);
                        } else {
                            this.ignore(deps);
                        }
                    };

                    const filterByDecorators = (filteredNode: ts.Decorator) => {
                        if (filteredNode.expression?.expression) {
                            let _test = /(NgModule|Component|Injectable|Pipe|Directive)/.test(
                                filteredNode.expression.expression.text
                            );
                            if (!_test && ts.isClassDeclaration(node)) {
                                _test = true;
                            }
                            return _test;
                        }
                        if (ts.isClassDeclaration(node)) {
                            return true;
                        }
                        return false;
                    };

                    nodeDecorators.filter(filterByDecorators).forEach(visitDecorator);
                } else if (node.symbol) {
                    if (node.symbol.flags === ts.SymbolFlags.Class) {
                        this.processClass(node, file, srcFile, outputSymbols, fileBody, astFile);
                    } else if (node.symbol.flags === ts.SymbolFlags.Interface) {
                        const name = this.getSymboleName(node);
                        const IO = this.getInterfaceIO(file, srcFile, node, fileBody, astFile);
                        const interfaceDeps: IInterfaceDep = {
                            name,
                            id: `interface-${name}-${hash}`,
                            file: file,
                            deprecated: IO.deprecated,
                            deprecationMessage: IO.deprecationMessage,
                            type: 'interface',
                            sourceCode: srcFile.getText()
                        };
                        if (IO.properties) {
                            interfaceDeps.properties = IO.properties;
                        }
                        if (IO.indexSignatures) {
                            interfaceDeps.indexSignatures = IO.indexSignatures;
                        }
                        if (IO.kind) {
                            interfaceDeps.kind = IO.kind;
                        }
                        if (IO.description) {
                            interfaceDeps.description = IO.description;
                            interfaceDeps.rawdescription = IO.rawdescription;
                        }
                        if (IO.methods) {
                            interfaceDeps.methods = IO.methods;
                        }
                        if (IO.extends) {
                            interfaceDeps.extends = IO.extends;
                        }
                        if (typeof IO.ignore === 'undefined') {
                            this.debug(interfaceDeps);
                            outputSymbols.interfaces.push(interfaceDeps);
                        } else {
                            this.ignore(interfaceDeps);
                        }
                    } else if (ts.isFunctionDeclaration(node)) {
                        const infos = this.visitFunctionDeclaration(node);
                        const name = infos.name;
                        const deprecated = infos.deprecated;
                        const deprecationMessage = infos.deprecationMessage;
                        const functionDep: IFunctionDecDep = {
                            name,
                            file: file,
                            ctype: 'miscellaneous',
                            subtype: 'function',
                            deprecated,
                            deprecationMessage,
                            description: this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (infos.returnType) {
                            functionDep.returnType = infos.returnType;
                        }
                        if (infos.jsdoctags && infos.jsdoctags.length > 0) {
                            functionDep.jsdoctags = infos.jsdoctags;
                        }
                        if (typeof infos.ignore === 'undefined') {
                            if (
                                !(
                                    this.hasPrivateJSDocTag(functionDep.jsdoctags) &&
                                    Configuration.mainData.disablePrivate
                                )
                            ) {
                                this.debug(functionDep);
                                outputSymbols.miscellaneous.functions.push(functionDep);
                            }
                        }
                    } else if (ts.isEnumDeclaration(node)) {
                        const infos = this.visitEnumDeclaration(node);
                        const name = infos.name;
                        const deprecated = infos.deprecated;
                        const deprecationMessage = infos.deprecationMessage;
                        const enumDeps: IEnumDecDep = {
                            name,
                            childs: infos.members,
                            ctype: 'miscellaneous',
                            subtype: 'enum',
                            deprecated,
                            deprecationMessage,
                            description:
                                this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };

                        if (!isIgnore(node)) {
                            this.debug(enumDeps);
                            outputSymbols.miscellaneous.enumerations.push(enumDeps);
                        }
                    } else if (ts.isTypeAliasDeclaration(node)) {
                        const infos = this.visitTypeDeclaration(node);
                        const name = infos.name;
                        const deprecated = infos.deprecated;
                        const deprecationMessage = infos.deprecationMessage;
                        const typeAliasDeps: ITypeAliasDecDep = {
                            name,
                            ctype: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: this.classHelper.visitType(node),
                            file: file,
                            deprecated,
                            deprecationMessage,
                            description: this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            typeAliasDeps.kind = node.type.kind;
                            if (typeAliasDeps.rawtype === '') {
                                typeAliasDeps.rawtype = this.classHelper.visitType(node);
                            }
                        }

                        if (
                            typeAliasDeps.kind &&
                            typeAliasDeps.kind === SyntaxKind.TemplateLiteralType &&
                            node.type
                        ) {
                            typeAliasDeps.rawtype = srcFile.text.substring(
                                node.type.pos,
                                node.type.end
                            );
                        }

                        if (!isIgnore(node)) {
                            outputSymbols.miscellaneous.typealiases.push(typeAliasDeps);
                        }

                        if (typeof infos.ignore === 'undefined') {
                            this.debug(typeAliasDeps);
                        }
                    } else if (ts.isModuleDeclaration(node) && ts.isModuleBlock(node.body)) {
                        node.body.statements.forEach(statement =>
                            parseNode(file, srcFile, statement, node.body, astFile)
                        );
                    }
                } else {
                    const IO = this.getRouteIO(file, srcFile, node);
                    if (IO.routes) {
                        let newRoutes: object;
                        try {
                            newRoutes = RouterParserUtil.cleanRawRouteParsed(IO.routes);
                        } catch (_e) {
                            logger.error(
                                'Routes parsing error, maybe a trailing comma or an external variable, trying to fix that later after sources scanning.'
                            );
                            newRoutes = IO.routes.replace(/ /gm, '');
                            RouterParserUtil.addIncompleteRoute({
                                data: newRoutes,
                                file: file
                            });
                            return true;
                        }
                        outputSymbols.routes = [...outputSymbols.routes, ...newRoutes];
                    }
                    if (ts.isClassDeclaration(node)) {
                        this.processClass(node, file, srcFile, outputSymbols, fileBody);
                    }
                    if (ts.isExpressionStatement(node) || ts.isIfStatement(node)) {
                        const bootstrapModuleReference = 'bootstrapModule';
                        // Find the root module with bootstrapModule call
                        // 1. find a simple call : platformBrowserDynamic().bootstrapModule(AppModule);
                        // 2. or inside a call :
                        // () => {
                        //     platformBrowserDynamic().bootstrapModule(AppModule);
                        // });
                        // 3. with a catch : platformBrowserDynamic().bootstrapModule(AppModule).catch(error => console.error(error));
                        // 4. with parameters : platformBrowserDynamic().bootstrapModule(AppModule, {}).catch(error => console.error(error));
                        // Find recusively in expression nodes one with name 'bootstrapModule'
                        let rootModule: string;
                        let resultNode: { arguments: string | any[] };
                        if (srcFile.text?.includes(bootstrapModuleReference)) {
                            if (
                                ts.isExpressionStatement(node) &&
                                ts.isCallExpression(node.expression)
                            ) {
                                resultNode = this.findExpressionByNameInExpressions(
                                    node.expression,
                                    'bootstrapModule'
                                );
                            }
                            if (ts.isIfStatement(node) && ts.isBlock(node.thenStatement)) {
                                const firstStatement = node.thenStatement.statements[0];
                                if (
                                    ts.isExpressionStatement(firstStatement) &&
                                    ts.isCallExpression(firstStatement.expression)
                                ) {
                                    resultNode = this.findExpressionByNameInExpressions(
                                        firstStatement.expression,
                                        'bootstrapModule'
                                    );
                                }
                            }
                            if (
                                !resultNode &&
                                ts.isExpressionStatement(node) &&
                                ts.isCallExpression(node.expression)
                            ) {
                                if (node.expression.arguments?.length > 0) {
                                    resultNode = this.findExpressionByNameInExpressionArguments(
                                        node.expression.arguments,
                                        'bootstrapModule'
                                    );
                                }
                            }
                            resultNode.arguments?.forEach(argument => {
                                if (argument?.text) {
                                    rootModule = argument.text;
                                }
                            });

                            if (rootModule) {
                                RouterParserUtil.setRootModule(rootModule);
                            }
                        }
                    }
                    if (ts.isVariableStatement(node) && !RouterParserUtil.isVariableRoutes(node)) {
                        let isDestructured = false;
                        // Check for destructuring array
                        const nodeVariableDeclarations = node.declarationList.declarations;
                        if (
                            Array.isArray(nodeVariableDeclarations) &&
                            nodeVariableDeclarations.length > 0
                        ) {
                            if (
                                nodeVariableDeclarations[0]?.name &&
                                ts.isArrayBindingPattern(nodeVariableDeclarations[0].name)
                            ) {
                                isDestructured = true;
                            }
                        }

                        const visitVariableNode = (variableNode: ts.VariableStatement) => {
                            const infos = this.visitVariableDeclaration(variableNode);
                            if (infos) {
                                const name = infos.name;
                                const deprecated = infos.deprecated;
                                const deprecationMessage = infos.deprecationMessage;
                                const deps = {
                                    name,
                                    ctype: 'miscellaneous',
                                    subtype: 'variable',
                                    file: file,
                                    deprecated,
                                    deprecationMessage
                                };
                                deps.type = infos.type ? infos.type : '';
                                if (infos.defaultValue) {
                                    deps.defaultValue = infos.defaultValue;
                                }
                                if (infos.initializer) {
                                    deps.initializer = infos.initializer;
                                }
                                if (
                                    variableNode.jsDoc &&
                                    variableNode.jsDoc.length > 0 &&
                                    variableNode.jsDoc[0].comment
                                ) {
                                    const rawDescription = this.jsdocParserUtil.parseJSDocNode(
                                        variableNode.jsDoc[0]
                                    );
                                    deps.rawdescription = rawDescription;
                                    deps.description = markedAcl(rawDescription);
                                }
                                if (isModuleWithProviders(variableNode)) {
                                    const routingInitializer = getModuleWithProviders(variableNode);
                                    RouterParserUtil.addModuleWithRoutes(
                                        name,
                                        [routingInitializer],
                                        file
                                    );
                                    RouterParserUtil.addModule(name, [routingInitializer]);
                                }
                                if (!isIgnore(variableNode)) {
                                    this.debug(deps);
                                    outputSymbols.miscellaneous.variables.push(deps);
                                }
                            }
                        };

                        if (isDestructured) {
                            const destructuredPattern = nodeVariableDeclarations[0]?.name;
                            if (ts.isArrayBindingPattern(destructuredPattern)) {
                                const destructuredVariables = destructuredPattern.elements;
                                for (let i = 0; i < destructuredVariables.length; i++) {
                                    const destructuredVariable = destructuredVariables[i];
                                    const name = destructuredVariable?.name?.escapedText ?? '';
                                    const deps = {
                                        name,
                                        ctype: 'miscellaneous',
                                        subtype: 'variable',
                                        file: file
                                    };
                                    const initializer = nodeVariableDeclarations[0]?.initializer;
                                    if (initializer && ts.isArrayLiteralExpression(initializer)) {
                                        deps.initializer = initializer.elements[i];
                                        deps.defaultValue = deps.initializer
                                            ? this.classHelper.stringifyDefaultValue(
                                                  deps.initializer
                                              )
                                            : undefined;
                                    }
                                    if (!isIgnore(destructuredVariable)) {
                                        this.debug(deps);
                                        outputSymbols.miscellaneous.variables.push(deps);
                                    }
                                }
                            }
                        } else {
                            visitVariableNode(node);
                        }
                    }
                    if (ts.isTypeAliasDeclaration(node)) {
                        const infos = this.visitTypeDeclaration(node);
                        const name = infos.name;
                        const deprecated = infos.deprecated;
                        const deprecationMessage = infos.deprecationMessage;
                        const deps: ITypeAliasDecDep = {
                            name,
                            ctype: 'miscellaneous',
                            subtype: 'typealias',
                            rawtype: this.classHelper.visitType(node),
                            file: file,
                            deprecated,
                            deprecationMessage,
                            description: this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (node.type) {
                            deps.kind = node.type.kind;
                        }
                        if (
                            deps.kind &&
                            deps.kind === SyntaxKind.TemplateLiteralType &&
                            node.type
                        ) {
                            deps.rawtype = srcFile.text.substring(node.type.pos, node.type.end);
                        }
                        if (!isIgnore(node)) {
                            this.debug(deps);
                            outputSymbols.miscellaneous.typealiases.push(deps);
                        }
                    }
                    if (ts.isFunctionDeclaration(node)) {
                        const infos = this.visitFunctionDeclaration(node);
                        const name = infos.name;
                        const deprecated = infos.deprecated;
                        const deprecationMessage = infos.deprecationMessage;
                        const functionDep: IFunctionDecDep = {
                            name,
                            ctype: 'miscellaneous',
                            subtype: 'function',
                            file: file,
                            deprecated,
                            deprecationMessage,
                            description: this.visitEnumTypeAliasFunctionDeclarationDescription(node)
                        };
                        if (infos.args) {
                            functionDep.args = infos.args;
                        }
                        if (infos.returnType) {
                            functionDep.returnType = infos.returnType;
                        }
                        if (infos.jsdoctags && infos.jsdoctags.length > 0) {
                            functionDep.jsdoctags = infos.jsdoctags;
                        }
                        if (typeof infos.ignore === 'undefined') {
                            if (
                                !(
                                    this.hasPrivateJSDocTag(functionDep.jsdoctags) &&
                                    Configuration.mainData.disablePrivate
                                )
                            ) {
                                this.debug(functionDep);
                                outputSymbols.miscellaneous.functions.push(functionDep);
                            }
                        }
                    }
                    if (ts.isEnumDeclaration(node)) {
                        const infos = this.visitEnumDeclaration(node);
                        const name = infos.name;
                        const deprecated = infos.deprecated;
                        const deprecationMessage = infos.deprecationMessage;
                        const enumDeps: IEnumDecDep = {
                            name,
                            childs: infos.members,
                            ctype: 'miscellaneous',
                            subtype: 'enum',
                            deprecated,
                            deprecationMessage,
                            description:
                                this.visitEnumTypeAliasFunctionDeclarationDescription(node),
                            file: file
                        };
                        if (!isIgnore(node)) {
                            this.debug(enumDeps);
                            outputSymbols.miscellaneous.enumerations.push(enumDeps);
                        }
                    }
                }
            };

            parseNode(fileName, scannedFile, initialNode, null, astFile);
        });
    }

    /**
     * Function to in a specific store an entity, and check before is there is not the same one
     * in that store : same name, id and file
     * @param entity Entity to store
     * @param store Store
     */
    private addNewEntityInStore(entity: IInjectableDep, store) {
        const sameEntityInStore = store?.some(
            item => item.name === entity.name && item.id === entity.id && item.file === entity.file
        );
        if (!sameEntityInStore) {
            store.push(entity);
        }
    }

    private debug(deps: IDep) {
        if (!deps?.name) {
            return;
        }
        logger.debug('found', deps.name);
        ['imports', 'exports', 'declarations', 'providers', 'bootstrap'].forEach(symbols => {
            if (deps?.[symbols]?.length > 0) {
                logger.debug('', `- ${symbols}:`);
                for (const i of deps[symbols]) {
                    logger.debug('', `\t- ${i.name}`);
                }
            }
        });
    }

    private ignore(deps: IDep) {
        if (!deps?.name) {
            return;
        }
        logger.warn('ignore', deps.name);
    }

    private checkForDeprecation(tags: ts.JSDocTag[], result: Record<string | number, unknown>) {
        const deprecationTag = tags?.find(tag => tag.tagName?.text.includes('deprecated'));
        if (deprecationTag) {
            result.deprecated = true;
            result.deprecationMessage = deprecationTag.comment || '';
        }
    }

    private findExpressionByNameInExpressions(entryNode: ts.Expression, name: string) {
        let result;
        const loop = (node: { expression: { name: { text } } }, z) => {
            if (node) {
                if (node.expression && !node.expression.name) {
                    loop(node.expression, z);
                }
                if (node.expression?.name) {
                    if (node.expression.name.text === z) {
                        result = node;
                    } else {
                        loop(node.expression, z);
                    }
                }
            }
        };
        loop(entryNode, name);
        return result;
    }

    private findExpressionByNameInExpressionArguments(arg: string | any[], name: string) {
        let result;
        let i = 0;
        const len = arg.length;
        const loop = function (node: { body: { statements: string | any[] } }, z) {
            if (node.body) {
                if (node.body.statements && node.body.statements.length > 0) {
                    let j = 0;
                    const leng = node.body.statements.length;
                    for (j; j < leng; j++) {
                        result = this.findExpressionByNameInExpressions(node.body.statements[j], z);
                    }
                }
            }
        };
        for (i; i < len; i++) {
            loop(arg[i], name);
        }
        return result;
    }

    private parseDecorators(decorators: ts.Decorator[], type: string): boolean {
        let result = false;
        if (decorators.length > 1) {
            for (const decorator of decorators) {
                if (decorator.expression.expression) {
                    if (decorator.expression.expression.text === type) {
                        result = true;
                    }
                }
            }
        } else {
            if (decorators[0].expression.expression) {
                if (decorators[0].expression.expression.text === type) {
                    result = true;
                }
            }
        }
        return result;
    }

    private parseDecorator(
        decorator: { expression: { expression: { text: string } } },
        type: string
    ): boolean {
        let result = false;
        if (decorator.expression.expression) {
            if (decorator.expression.expression.text === type) {
                result = true;
            }
        }
        return result;
    }

    private isController(metadata) {
        return this.parseDecorator(metadata, 'Controller');
    }

    private isEntity(metadata) {
        return this.parseDecorator(metadata, 'Entity');
    }

    private isComponent(metadata) {
        return this.parseDecorator(metadata, 'Component');
    }

    private isPipe(metadata) {
        return this.parseDecorator(metadata, 'Pipe');
    }

    private isDirective(metadata) {
        return this.parseDecorator(metadata, 'Directive');
    }

    private isInjectable(metadata) {
        return this.parseDecorator(metadata, 'Injectable');
    }

    private isModule(metadata) {
        return this.parseDecorator(metadata, 'NgModule') || this.parseDecorator(metadata, 'Module');
    }

    private hasInternalDecorator(metadatas: ts.Decorator[]) {
        return (
            this.parseDecorators(metadatas, 'Controller') ||
            this.parseDecorators(metadatas, 'Component') ||
            this.parseDecorators(metadatas, 'Pipe') ||
            this.parseDecorators(metadatas, 'Directive') ||
            this.parseDecorators(metadatas, 'Injectable') ||
            this.parseDecorators(metadatas, 'NgModule') ||
            this.parseDecorators(metadatas, 'Module')
        );
    }

    private isGuard(ioImplements: string[]): boolean {
        return (
            ioImplements?.includes('CanActivate') ||
            ioImplements?.includes('CanActivateChild') ||
            ioImplements?.includes('CanDeactivate') ||
            ioImplements?.includes('Resolve') ||
            ioImplements?.includes('CanLoad')
        );
    }

    private getSymboleName(node: ts.Node): string {
        return ts.isIdentifier(node) ? node.text : '';
    }

    private findProperties(
        visitedNode: ts.Decorator,
        sourceFile: ts.SourceFile
    ): readonly ts.ObjectLiteralElementLike[] {
        if (ts.isCallExpression(visitedNode.expression) && visitedNode.expression?.arguments?.[0]) {
            const pop = visitedNode.expression.arguments[0];

            if (pop?.properties?.length >= 0) {
                return pop.properties;
            } else if (pop?.kind === SyntaxKind.StringLiteral) {
                return [pop];
            } else {
                logger.warn('Empty metadatas, trying to find it with imports.');
                return ImportsUtil.findValueInImportOrLocalVariables(pop?.text, sourceFile);
            }
            if (pop?.kind && pop.kind === SyntaxKind.StringLiteral) {
                return [pop];
            }
            logger.warn('Empty metadatas, trying to find it with imports.');
            return ImportsUtil.findValueInImportOrLocalVariables(pop.text, sourceFile);
        }

        return [];
    }

    private isAngularLifecycleHook(methodName: string) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        const ANGULAR_LIFECYCLE_METHODS = [
            'ngOnInit',
            'ngOnChanges',
            'ngDoCheck',
            'ngOnDestroy',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewInit',
            'ngAfterViewChecked',
            'writeValue',
            'registerOnChange',
            'registerOnTouched',
            'setDisabledState'
        ];
        return ANGULAR_LIFECYCLE_METHODS.includes(methodName);
    }

    private visitTypeDeclaration(node: ts.TypeAliasDeclaration) {
        const result = {
            deprecated: false,
            deprecationMessage: '',
            name: node.name.text,
            kind: node.kind
        };
        const jsdoctags = this.jsdocParserUtil.getJSDocs(node);

        if (jsdoctags?.[0]?.tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
            result.jsdoctags = markedtags(jsdoctags[0].tags);
        }
        return result;
    }

    private visitArgument(arg: ts.Node) {
        // Handle destructured object binding pattern
        if (ts.isParameter(arg) && ts.isObjectBindingPattern(arg.name)) {
            let results = [];
            const destrucuredGroupId = uuidv4();

            results = arg.name.elements.map((element: ts.BindingElement) =>
                this.visitArgument(element)
            );

            results = results.map(result => {
                result.destrucuredGroupId = destrucuredGroupId;
                return result;
            });

            if (
                arg.name.elements &&
                arg.type &&
                ts.isTypeLiteralNode(arg.type) &&
                arg.type.members
            ) {
                if (arg.name.elements.length === arg.type.members.length) {
                    for (let i = 0; i < arg.name.elements.length; i++) {
                        results[i].type = this.classHelper.visitType(arg.type.members[i]);
                    }
                }
            }

            if (
                arg.name.elements &&
                arg.type &&
                (ts.isTypeReferenceNode(arg.type) || arg.type.typeName)
            ) {
                results[0].type = this.classHelper.visitType(arg.type);
            }

            return results;
        } else if (
            (ts.isParameter(arg) || ts.isBindingElement(arg)) &&
            arg.name &&
            (ts.isIdentifier(arg.name) ||
                ts.isObjectBindingPattern(arg.name) ||
                ts.isArrayBindingPattern(arg.name))
        ) {
            const result = {
                name: ts.isIdentifier(arg.name) ? arg.name.text : '',
                type: this.classHelper.visitType(arg),
                deprecated: false,
                deprecationMessage: ''
            };

            if ('dotDotDotToken' in arg && arg.dotDotDotToken) {
                result.dotDotDotToken = true;
            }
            if ('questionToken' in arg && arg.questionToken) {
                result.optional = true;
            }
            if ('initializer' in arg && arg.initializer) {
                result.defaultValue = arg.initializer
                    ? this.classHelper.stringifyDefaultValue(arg.initializer)
                    : undefined;
            }
            if ('type' in arg && arg.type) {
                result.type = this.mapType(arg.type.kind);
                if (
                    arg.type.kind === SyntaxKind.TypeReference &&
                    'typeName' in arg.type &&
                    (arg.type as ts.TypeReferenceNode).typeName
                ) {
                    result.type = (arg.type as ts.TypeReferenceNode).typeName.getText?.() ?? '';
                }
            }
            const jsdoctags = this.jsdocParserUtil.getJSDocs(arg);

            if (jsdoctags?.[0]?.tags) {
                this.checkForDeprecation(jsdoctags[0].tags, result);
            }
            return result;
        }
        // fallback for unknown node
        return {};
    }

    private mapType(type): string | undefined {
        switch (type) {
            case SyntaxKind.NullKeyword:
                return 'null';
            case SyntaxKind.AnyKeyword:
                return 'any';
            case SyntaxKind.BooleanKeyword:
                return 'boolean';
            case SyntaxKind.NeverKeyword:
                return 'never';
            case SyntaxKind.NumberKeyword:
                return 'number';
            case SyntaxKind.StringKeyword:
                return 'string';
            case SyntaxKind.UndefinedKeyword:
                return 'undefined';
            case SyntaxKind.TypeReference:
                return 'typeReference';
        }
    }

    private hasPrivateJSDocTag(tags: string | any[]): boolean {
        let result = false;
        if (tags) {
            tags.forEach((tag: { tagName: { text: string } }) => {
                if (tag.tagName?.text && tag.tagName.text === 'private') {
                    result = true;
                }
            });
        }
        return result;
    }

    private visitFunctionDeclaration(method: ts.FunctionDeclaration) {
        const methodName = method.name ? method.name.text : 'Unnamed function';
        const resultArguments = [];
        const result = {
            deprecated: false,
            deprecationMessage: '',
            name: methodName
        };

        for (let i = 0; i < method.parameters.length; i++) {
            const argument = method.parameters[i];
            if (argument) {
                const argumentParsed = this.visitArgument(argument);
                if (argumentParsed.length > 0) {
                    for (let j = 0; j < argumentParsed.length; j++) {
                        const argumentParsedInside = argumentParsed[j];
                        argumentParsedInside.destructuredParameter = true;
                        resultArguments.push(argumentParsedInside);
                    }
                } else {
                    resultArguments.push(argumentParsed);
                }
            }
        }

        result.args = resultArguments;

        const jsdoctags = this.jsdocParserUtil.getJSDocs(method);

        if (typeof method.type !== 'undefined') {
            result.returnType = this.classHelper.visitType(method.type);
        }

        if (method.modifiers) {
            if (method.modifiers.length > 0) {
                let kinds = method.modifiers
                    .map(modifier => {
                        return modifier.kind;
                    })
                    .reverse();
                if (
                    kinds.includes(SyntaxKind.PublicKeyword) &&
                    kinds.includes(SyntaxKind.StaticKeyword)
                ) {
                    kinds = kinds.filter(kind => kind !== SyntaxKind.PublicKeyword);
                }
            }
        }
        if (jsdoctags?.[0]?.tags) {
            const tags = jsdoctags[0].tags;
            this.checkForDeprecation(tags, result);
            result.jsdoctags = markedtags(tags);
            for (const tag of tags) {
                if (tag.tagName) {
                    if (tag.tagName.text) {
                        if (tag.tagName.text.includes('ignore')) {
                            result.ignore = true;
                        }
                    }
                }
            }
        }
        if (result.jsdoctags && result.jsdoctags.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args, result.jsdoctags);
        } else if (result.args.length > 0) {
            result.jsdoctags = mergeTagsAndArgs(result.args);
        }
        return result;
    }

    private visitVariableDeclaration(node: ts.VariableStatement) {
        if (node.declarationList?.declarations) {
            for (let i = 0; i < node.declarationList.declarations.length; i++) {
                const decl = node.declarationList.declarations[i];
                if (ts.isVariableDeclaration(decl) && ts.isIdentifier(decl.name)) {
                    const result = {
                        name: decl.name.text,
                        defaultValue: decl.initializer
                            ? this.classHelper.stringifyDefaultValue(decl.initializer)
                            : undefined,
                        deprecated: false,
                        deprecationMessage: ''
                    };
                    if (decl.initializer) {
                        result.initializer = decl.initializer;
                    }
                    if (decl.type) {
                        result.type = this.classHelper.visitType(decl.type);
                    }
                    if (typeof result.type === 'undefined' && decl.initializer) {
                        result.type = kindToType(decl.initializer.kind);
                    }
                    const jsdoctags = this.jsdocParserUtil.getJSDocs(decl);
                    if (jsdoctags && jsdoctags.length > 0 && jsdoctags[0].tags) {
                        this.checkForDeprecation(jsdoctags[0].tags, result);
                    }
                    return result;
                }
            }
        }
    }

    private visitEnumTypeAliasFunctionDeclarationDescription(
        node: ts.FunctionDeclaration | ts.EnumDeclaration | ts.TypeAliasDeclaration
    ): string {
        let description = '';
        // Use type guard for jsDoc property
        const jsDocs = node.jsDoc as ts.JSDoc[] | undefined;
        if (Array.isArray(jsDocs) && jsDocs.length > 0) {
            const firstDoc = jsDocs[0];
            if ('comment' in firstDoc && typeof firstDoc.comment !== 'undefined') {
                const rawDescription = this.jsdocParserUtil.parseJSDocNode(firstDoc);
                description = markedAcl(rawDescription);
            }
        }
        return description;
    }

    private visitEnumDeclaration(node: ts.EnumDeclaration) {
        const result = {
            deprecated: false,
            deprecationMessage: '',
            name: ts.isIdentifier(node.name) ? node.name.text : '',
            members: []
        };
        if (node.members) {
            for (const memberNode of node.members) {
                const member = {
                    name: ts.isIdentifier(memberNode.name) ? memberNode.name.text : '',
                    deprecated: false,
                    deprecationMessage: '',
                    value: undefined as string | number | undefined
                };
                if (memberNode.initializer && ts.isLiteralExpression(memberNode.initializer)) {
                    member.value = IsKindType.NUMBER(memberNode.initializer.kind)
                        ? Number(memberNode.initializer.text)
                        : memberNode.initializer.text;
                }
                const memberjsdoctags = this.jsdocParserUtil.getJSDocs(memberNode);
                if (memberjsdoctags?.[0]?.tags) {
                    this.checkForDeprecation(memberjsdoctags[0].tags, member);
                }
                result.members.push(member);
            }
        }
        const jsdoctags = this.jsdocParserUtil.getJSDocs(node);
        if (jsdoctags?.[0]?.tags) {
            this.checkForDeprecation(jsdoctags[0].tags, result);
        }
        return result;
    }

    private visitEnumDeclarationForRoutes(fileName: string, node: ts.Statement) {
        if (ts.isVariableStatement(node)) {
            for (const decl of node.declarationList.declarations) {
                if (decl.initializer) {
                    const data = new CodeGenerator().generate(decl.initializer);
                    RouterParserUtil.addRoute({
                        name: ts.isIdentifier(decl.name) ? decl.name.text : '',
                        data: RouterParserUtil.cleanRawRoute(data),
                        filename: fileName
                    });
                    return [
                        {
                            routes: data
                        }
                    ];
                }
            }
        }
        return [];
    }

    private getRouteIO(filename: string, sourceFile: ts.SourceFile, node: ts.Node) {
        let res;
        if (sourceFile.statements) {
            res = sourceFile.statements.reduce((directive, statement) => {
                if (RouterParserUtil.isVariableRoutes(statement)) {
                    if (statement.pos === node.pos && statement.end === node.end) {
                        return directive.concat(
                            this.visitEnumDeclarationForRoutes(filename, statement)
                        );
                    }
                }

                return directive;
            }, []);
            return res[0] || {};
        }
        return {};
    }

    private getClassIO(
        filename: string,
        sourceFile: ts.SourceFile,
        node: ts.Node,
        fileBody: ts.ModuleBlock,
        astFile: ts.SourceFile
    ) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        const reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        const res = reducedSource.reduce((directive, statement: ts.Node) => {
            if (ts.isClassDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(
                        this.classHelper.visitClassDeclaration(
                            filename,
                            statement,
                            sourceFile,
                            astFile
                        )
                    );
                }
            }

            return directive;
        }, []);

        return res[0] || {};
    }

    private getInterfaceIO(
        filename: string,
        sourceFile: ts.SourceFile,
        node: ts.Node,
        fileBody: ts.ModuleBlock,
        astFile: ts.SourceFile
    ) {
        /**
         * Copyright https://github.com/ng-bootstrap/ng-bootstrap
         */
        const reducedSource = fileBody ? fileBody.statements : sourceFile.statements;
        const res = reducedSource.reduce((directive: string | any[], statement: ts.Node) => {
            if (ts.isInterfaceDeclaration(statement)) {
                if (statement.pos === node.pos && statement.end === node.end) {
                    return directive.concat(
                        this.classHelper.visitClassDeclaration(
                            filename,
                            statement,
                            sourceFile,
                            astFile
                        )
                    );
                }
            }

            return directive;
        }, []);

        return res[0] || {};
    }
}
