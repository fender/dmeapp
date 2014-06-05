[![Build Status](https://secure.travis-ci.org/fender/dmeapp.png?branch=master)](https://travis-ci.org/fender/dmeapp)

### Getting started

Before using this application you'll want to make sure you have all the required dependencies. Here is a quick guide on getting started.

1. Install [Node](http://nodejs.org/), `brew install node`.
2. Install [Bundler](http://bundler.io) `gem install bundler`
3. Clone this repository and navigate to the root.
4. Install required node packages, `npm install`.
5. Using Bundler, install required gems, `bundle install`.
6. Run `grunt` to build and compile the app files with [Grunt](http://gruntjs.com/).
7. In a separate terminal tab, run `grunt server` to start a local web server.
8. Point your browser to `http://localhost:9000` and dance a little jig.

### File structure

Here is a quick run down on the file structure of this repository.

* `src` - Our apps code belongs in here.
  * `/app` - This is the meat of our app. All AngularJS scripts and templates go here. To keep things modular, we divide functionality up into directories. `app/common` contains common re-usable functionality such as our api or pager. `app/components` contains each section of functionality on our site. For example, directory `library` contains the AngularJS scripts, SCSS files and HTML templates directly related to our Library page.
    * `/app.js` - This is our app launcher script. It initializes all of our components.
    * `/index.html` - The route web page for our app.
  * `/assets` - Any assets to be used in the app, such as images, should be placed here.
  * `/scss` - Contains our Sass. `styles.scss` is responsible for loading all sass files. See below for further details.
  * `vendor` - Contains all vendor packages that are installed via [Bower](http://bower.io/). Hands off!
  * `Gruntfile.js` - This file tells Grunt about our automated workflows.
  * `bower.json` - Contains the vendor packages that our app requires. Bower uses this file to install/update packages.
  * `.bowerrc` - Bower configuration file pointing to where installed packages exist.
  * `module.prefix` and `module.suffix` - Used to wrap around our AngularJS scripts to prevent conflicts.
  * `package.json` - Contains packaging info and Node module dependencies.

There is also 2 directories you may notice that are not part of the git repo as they are added to our `.gitignore`.
* `dist` - Compiled code ends up here. This is ultimately the folder that we serve clients.
* `node_modules` - Required node modules are installed here.

### Development

So you want to develop huh? Well you're in luck. Using Grunt, we've made it simple to automate the development workflow of a large front-end app such as this.

Running `grunt` in the root directory will build a development environment for dmeapp by going through the following steps.

1. `dist` and `tmp` are cleaned (i.e. deleted).
2. Our custom scripts are checked for syntax errors with [JSHint](www.jshint.com).
3. [Karma](http://karma-runner.github.io/0.12/index.html) unit tests are executed.
4. `main.scss` from `src/scss` is compiled by Compass. All of our style and any vendor style is outputted to a single file, `main.css` and placed in `dist/css`.
5. App assets are copied from `src/assets` to `dist/assets`. This includes any sprites that Compass compiled in the previous step.
6. Vendor assets are copied from `vendor/assets` to `dist/assets`.
7. Root HTML files are copied to `dist/` (i.e. index.html).
8. All template HTML files are copied from `src/app` and flattened into `tmp`.
9. The HTML files in `tmp` are added to the AngularJS [$templateCache](https://docs.angularjs.org/api/ng/service/$templateCache) and minified inside `tmp/templates.js`.
10. All scripts (see **app_files.js** in `Gruntfile.js`) are concatenated into a single JS script file and placed in `dist/js`.
11. Temporary folder `tmp` is cleaned.
12. Grunt begins 'watching' for future changes made to any of our js, scss or html files. Once a change is made, grunt automagically runs through relevant build processes outlined above again.

#### LiveReload

[LiveReload](http://livereload.com/) functionality is enabled for this app. Whenever you make a change to any app file, browser windows pointing at `http://localhost:9000` will automatically refresh.

#### Offline mode

You can append the `--offline` command line parameter if you would rather load vendor JS locally as opposed to from their CDN. The list of files that are loaded using this parameter can be found in **vendor_files.offline_js** in `Gruntfile.js`.

#### API path
By default the API path points to `http://drupalize.me/api/v1`. As the API runs on a different domain to our local server, we are unable to make authenticated requests. To change the API path, copy `default.config.js` to `config.js` and update it there. To test authenticated functionality, you will need to setup our Drupal site locally and serve the `dist` folder from Apache.

#### Compiling for production

When you're ready to compile for production, run command `grunt prod`. It goes through the same flow as above except that all compiled CSS and JS is minified and uglified respectively, resulting in smaller file sizes.

#### Package management

We use the Node package manager (npm) to keep our node modules up to date. If you need to install a new node module dependency, make sure you also add it to our `package.json` by using the following example command.

`npm install <module_name> --save-dev`

For our vendor packages (front-end assets that we want to include in our app) we use Bower. Similar to npm, you should install packages using the following command.

`bower install <package_name> --save`

#### CSS Coding Standards

We write our CSS using [Sass](http://sass-lang.com/), [Compass](http://compass-style.org/) and [Susy](http://susy.oddbird.net/). You should probably know how all of those work before attempting to write any SCSS! We do not strictly follow [OOCSS](https://github.com/stubbornella/oocss/wiki) or [SMACSS](http://smacss.com/) but I highly recommend understanding their concepts first.

We write our CSS and organize our files based closely on the principles outlined in "Managing Complex Projects with Design Components" by John Albin at DrupalCon Ausitn 2014 ([video](https://www.youtube.com/watch?v=q1Ia9XtJ878&feature=youtu.be), [slides](http://www.slideshare.net/JohnAlbin/managing-design)).

**Directory structure**

* `/base` - Styles for base html components (e.g. `<p>` or `<ul>`)
* `/components` - Filenames match component class names (eg. `.button` style is found in `_button.scss`)
* `/layouts` - Grid layout definitions and utilities (e.g. floating elements or hiding on mobile)
* `/sprites` - Images to be sprited with Compass. `styles.scss` is responsible for initializing sprites.

**Syntax**

When writing SCSS in this app, follow these coding standards:
* Write as little new style as possible. Re-use components.
* Define variables in lowerCamelCase.
* Use soft-tabs with a two space indent.
* Put spaces after `:` in property declarations.
* Put spaces before `{` in rule declarations.
* Use hex color codes #000 unless using rgba.
* Name component classes like `.my-component`.
* Name elements within components like `.my-component__element-name`.
* When modifiying a class use `--` like `.my-component--modifier-name`.
* When the state of an element is changed with JS, toggle a class like `.is-open`.

#### JS Coding Standards

We follow the [AngularJS Style Guide](https://google-styleguide.googlecode.com/svn/trunk/angularjs-google-style.html) which implements and extends the [Google Javascript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml).
