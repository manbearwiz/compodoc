import * as _ from 'lodash';
import AngularApiUtil from '../../utils/angular-api.util';
import type { IApiSourceResult } from '../../utils/api-source-result.interface';
import { getNamesCompareFn } from '../../utils/utils';
import type {
    IEnumDecDep,
    IFunctionDecDep,
    IGuardDep,
    IInjectableDep,
    IInterceptorDep,
    IInterfaceDep,
    IPipeDep,
    ITypeAliasDecDep
} from '../compiler/angular/dependencies.interfaces';
import type { IComponentDep } from '../compiler/angular/deps/component-dep.factory';
import type { IControllerDep } from '../compiler/angular/deps/controller-dep.factory';
import type { IDirectiveDep } from '../compiler/angular/deps/directive-dep.factory';
import type { IModuleDep } from '../compiler/angular/deps/module-dep.factory';
import type { MiscellaneousData } from '../interfaces/miscellaneous-data.interface';
import type { ParsedData } from '../interfaces/parsed-data.interface';
import type { RouteInterface } from '../interfaces/routes.interface';

const traverse = require('neotraverse/legacy');

export class DependenciesEngine {
    public rawData: ParsedData;
    public modules: object[];
    public rawModules: object[];
    public rawModulesForOverview: object[];
    public components: object[];
    public controllers: object[];
    public entities: object[];
    public directives: object[];
    public injectables: object[];
    public interceptors: object[];
    public guards: object[];
    public interfaces: object[];
    public routes: RouteInterface;
    public pipes: object[];
    public classes: object[];
    public miscellaneous: MiscellaneousData = {
        variables: [],
        functions: [],
        typealiases: [],
        enumerations: [],
        groupedVariables: [],
        groupedFunctions: [],
        groupedEnumerations: [],
        groupedTypeAliases: []
    };

    private static instance: DependenciesEngine;
    private constructor() {}
    public static getInstance() {
        if (!DependenciesEngine.instance) {
            DependenciesEngine.instance = new DependenciesEngine();
        }
        return DependenciesEngine.instance;
    }

    private updateModulesDeclarationsExportsTypes() {
        const mergeTypes = entry => {
            const directive = this.findInCompodocDependencies(
                entry.name,
                this.directives,
                entry.file
            );
            if (typeof directive.data !== 'undefined') {
                entry.type = 'directive';
                entry.id = directive.data.id;
            }

            const component = this.findInCompodocDependencies(
                entry.name,
                this.components,
                entry.file
            );
            if (typeof component.data !== 'undefined') {
                entry.type = 'component';
                entry.id = component.data.id;
            }

            const pipe = this.findInCompodocDependencies(entry.name, this.pipes, entry.file);
            if (typeof pipe.data !== 'undefined') {
                entry.type = 'pipe';
                entry.id = pipe.data.id;
            }
        };

        this.modules.forEach(module => {
            module.declarations.forEach(declaration => {
                mergeTypes(declaration);
            });
            module.exports.forEach(expt => {
                mergeTypes(expt);
            });
            module.entryComponents.forEach(ent => {
                mergeTypes(ent);
            });
        });
    }

    public init(data: ParsedData) {
        traverse(data).forEach(node => {
            if (node) {
                if (node.parent) {
                    node.parent = undefined;
                }
                if (node.initializer) {
                    node.initializer = undefined;
                }
            }
        });
        this.rawData = data;
        this.modules = _.sortBy(this.rawData.modules, [el => el.name.toLowerCase()]);
        this.rawModulesForOverview = _.sortBy(data.modulesForGraph, [el => el.name.toLowerCase()]);
        this.rawModules = _.sortBy(data.modulesForGraph, [el => el.name.toLowerCase()]);
        this.components = _.sortBy(this.rawData.components, [el => el.name.toLowerCase()]);
        this.controllers = _.sortBy(this.rawData.controllers, [el => el.name.toLowerCase()]);
        this.entities = _.sortBy(this.rawData.entities, [el => el.name.toLowerCase()]);
        this.directives = _.sortBy(this.rawData.directives, [el => el.name.toLowerCase()]);
        this.injectables = _.sortBy(this.rawData.injectables, [el => el.name.toLowerCase()]);
        this.interceptors = _.sortBy(this.rawData.interceptors, [el => el.name.toLowerCase()]);
        this.guards = _.sortBy(this.rawData.guards, [el => el.name.toLowerCase()]);
        this.interfaces = _.sortBy(this.rawData.interfaces, [el => el.name.toLowerCase()]);
        this.pipes = _.sortBy(this.rawData.pipes, [el => el.name.toLowerCase()]);
        this.classes = _.sortBy(this.rawData.classes, [el => el.name.toLowerCase()]);
        this.miscellaneous = this.rawData.miscellaneous;
        this.prepareMiscellaneous();
        this.updateModulesDeclarationsExportsTypes();
        this.routes = this.rawData.routesTree;
        this.manageDuplicatesName();
        this.cleanRawModulesNames();
    }

