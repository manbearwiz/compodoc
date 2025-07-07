import { expect } from 'chai';
import { exec, exists, pkg, read, shell, shellAsync, temporaryDir } from '../helpers';

const tmp = temporaryDir();

describe('CLI exclude from tsconfig', () => {
    const distFolder = `${tmp.name}-exclude`;

    describe('when specific files are excluded in tsconfig', () => {
        before(done => {
            tmp.create(distFolder);

            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/sample-files/tsconfig.exclude.json',
                '-d',
                distFolder
            ]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should not create files excluded', () => {
            let isFileExists = exists(`${distFolder}/components/BarComponent.html`);
            expect(isFileExists).to.be.false;
            isFileExists = exists(`${distFolder}/modules/BarModule.html`);
            expect(isFileExists).to.be.false;
        });
    });
});
