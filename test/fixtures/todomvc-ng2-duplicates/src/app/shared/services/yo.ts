import { Injectable } from '@angular/core';

export function MyDecorator(type: new () => any) {
    return target => {
        _reflect.defineMetadata('type', type, target);
    };
}

@Injectable({
    providedIn: 'root'
})
@LogClass()
export class MyService {}