    private cleanRawModulesNames() {
        this.rawModulesForOverview = this.rawModulesForOverview.map(module => {
            module.name = module.name.replace('$', '');
            return module;
        });
    }

    private findInCompodocDependencies(name, data, file?): IApiSourceResult<any> {
        let _result = {
            source: 'internal',
            data: undefined,
            score: 0
        };
        let nameFoundCounter = 0;
        if (data?.length > 0) {
            for (const item of data) {
                if (name !== undefined) {
                    if (file !== undefined) {
                        if (name === item.name && file.replace(/\\/g, '/').includes(item.file)) {
                            nameFoundCounter += 1;
                            _result.data = item;
                            _result.score = 2;
                        } else if (
                            name.includes(item.name) &&
                            file.replace(/\\/g, '/').includes(item.file)
                        ) {
                            nameFoundCounter += 1;
                            _result.data = item;
                            _result.score = 1;
                        }
                    } else {
                        if (name === item.name) {
                            nameFoundCounter += 1;
                            _result.data = item;
                            _result.score = 2;
                        } else if (name.includes(item.name)) {
                            nameFoundCounter += 1;
                            _result.data = item;
                            _result.score = 1;
                        }
                    }
                }
            }

            // Prevent wrong matching like MultiSelectOptionDirective with SelectOptionDirective, or QueryParamGroupService with QueryParamGroup
            if (nameFoundCounter > 1) {
                let found = false;
                for (const item of data) {
                    if (name !== undefined) {
                        if (file !== undefined) {
                            if (name === item.name) {
                                found = true;
                                _result.data = item;
                                _result.score = 2;
                            }
                        } else {
                            if (name === item.name) {
                                found = true;
                                _result.data = item;
                                _result.score = 2;
                            }
                        }
                    }
                }
                if (!found) {
                    _result = {
                        source: 'internal',
                        data: undefined,
                        score: 0
                    };
                }
            }
        }
        return _result;
    }

    private manageDuplicatesName() {
        const processDuplicates = (element, _index, array) => {
            const elementsWithSameName = array?.filter(e => e.name === element.name);
            if (elementsWithSameName.length > 1) {
                // First element is the reference for duplicates
                for (let i = 1; i < elementsWithSameName.length; i++) {
                    const elementToEdit = elementsWithSameName[i];
                    if (typeof elementToEdit.isDuplicate === 'undefined') {
                        elementToEdit.isDuplicate = true;
                        elementToEdit.duplicateId = i;
                        elementToEdit.duplicateName = `${elementToEdit.name}-${elementToEdit.duplicateId}`;
                        elementToEdit.id = `${elementToEdit.id}-${elementToEdit.duplicateId}`;
                    }
                }
            }
            return element;
        };
        this.classes = this.classes.map(processDuplicates);
        this.interfaces = this.interfaces.map(processDuplicates);
        this.injectables = this.injectables.map(processDuplicates);
        this.pipes = this.pipes.map(processDuplicates);
        this.interceptors = this.interceptors.map(processDuplicates);
        this.guards = this.guards.map(processDuplicates);
        this.modules = this.modules.map(processDuplicates);
        this.components = this.components.map(processDuplicates);
        this.controllers = this.controllers.map(processDuplicates);
        this.entities = this.entities.map(processDuplicates);
        this.directives = this.directives.map(processDuplicates);
    }

