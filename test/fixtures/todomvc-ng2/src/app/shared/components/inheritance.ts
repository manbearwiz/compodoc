import { Component, Input } from '@angular/core';

@Component({ template: '' })
export abstract class MotherComponent {
    abstract myProp: string;

    abstract myMethod(): string;
}

@Component({ template: '' })
export class SonComponent extends MotherComponent {
    myProp: string;

    myMethod(): string {
        return 'Implementation A';
    }
}

@Component({ template: '' })
export class GrandsonComponent extends SonComponent {
    myMethod(): string {
        return 'Implementation B';
    }
}
