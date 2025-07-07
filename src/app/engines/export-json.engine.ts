import * as path from 'node:path';
import { logger } from '../../utils/logger';
import Configuration from '../configuration';
import type { ExportData } from '../interfaces/export-data.interface';
import type { AngularNgModuleNode } from '../nodes/angular-ngmodule-node';
import DependenciesEngine from './dependencies.engine';
import FileEngine from './file.engine';

const traverse = require('neotraverse/legacy');

export class ExportJsonEngine {
    private static instance: ExportJsonEngine;
    private constructor() {}
    public static getInstance() {
        if (!ExportJsonEngine.instance) {
            ExportJsonEngine.instance = new ExportJsonEngine();
        }
        return ExportJsonEngine.instance;
    }

    public export(outputFolder, data) {
        const exportData: ExportData = {};

        traverse(data).forEach(node => {
            if (node) {
                if (node.parent) {
                    node.parent = undefined;
                }
                if (node.initializer) {
                    node.initializer = undefined;
                }
                if (Configuration.mainData.disableSourceCode) {
                    node.sourceCode = undefined;
                    node.templateData = undefined;
                    node.styleUrlsData = undefined;
                    node.stylesData = undefined;
                }
            }
        });

        exportData.pipes = data.pipes;
        exportData.interfaces = data.interfaces;
        exportData.injectables = data.injectables;
        exportData.guards = data.guards;
        exportData.interceptors = data.interceptors;
        exportData.classes = data.classes;
        exportData.directives = data.directives;
        exportData.components = data.components;
        exportData.modules = this.processModules();
        exportData.miscellaneous = data.miscellaneous;
        if (!Configuration.mainData.disableRoutesGraph) {
            exportData.routes = data.routes;
        }
        if (!Configuration.mainData.disableCoverage) {
            exportData.coverage = data.coverageData;
        }

        return FileEngine.write(
            `${outputFolder + path.sep}/documentation.json`,
            JSON.stringify(exportData, undefined, 4)
        ).catch(err => {
            logger.error('Error during export file generation ', err);
            return Promise.reject(err);
        });
    }

    public processModules() {
        const modules: AngularNgModuleNode[] = DependenciesEngine.getModules();

        const _resultedModules = [];

        for (let moduleNr = 0; moduleNr < modules.length; moduleNr++) {
            const module = modules[moduleNr];
            const moduleElement = {
                name: module.name,
                id: module.id,
                description: module.description,
                rawDescription: module.rawDescription,
                deprecationMessage: module.deprecationMessage,
                deprecated: module.deprecated,
                file: module.file,
                methods: module.methods,
                sourceCode: module.sourceCode,
                children: [
                    {
                        type: 'providers',
                        elements: []
                    },
                    {
                        type: 'declarations',
                        elements: []
                    },
                    {
                        type: 'imports',
                        elements: []
                    },
                    {
                        type: 'exports',
                        elements: []
                    },
                    {
                        type: 'bootstrap',
                        elements: []
                    },
                    {
                        type: 'classes',
                        elements: []
                    }
                ]
            };

            for (const provider of module.providers) {
                const providerElement = {
                    name: provider.name
                };
                moduleElement.children[0].elements.push(providerElement);
            }
            for (const declaration of module.declarations) {
                const declarationElement = {
                    name: declaration.name
                };
                moduleElement.children[1].elements.push(declarationElement);
            }
            for (const imp of module.imports) {
                const importElement = {
                    name: imp.name
                };
                moduleElement.children[2].elements.push(importElement);
            }
            for (const exp of module.exports) {
                const exportElement = {
                    name: exp.name
                };
                moduleElement.children[3].elements.push(exportElement);
            }
            for (const bootstrap of module.bootstrap) {
                const bootstrapElement = {
                    name: bootstrap.name
                };
                moduleElement.children[4].elements.push(bootstrapElement);
            }

            _resultedModules.push(moduleElement);
        }

        return _resultedModules;
    }
}

export default ExportJsonEngine.getInstance();