    public find(name: string): IApiSourceResult<any> | undefined {
        const searchFunctions: (() => IApiSourceResult<any>)[] = [
            () => this.findInCompodocDependencies(name, this.modules),
            () => this.findInCompodocDependencies(name, this.injectables),
            () => this.findInCompodocDependencies(name, this.interceptors),
            () => this.findInCompodocDependencies(name, this.guards),
            () => this.findInCompodocDependencies(name, this.interfaces),
            () => this.findInCompodocDependencies(name, this.classes),
            () => this.findInCompodocDependencies(name, this.components),
            () => this.findInCompodocDependencies(name, this.controllers),
            () => this.findInCompodocDependencies(name, this.entities),
            () => this.findInCompodocDependencies(name, this.directives),
            () => this.findInCompodocDependencies(name, this.miscellaneous.variables),
            () => this.findInCompodocDependencies(name, this.miscellaneous.functions),
            () => this.findInCompodocDependencies(name, this.miscellaneous.typealiases),
            () => this.findInCompodocDependencies(name, this.miscellaneous.enumerations),
            () => AngularApiUtil.findApi(name)
        ];

        let bestScore = 0;
        let bestResult;

        for (const searchFunction of searchFunctions) {
            const result = searchFunction();

            if (result.data && result.score > bestScore) {
                bestScore = result.score;
                bestResult = result;
            }
        }

        return bestResult;
    }

    public update(updatedData): void {
        if (updatedData.modules.length > 0) {
            updatedData.modules?.forEach((module: IModuleDep) => {
                const _index = this.modules?.findIndex(m => m.name === module.name);
                this.modules[_index] = module;
            });
        }
        if (updatedData.components.length > 0) {
            updatedData.components?.forEach((component: IComponentDep) => {
                const _index = this.components?.findIndex(c => c.name === component.name);
                this.components[_index] = component;
            });
        }
        if (updatedData.controllers.length > 0) {
            updatedData.controllers?.forEach((controller: IControllerDep) => {
                const _index = this.controllers?.findIndex(c => c.name === controller.name);
                this.controllers[_index] = controller;
            });
        }
        if (updatedData.entities.length > 0) {
            updatedData.entities?.forEach((entity: IControllerDep) => {
                const _index = this.entities?.findIndex(e => e.name === entity.name);
                this.entities[_index] = entity;
            });
        }
        if (updatedData.directives.length > 0) {
            updatedData.directives?.forEach((directive: IDirectiveDep) => {
                const _index = this.directives?.findIndex(d => d.name === directive.name);
                this.directives[_index] = directive;
            });
        }
        if (updatedData.injectables.length > 0) {
            updatedData.injectables?.forEach((injectable: IInjectableDep) => {
                const _index = this.injectables?.findIndex(i => i.name === injectable.name);
                this.injectables[_index] = injectable;
            });
        }
        if (updatedData.interceptors.length > 0) {
            updatedData.interceptors?.forEach((interceptor: IInterceptorDep) => {
                const _index = this.interceptors?.findIndex(i => i.name === interceptor.name);
                this.interceptors[_index] = interceptor;
            });
        }
        if (updatedData.guards.length > 0) {
            updatedData.guards?.forEach((guard: IGuardDep) => {
                const _index = this.guards?.findIndex(g => g.name === guard.name);
                this.guards[_index] = guard;
            });
        }
        if (updatedData.interfaces.length > 0) {
            updatedData.interfaces?.forEach((int: IInterfaceDep) => {
                const _index = this.interfaces?.findIndex(i => i.name === int.name);
                this.interfaces[_index] = int;
            });
        }
        if (updatedData.pipes.length > 0) {
            updatedData.pipes?.forEach((pipe: IPipeDep) => {
                const _index = this.pipes?.findIndex(p => p.name === pipe.name);
                this.pipes[_index] = pipe;
            });
        }
        if (updatedData.classes.length > 0) {
            updatedData.classes?.forEach((classe: any) => {
                const _index = this.classes?.findIndex(c => c.name === classe.name);
                this.classes[_index] = classe;
            });
        }
        /**
         * Miscellaneous update
         */
        if (updatedData.miscellaneous.variables.length > 0) {
            updatedData.miscellaneous.variables?.forEach((variable: any) => {
                const _index = this.miscellaneous.variables?.findIndex(
                    v => v.name === variable.name && v.file === variable.file
                );
                this.miscellaneous.variables[_index] = variable;
            });
        }
        if (updatedData.miscellaneous.functions.length > 0) {
            updatedData.miscellaneous.functions?.forEach((func: IFunctionDecDep) => {
                const _index = this.miscellaneous.functions?.findIndex(
                    f => f.name === func.name && f.file === func.file
                );
                this.miscellaneous.functions[_index] = func;
            });
        }
        if (updatedData.miscellaneous.typealiases.length > 0) {
            updatedData.miscellaneous.typealiases?.forEach((typealias: ITypeAliasDecDep) => {
                const _index = this.miscellaneous.typealiases?.findIndex(
                    t => t.name === typealias.name && t.file === typealias.file
                );
                this.miscellaneous.typealiases[_index] = typealias;
            });
        }
        if (updatedData.miscellaneous.enumerations.length > 0) {
            updatedData.miscellaneous.enumerations?.forEach((enumeration: IEnumDecDep) => {
                const _index = this.miscellaneous.enumerations?.findIndex(
                    e => e.name === enumeration.name && e.file === enumeration.file
                );
                this.miscellaneous.enumerations[_index] = enumeration;
            });
        }
        this.prepareMiscellaneous();
    }

