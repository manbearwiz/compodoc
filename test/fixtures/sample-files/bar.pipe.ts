import { type OnDestroy, Pipe, type PipeTransform } from '@angular/core';

@Pipe({
    name: 'bar',
    standalone: true
})
export class BarPipe implements PipeTransform, OnDestroy {
    transform(value, args) {
        return 'StandAlone Pipe ;)';
    }

    ngOnDestroy(): void {}
}
