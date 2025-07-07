const exec = require('node:child_process').exec;
const fs = require('fs-extra');
const read = file => fs.readFileSync(file).toString();
const copy = (source, dest) => fs.copySync(source, dest);
const spawn = require('node:child_process').spawn;
const tmp = (() => {
    let name = '.tmp-compodoc-test';
    const cleanUp = name => {
        if (fs.existsSync(name)) {
            fs.readdirSync(name).forEach(file => {
                const curdir = path.join(name, file);
                if (fs.statSync(curdir).isDirectory()) {
                    cleanUp(curdir);
                } else {
                    fs.unlinkSync(curdir);
                }
            });
            fs.rmdirSync(name);
        }
    };

    return {
        name,
        copy(source, destination) {
            fs.copySync(source, destination);
        },
        create(param) {
            if (param) name = param;
            if (!fs.existsSync(name)) {
                fs.mkdirSync(name);
            }
        },
        clean(param) {
            if (param) name = param;
            try {
                cleanUp(name);
            } catch (e) {}
        }
    };
})();

let testWatch = false;
let fooCoverageFile;
const reload = () => {
    setTimeout(() => {
        console.log('reload');
        copy('./test/src/bar.component-watch.ts', './test/src/sample-files/bar.component.ts');
    }, 1000);
};
const end = () => {
    copy('./test/src/bar.component.ts', './test/src/sample-files/bar.component.ts');
};
const ls = spawn('node', [
    './bin/index-cli.js',
    '-p',
    './test/src/sample-files/tsconfig.simple.json',
    '-d',
    `${tmp.name}/`,
    '-s',
    '-w'
]);

tmp.clean();
tmp.create();

ls.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
    if (data.indexOf('Watching source') !== -1 && !testWatch) {
        fooCoverageFile = read(`${tmp.name}/coverage.html`);
        testWatch = true;
        console.log('debug: ', fooCoverageFile.indexOf('2/6'));
        if (fooCoverageFile.indexOf('2/6') !== -1) {
            reload();
        } else {
            process.exit(1);
        }
    } else if (data.indexOf('Already watching sources') !== -1) {
        if (fooCoverageFile.indexOf('3/6') !== -1) {
            end();
            process.exit(0);
        } else {
            process.exit(1);
        }
    }
});

ls.stderr.on('data', data => {
    //console.log('stderr: ' + data);
});

ls.on('close', code => {
    //console.log('child process exited with code ' + code);
});
