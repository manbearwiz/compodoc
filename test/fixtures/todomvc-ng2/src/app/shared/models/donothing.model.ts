import { LogClass } from '../decorators/log.decorator';
import { Nothing } from '../decorators/nothing.decorator';

@Nothing()
export class DoNothing {
    aname: string;
    doNothing() {
        // nothing here
    }
}
