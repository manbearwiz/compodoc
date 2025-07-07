import { EventEmitter, Injectable } from '@angular/core';

/**
 * A simple pubsub service using EventEmitter
 */
@Injectable()
export class EmitterService {
    private static _emitters: { [ID: string]: EventEmitter<any> } = {};

    static get(ID: string): EventEmitter<any> {
        if (!EmitterService._emitters[ID]) EmitterService._emitters[ID] = new EventEmitter();
        return EmitterService._emitters[ID];
    }
}
