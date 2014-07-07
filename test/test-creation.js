/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('assemble-gulp-haml generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('assemble-gulp-haml:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'bower.json',
      '.bowerrc',
      'config.rb',
      '.editorconfig',
      'Gemfile',
      '.gitignore',
      'gulpfile.js',
      'package.json',
      '.ruby-gemset',
      '.ruby-version',
      'src/fonts',
      'src/images',
      'src/stylesheets/modules',
      'src/stylesheets/pages',
      'src/stylesheets/theme/_layout.scss',
      'src/stylesheets/theme/_theme.scss',
      'src/stylesheets/theme/_typography.scss',
      'src/templates/layouts/default.haml',
      'src/templates/pages/index.haml',
      'src/templates/partials',
    ];

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
