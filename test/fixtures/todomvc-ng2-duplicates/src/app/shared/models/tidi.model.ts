import { Direction } from '../miscellaneous/miscellaneous';

import { LogClass, LogMethod, LogProperty, LogPropertyWithArgs } from '../decorators/log.decorator';

/**
 * The tidi class
 */
@LogClass
export class Tidi {
    completed: boolean;
    afunc(a: string, b: string): { passwordMismatch: boolean } | null {
        return true ? { passwordMismatch: true } : null;
    }
}
