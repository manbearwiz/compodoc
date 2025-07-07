import { Component, Input, type OnInit, Output } from '@angular/core';

import { InputBase } from './input-base';

/**
 * The main component
 */
@Component({
    selector: 'app-yo',
    template: 'YO'
})
export class AnotherComponent implements OnInit {
    @Input() public itisme: string;

    @Output() public myoutput;

    public myprop;

    ngOnInit() {}
}
