import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EmitterService } from 'app/shared/services/emitter.service';

import { footerModuleComponents } from './index';

/**
 * The footer module
 */
@NgModule({
    imports: [BrowserModule],
    declarations: [...footerModuleComponents],
    exports: [FooterComponent, EmitterService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class FooterModule {}
