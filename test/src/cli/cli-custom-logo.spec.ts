import { expect } from 'chai';
import { exec, exists, pkg, read, shell, shellAsync, stats, temporaryDir } from '../helpers';
const tmp = temporaryDir();

interface Image {
    size: number;
}

describe('CLI custom logo', () => {
    const distFolder = `${tmp.name}-logo`;

    describe('when specifying a custom logo png image', () => {
        before(done => {
            tmp.create(distFolder);
            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/todomvc-ng2/src/tsconfig.json',
                '-d',
                distFolder,
                '--customLogo',
                './test/fixtures/todomvc-ng2/logo.png'
            ]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }

            done();
        });
        after(() => tmp.clean(distFolder));

        it('should have copied the customLogo', () => {
            const isFileExists = exists(`${distFolder}/images/logo.png`);
            expect(isFileExists).to.be.true;
            const originalFileSize = (stats('test/fixtures/todomvc-ng2/logo.png') as Image).size;
            const copiedFileSize = (stats(`${distFolder}/images/logo.png`) as Image).size;
            expect(originalFileSize).to.equal(copiedFileSize);
        });
    });

    describe('when specifying a custom logo svg image', () => {
        before(done => {
            tmp.create(distFolder);
            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/todomvc-ng2/src/tsconfig.json',
                '-d',
                distFolder,
                '--customLogo',
                './test/fixtures/todomvc-ng2/logo.svg'
            ]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }

            done();
        });
        after(() => tmp.clean(distFolder));

        it('should have copied the customLogo', () => {
            const isFileExists = exists(`${distFolder}/images/logo.svg`);
            expect(isFileExists).to.be.true;
            const originalFileSize = (stats('test/fixtures/todomvc-ng2/logo.svg') as Image).size;
            const copiedFileSize = (stats(`${distFolder}/images/logo.svg`) as Image).size;
            expect(originalFileSize).to.equal(copiedFileSize);
        });
    });

    describe('when not specifying a custom logo svg image', () => {
        before(done => {
            tmp.create(distFolder);
            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/todomvc-ng2/src/tsconfig.json',
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

        it('should not have copied the customLogo', () => {
            const isFileExists = exists(`${distFolder}/images/logo.svg`);
            expect(isFileExists).to.not.be.true;
        });
    });
});
