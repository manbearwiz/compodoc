import { expect } from 'chai';
import { exec, exists, pkg, read, shell, shellAsync, temporaryDir } from '../helpers';
const tmp = temporaryDir();

describe('CLI max search results', () => {
    const distFolder = `${tmp.name}-maxSearchResults`;

    describe('custom maxSearchResults', () => {
        let coverageFile;
        before(done => {
            tmp.create(distFolder);
            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/sample-files/tsconfig.simple.json',
                '-d',
                distFolder,
                '--maxSearchResults',
                '20'
            ]);

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            coverageFile = read(`${distFolder}/index.html`);
            done();
        });
        after(() => tmp.clean(distFolder));

        it('it should have a MAX_SEARCH_RESULT of 20', () => {
            expect(coverageFile).to.contain('var MAX_SEARCH_RESULTS = 20;');
        });
    });

    describe('default maxSearchResult', () => {
        let coverageFile;
        before(done => {
            tmp.create(distFolder);
            const ls = shell('node', [
                './bin/index-cli.js',
                '-p',
                './test/fixtures/sample-files/tsconfig.simple.json',
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

        it('it should have a MAX_SEARCH_RESULT of 15', () => {
            expect(coverageFile).to.contain('var MAX_SEARCH_RESULTS = 15;');
        });
    });
});
