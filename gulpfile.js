"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var server = require("browser-sync").create();
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var del = require("del");

gulp.task("css", function () {
    return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
        autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"));
});
gulp.task("html", function () {
    return gulp.src("source/*.html")
    .pipe(gulp.dest("build"));
});
gulp.task("images", function () {
    return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.jpegtran({progressive: true}),
        imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});
gulp.task("server", function () {
    server.init({
        server: "build/",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
    gulp.watch("source/*.html", gulp.series("html", "refresh"));
});
gulp.task("refresh", function (done) {
    server.reload();
    done();
});
gulp.task("clean", function () {
    return del("build");
});
gulp.task("copy", function () {
    return gulp.src([
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/js/**",
        "source/*.ico"
    ], {
        base: "source"
    })
    .pipe(gulp.dest("build"));
});
gulp.task("build", gulp.series(
    "clean",
    "copy",
    "css",
    "html"
));
gulp.task("start", gulp.series("build", "server"));
