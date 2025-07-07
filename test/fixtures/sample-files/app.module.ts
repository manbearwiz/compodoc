import { BrowserModule, NgModule } from '@angular/core';
import { BarComponent } from './bar.component';
import { BarDirective } from './bar.directive';
import { BarModule } from './bar.module';
import { FooComponent } from './foo.component';
import { FooDirective } from './foo.directive';
import { FooModule } from './foo.module';
import { FooService } from './foo.service';

/**
 * AppModule description
 *
 * See {@link BarComponent}
 */
@NgModule({
    declarations: [FooDirective, FooComponent, BarComponent],
    providers: [FooService],
    imports: [BarModule, FooModule],
    bootstrap: [FooComponent]
})
export class AppModule {}
