import { expect } from 'chai';
import { exec, exists, pkg, read, shell, shellAsync, temporaryDir } from '../helpers';
const tmp = temporaryDir();

describe('CLI Analytics tracking', () => {
    const distFolder = `${tmp.name}-tracking`;

    describe('add tracking code', () => {
        let coverageFile;
        before(done => {
            tmp.create(distFolder);
            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/sample-files/tsconfig.simple.json',
                '--gaID',
                'UA-XXXXX-Y',
                '--gaSite',
                'demo',
                '-d',
                distFolder
            ]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            coverageFile = read(`${distFolder}/index.html`);
            done();
        });
        after(() => tmp.clean(distFolder));

        it('it should contain tracking code', () => {
            expect(coverageFile).to.contain('www.google-analytics.com');
            expect(coverageFile).to.contain('demo');
        });
    });
});
