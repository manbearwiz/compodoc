import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '../../../components/button/button';
import { CodeHighlighterModule } from '../../../components/codehighlighter/codehighlighter';
import { DropdownModule } from '../../../components/dropdown/dropdown';
import { GrowlModule } from '../../../components/growl/growl';
import { InputTextModule } from '../../../components/inputtext/inputtext';
import { InputTextareaModule } from '../../../components/inputtextarea/inputtextarea';
import { PanelModule } from '../../../components/panel/panel';
import { TabViewModule } from '../../../components/tabview/tabview';
import { ValidationDemo } from './validationdemo';
import { ValidationDemoRoutingModule } from './validationdemo-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidationDemoRoutingModule,
        GrowlModule,
        PanelModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        TabViewModule,
        CodeHighlighterModule
    ],
    declarations: [ValidationDemo]
})
export class ValidationDemoModule {}