    public findInCompodoc(name: string) {
        const mergedData = [
            ...this.modules,
            ...this.components,
            ...this.controllers,
            ...this.entities,
            ...this.directives,
            ...this.injectables,
            ...this.interceptors,
            ...this.guards,
            ...this.interfaces,
            ...this.pipes,
            ...this.classes,
            ...this.miscellaneous.enumerations,
            ...this.miscellaneous.typealiases,
            ...this.miscellaneous.variables,
            ...this.miscellaneous.functions
        ];
        const result = mergedData.find((item: any) => item.name === name);
        return result || false;
    }

    private prepareMiscellaneous() {
        this.miscellaneous.variables.sort(getNamesCompareFn());
        this.miscellaneous.functions.sort(getNamesCompareFn());
        this.miscellaneous.enumerations.sort(getNamesCompareFn());
        this.miscellaneous.typealiases.sort(getNamesCompareFn());
        // group each subgoup by file
        this.miscellaneous.groupedVariables = _.groupBy(this.miscellaneous.variables, 'file');
        this.miscellaneous.groupedFunctions = _.groupBy(this.miscellaneous.functions, 'file');
        this.miscellaneous.groupedEnumerations = _.groupBy(this.miscellaneous.enumerations, 'file');
        this.miscellaneous.groupedTypeAliases = _.groupBy(this.miscellaneous.typealiases, 'file');
    }

    public getModule(name: string) {
        return this.modules?.find((item: any) => item.name === name);
    }

    public getRawModule(name: string): any {
        return this.rawModules?.find((item: any) => item.name === name);
    }

    public getModules() {
        return this.modules;
    }

    public getComponents() {
        return this.components;
    }

    public getControllers() {
        return this.controllers;
    }

    public getEntities() {
        return this.entities;
    }

    public getDirectives() {
        return this.directives;
    }

    public getInjectables() {
        return this.injectables;
    }

    public getInterceptors() {
        return this.interceptors;
    }

    public getGuards() {
        return this.guards;
    }

    public getInterfaces() {
        return this.interfaces;
    }

    public getRoutes() {
        return this.routes;
    }

    public getPipes() {
        return this.pipes;
    }

    public getClasses() {
        return this.classes;
    }

    public getMiscellaneous() {
        return this.miscellaneous;
    }
}

export default DependenciesEngine.getInstance();
