import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { ExampleComponent } from './example.component';

const routes: Routes = [{ path: '', component: ExampleComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class ExampleRoutingModule {}
