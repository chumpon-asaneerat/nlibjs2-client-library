const path = require('path');
const gulp = require('gulp');

const GulpJSDoc = require("./build/gulp/jsdoc").GulpJSDoc;
const GulpClean = require("./build/gulp/clean").GulpClean;
const GulpSass = require("./build/gulp/sass").GulpSass;
const GulpJSBundle = require("./build/gulp/jsbundle").GulpJSBundle;
//const GulpLiveReloaded = require("./build/gulp/livereloaded").GulpLiveReloaded;
//const GulpFileMerge = require("./build/gulp/filemerge").GulpFileMerge;
const GulpNodeMonitor = require("./build/gulp/nodemon").GulpNodeMonitor;
const GulpRiot3 = require("./build/gulp/riot3").GulpRiot3;

//const connect = require('gulp-connect');
//const watch = require('gulp-watch');

gulp.task('build-doc', (cb) => {
    let task = new GulpJSDoc();
    task.opts = {
        config: require('./jsdoc.json'),
        src: [
            path.join(__dirname, 'src/client/js/**/*.js')
        ],
        dest: path.join(__dirname, 'dist/doc/')
    };
    return task.task(cb);
});

gulp.task('clear-doc', () => {
    let task = new GulpClean();
    task.opts = {
        src: path.join(__dirname, 'dist/doc/**/*')
    };
    return task.task();
});

gulp.task('clear-dist', () => {
    let task = new GulpClean();
    task.opts = {
        src: path.join(__dirname, 'dist/**/*')
    };
    return task.task();
});

gulp.task('compile-sass', () => {
    let task = new GulpSass();
    task.opts = {
        src: path.join(__dirname, 'src/client/sass/**/*.{sass,scss}'),
        dest: path.join(__dirname, 'dist/client/css/'),
        map: 'maps/'
    };
    return task.task();
});

gulp.task('riot3', () => {
    let task = new GulpRiot3();
    task.opts = {
        merge: true,
        src: path.join(__dirname, 'src/server/template/riot/**/*.tag'),
        dest: path.join(__dirname, 'dist/component/riot'),
        bundle: 'tags.js'
    };
    return task.task();
});

gulp.task('bundle-js', () => {
    let task = new GulpJSBundle();
    task.opts = {
        src: path.join(__dirname, 'src/client/js/**/*.js'),
        dest: path.join(__dirname, 'dist/client/js/'),
        bundle: path.join(__dirname, 'dist/client/js/bundle.min.js')
    };
    return task.task();
});

gulp.task('watch', function() {
    gulp.watch(src.sass, ['compile-sass']);
    gulp.watch(src.js, ['bundle-js']);
    //gulp.watch(src.html, ['html']);
    //gulp.watch(src.riotTags, ['riot-tags']);
});

gulp.task('monitor', function(done) {    
    let task = new GulpNodeMonitor();
    task.opts = {
        script: 'server.js',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' },
        done: done
    };
    task.task(done);
});

//gulp.task('default', ['sass', 'server', 'watch', 'livereload', 'js', 'riot-tags']);