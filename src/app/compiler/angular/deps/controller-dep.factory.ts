import type { ts } from 'ts-morph';
import type { IDep } from '../dependencies.interfaces';

const crypto = require('node:crypto');

export class ControllerDepFactory {
    public create(
        file: any,
        srcFile: ts.SourceFile,
        name: string,
        properties: readonly ts.ObjectLiteralElementLike[],
        IO: any
    ): IControllerDep {
        const sourceCode = srcFile.getText();
        const hash = crypto.createHash('sha512').update(sourceCode).digest('hex');
        const infos: IControllerDep = {
            name,
            id: `controller-${name}-${hash}`,
            file: file,
            methodsClass: IO.methods,
            type: 'controller',
            description: IO.description,
            rawdescription: IO.rawdescription,
            sourceCode: srcFile.text,
            deprecated: IO.deprecated,
            deprecationMessage: IO.deprecationMessage
        };
        if (properties && properties.length === 1) {
            if (properties[0].text) {
                infos.prefix = properties[0].text;
            }
        }
        if (IO.extends) {
            infos.extends = IO.extends;
        }
        return infos;
    }
}

export interface IControllerDep extends IDep {
    file: any;
    sourceCode: string;
    description: string;
    rawdescription: string;
    prefix?: string;
    methodsClass: any[];
    deprecated: boolean;
    deprecationMessage: string;
    extends?: any;
}
