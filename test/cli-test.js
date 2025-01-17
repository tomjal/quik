'use strict';

const test = require('ava');
const path = require('path');
const child_process = require('child_process');
const fs = require('fs');
const del = require('del');
const mkdirp = require('mkdirp');

const TESTDIR = '/tmp/quik-test-' + Date.now();
const PROJECT_NAME = 'AwesomeProject';

test.before('setup', () => del(TESTDIR, { force: true }).then(() =>
    new Promise((resolve, reject) => {
        mkdirp(TESTDIR, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })
));

test.after('teardown', () => del(TESTDIR, { force: true }));

test.cb('should print usage', t => {
    child_process.execFile(path.join(__dirname, '../bin/quik.js'), [ '--help' ], {}, (err, stdout) => {
        if (err) {
            t.end(err);
        } else {
            t.same(stdout.indexOf('Usage: ../bin/quik.js [...options]'), 0);
            t.end();
        }
    });
});

test.cb('should initialize project with template', t => {
    child_process.execFile(path.join(__dirname, '../bin/quik.js'), [ '--init', PROJECT_NAME ], {
        cwd: TESTDIR
    }, err => {
        if (err) {
            t.end(err);
        } else {
            fs.readdir(path.join(TESTDIR, PROJECT_NAME), (error, res) => {
                if (error) {
                    t.end(error);
                } else {
                    t.ok(res.indexOf('package.json') > -1, 'package.json');
                    t.ok(res.indexOf('index.html') > -1, 'index.html');
                    t.ok(res.indexOf('index.js') > -1, 'index.js');
                    t.ok(res.indexOf('MyComponent.js') > -1, 'MyComponent.js');
                    t.end();
                }
            });
        }
    });
});
