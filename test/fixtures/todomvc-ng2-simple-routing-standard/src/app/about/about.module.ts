import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

import { FooterModule } from '../footer';
import { HeaderModule } from '../header';
import { ListModule } from '../list';

/**
 * The header module
 *
 * Just embedding <about> component and it's routing definition in {@link AboutRoutingModule}
 */
@NgModule({
    declarations: [AboutComponent],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,

        HeaderModule.forRoot(),
        ListModule,
        FooterModule,
        AboutRoutingModule
    ],
    exports: [AboutComponent]
})
export class AboutModule {}
