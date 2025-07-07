const webshot = require('webshot');
const process = require('node:process');
const liveServer = require('live-server');
const helpers = require('../test/dist/helpers.js');
const rimraf = require('rimraf');
const exec = helpers.exec;
const fs = helpers.fs;
const tmp = helpers.temporaryDir();
const THEMES = [
    'gitbook',
    'laravel',
    'original',
    'postmark',
    'readthedocs',
    'stripe',
    'vagrant',
    'material'
];
const len = THEMES.length;
const SHOT_OPTIONS = {
    windowSize: {
        width: 1024,
        height: 768
    },
    customCSS: '.menu{overflow-y:hidden!important;}'
};
const shot = file =>
    new Promise((resolve, reject) => {
        webshot('http://localhost:8080', file, SHOT_OPTIONS, err => {
            console.log('todomvc-ng2 screenshot generated : ', file);
            resolve();
        });
    });
const document = theme => {
    console.log(`Document with ${theme}`);
    let command =
        "node ../bin/index-cli.js -p ./src/tsconfig.json -n 'TodoMVC Angular 2 documentation' ";
    if (theme !== 'gitbook') {
        command += ` --theme ${theme}`;
    }
    return new Promise((resolve, reject) => {
        exec(
            command,
            {
                env: {
                    MODE: 'TESTING'
                }
            },
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject();
                } else {
                    shot(`../screenshots/theme-${theme}.png`).then(() => {
                        resolve();
                    });
                }
            }
        );
    });
};

let i = 0;

tmp.create();
exec(
    `cd ${tmp.name} && git clone https://github.com/compodoc/compodoc-demo-todomvc-angular.git .`,
    {},
    (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
        } else {
            console.log('todomvc-ng2 git clone');
            process.chdir(tmp.name);

            liveServer.start({
                root: './documentation',
                open: false,
                quiet: true,
                logLevel: 0
            });

            const loop = () => {
                if (i < len) {
                    document(THEMES[i])
                        .then(() => {
                            i++;
                            loop();
                        })
                        .catch(error => {
                            console.log('document error: ', error);
                        });
                } else {
                    console.log('END');
                    liveServer.shutdown();
                    process.exit(0);
                    rimraf(tmp.name);
                }
            };
            loop();
        }
    }
);
