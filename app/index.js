'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var AssembleGulpHamlGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        var log = this.log;
        this.installDependencies(function() {
          log('\n\nPlease run ' + chalk.yellow.bold('rvm rvmrc load && bundle install') + ' to install required ruby gems\n\n');
        });
      }
    });
  },

  gulpfile: function() {
    this.template('gulpfile.js');
  },

  packageJSON: function() {
    this.template('_package.json', 'package.json');
  },

  git: function() {
    this.copy('gitignore', '.gitignore');
  },

  bower: function() {
    this.template('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
  },

  editorconfig: function() {
    this.copy('editorconfig', '.editorconfig');
  },

  ruby: function() {
    this.copy('_Gemfile', 'Gemfile');
    this.copy('ruby-version', '.ruby-version');
    this.template('ruby-gemset', '.ruby-gemset');
  },

  compass: function() {
    this.copy('config.rb');
  },

  app: function() {
    this.directory('src');

    this.mkdir('src/fonts');
    this.mkdir('src/images');

    this.mkdir('src/stylesheets/modules');
    this.mkdir('src/stylesheets/pages');
    this.mkdir('src/stylesheets/theme');
    this.write('src/stylesheets/theme/_layout.scss', '');
    this.write('src/stylesheets/theme/_typography.scss', '');
    this.write('src/stylesheets/theme/_theme.scss', '');

    this.mkdir('src/javascripts');

    this.mkdir('src/templates/partials');
  },

});

module.exports = AssembleGulpHamlGenerator;
