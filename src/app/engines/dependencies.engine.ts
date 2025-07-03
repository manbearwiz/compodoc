import { MiscellaneousData } from '../interfaces/miscellaneous-data.interface';
import { ParsedData } from '../interfaces/parsed-data.interface';
import { RouteInterface } from '../interfaces/routes.interface';

import AngularApiUtil from '../../utils/angular-api.util';
import { IApiSourceResult } from '../../utils/api-source-result.interface';
import { getNamesCompareFn } from '../../utils/utils';

import {
    IEnumDecDep,
    IFunctionDecDep,
    IGuardDep,
    IInjectableDep,
    IInterceptorDep,
    IInterfaceDep,
    IPipeDep,
    ITypeAliasDecDep
} from '../compiler/angular/dependencies.interfaces';

import { IComponentDep } from '../compiler/angular/deps/component-dep.factory';
import { IControllerDep } from '../compiler/angular/deps/controller-dep.factory';
import { IDirectiveDep } from '../compiler/angular/deps/directive-dep.factory';
import { IModuleDep } from '../compiler/angular/deps/module-dep.factory';

const traverse = require('neotraverse/legacy');

export class DependenciesEngine {
    public rawData: ParsedData;
    public modules: Object[];
    public rawModules: Object[];
    public rawModulesForOverview: Object[];
    public components: Object[];
    public controllers: Object[];
    public entities: Object[];
    public directives: Object[];
    public injectables: Object[];
    public interceptors: Object[];
    public guards: Object[];
    public interfaces: Object[];
    public routes: RouteInterface;
    public pipes: Object[];
    public classes: Object[];
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
        traverse(data).forEach(function (node) {
            if (node) {
                if (node.parent) {
                    delete node.parent;
                }
                if (node.initializer) {
                    delete node.initializer;
                }
            }
        });
        this.rawData = data;
        this.modules = [...this.rawData.modules].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.rawModulesForOverview = [...data.modulesForGraph].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.rawModules = [...data.modulesForGraph].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.components = [...this.rawData.components].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.controllers = [...this.rawData.controllers].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.entities = [...this.rawData.entities].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.directives = [...this.rawData.directives].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.injectables = [...this.rawData.injectables].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.interceptors = [...this.rawData.interceptors].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.guards = [...this.rawData.guards].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.interfaces = [...this.rawData.interfaces].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.pipes = [...this.rawData.pipes].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        this.classes = [...this.rawData.classes].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
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
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (typeof name !== 'undefined') {
                    if (typeof file !== 'undefined') {
                        if (
                            name === data[i].name &&
                            file.replace(/\\/g, '/').indexOf(data[i].file) !== -1
                        ) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 2;
                        } else if (
                            name.indexOf(data[i].name) !== -1 &&
                            file.replace(/\\/g, '/').indexOf(data[i].file) !== -1
                        ) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 1;
                        }
                    } else {
                        if (name === data[i].name) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 2;
                        } else if (name.indexOf(data[i].name) !== -1) {
                            nameFoundCounter += 1;
                            _result.data = data[i];
                            _result.score = 1;
                        }
                    }
                }
            }

            // Prevent wrong matching like MultiSelectOptionDirective with SelectOptionDirective, or QueryParamGroupService with QueryParamGroup
            if (nameFoundCounter > 1) {
                let found = false;
                for (let i = 0; i < data.length; i++) {
                    if (typeof name !== 'undefined') {
                        if (typeof file !== 'undefined') {
                            if (name === data[i].name) {
                                found = true;
                                _result.data = data[i];
                                _result.score = 2;
                            }
                        } else {
                            if (name === data[i].name) {
                                found = true;
                                _result.data = data[i];
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
        const processDuplicates = (element, index, array) => {
            const elementsWithSameName = array.filter(el => el.name === element.name);
            if (elementsWithSameName.length > 1) {
                // First element is the reference for duplicates
                for (let i = 1; i < elementsWithSameName.length; i++) {
                    let elementToEdit = elementsWithSameName[i];
                    if (typeof elementToEdit.isDuplicate === 'undefined') {
                        elementToEdit.isDuplicate = true;
                        elementToEdit.duplicateId = i;
                        elementToEdit.duplicateName =
                            elementToEdit.name + '-' + elementToEdit.duplicateId;
                        elementToEdit.id = elementToEdit.id + '-' + elementToEdit.duplicateId;
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
        const searchFunctions: Array<() => IApiSourceResult<any>> = [
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
        let bestResult = undefined;

        for (let searchFunction of searchFunctions) {
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
            updatedData.modules.forEach((module: IModuleDep) => {
                const idx = this.modules.findIndex(m => m.name === module.name);
                if (idx !== -1) {
                    this.modules[idx] = module;
                }
            });
        }
        if (updatedData.components.length > 0) {
            updatedData.components.forEach((component: IComponentDep) => {
                const idx = this.components.findIndex(c => c.name === component.name);
                if (idx !== -1) {
                    this.components[idx] = component;
                }
            });
        }
        if (updatedData.controllers.length > 0) {
            updatedData.controllers.forEach((controller: IControllerDep) => {
                const idx = this.controllers.findIndex(c => c.name === controller.name);
                if (idx !== -1) {
                    this.controllers[idx] = controller;
                }
            });
        }
        if (updatedData.entities.length > 0) {
            updatedData.entities.forEach((entity: IControllerDep) => {
                const idx = this.entities.findIndex(e => e.name === entity.name);
                if (idx !== -1) {
                    this.entities[idx] = entity;
                }
            });
        }
        if (updatedData.directives.length > 0) {
            updatedData.directives.forEach((directive: IDirectiveDep) => {
                const idx = this.directives.findIndex(d => d.name === directive.name);
                if (idx !== -1) {
                    this.directives[idx] = directive;
                }
            });
        }
        if (updatedData.injectables.length > 0) {
            updatedData.injectables.forEach((injectable: IInjectableDep) => {
                const idx = this.injectables.findIndex(i => i.name === injectable.name);
                if (idx !== -1) {
                    this.injectables[idx] = injectable;
                }
            });
        }
        if (updatedData.interceptors.length > 0) {
            updatedData.interceptors.forEach((interceptor: IInterceptorDep) => {
                const idx = this.interceptors.findIndex(i => i.name === interceptor.name);
                if (idx !== -1) {
                    this.interceptors[idx] = interceptor;
                }
            });
        }
        if (updatedData.guards.length > 0) {
            updatedData.guards.forEach((guard: IGuardDep) => {
                const idx = this.guards.findIndex(g => g.name === guard.name);
                if (idx !== -1) {
                    this.guards[idx] = guard;
                }
            });
        }
        if (updatedData.interfaces.length > 0) {
            updatedData.interfaces.forEach((int: IInterfaceDep) => {
                const idx = this.interfaces.findIndex(i => i.name === int.name);
                if (idx !== -1) {
                    this.interfaces[idx] = int;
                }
            });
        }
        if (updatedData.pipes.length > 0) {
            updatedData.pipes.forEach((pipe: IPipeDep) => {
                const idx = this.pipes.findIndex(p => p.name === pipe.name);
                if (idx !== -1) {
                    this.pipes[idx] = pipe;
                }
            });
        }
        if (updatedData.classes.length > 0) {
            updatedData.classes.forEach((classe: any) => {
                const idx = this.classes.findIndex(c => c.name === classe.name);
                if (idx !== -1) {
                    this.classes[idx] = classe;
                }
            });
        }
        /**
         * Miscellaneous update
         */
        if (updatedData.miscellaneous.variables.length > 0) {
            _.forEach(updatedData.miscellaneous.variables, (variable: any) => {
                const _index = _.findIndex(this.miscellaneous.variables, {
                    name: variable.name,
                    file: variable.file
                });
                this.miscellaneous.variables[_index] = variable;
            });
        }
        if (updatedData.miscellaneous.functions.length > 0) {
            _.forEach(updatedData.miscellaneous.functions, (func: IFunctionDecDep) => {
                const _index = _.findIndex(this.miscellaneous.functions, {
                    name: func.name,
                    file: func.file
                });
                this.miscellaneous.functions[_index] = func;
            });
        }
        if (updatedData.miscellaneous.typealiases.length > 0) {
            _.forEach(updatedData.miscellaneous.typealiases, (typealias: ITypeAliasDecDep) => {
                const _index = _.findIndex(this.miscellaneous.typealiases, {
                    name: typealias.name,
                    file: typealias.file
                });
                this.miscellaneous.typealiases[_index] = typealias;
            });
        }
        if (updatedData.miscellaneous.enumerations.length > 0) {
            _.forEach(updatedData.miscellaneous.enumerations, (enumeration: IEnumDecDep) => {
                const _index = _.findIndex(this.miscellaneous.enumerations, {
                    name: enumeration.name,
                    file: enumeration.file
                });
                this.miscellaneous.enumerations[_index] = enumeration;
            });
        }
        this.prepareMiscellaneous();
    }

    public findInCompodoc(name: string) {
        const mergedData = _.concat(
            [],
            this.modules,
            this.components,
            this.controllers,
            this.entities,
            this.directives,
            this.injectables,
            this.interceptors,
            this.guards,
            this.interfaces,
            this.pipes,
            this.classes,
            this.miscellaneous.enumerations,
            this.miscellaneous.typealiases,
            this.miscellaneous.variables,
            this.miscellaneous.functions
        );
        const result = _.find(mergedData, { name: name } as any);
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
        return _.find(this.modules, ['name', name]);
    }

    public getRawModule(name: string): any {
        return _.find(this.rawModules, ['name', name]);
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
