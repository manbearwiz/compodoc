import { BrowserModule, NgModule } from '@angular/core';
import { FomsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [BrowserModule, FomsModule],
    exports: [RouterModule, HttpModule]
})
export class FooModule {}
