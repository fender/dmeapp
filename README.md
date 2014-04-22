### Getting started

Before using this application you'll want to make sure you have all the required dependencies. Here is a quick guide on getting started.

1. Install [Node](http://nodejs.org/), `brew install node`.
2. Install [Compass](http://compass-style.org/), [Susy](http://susy.oddbird.net/) and [Breakpoint](http://breakpoint-sass.com/) ruby gems, `gem install compass susy breakpoint`.
3. Clone this repository and navigate to the root.
4. Install required node packages, `npm install`.
5. Run `grunt prod` to build and compile the app files with [Grunt](http://gruntjs.com/).
5. Run a local server, `npm start`.
6. Point your browser to `http://localhost:8000/`.

### File structure

Here is a quick run down on the file structure of this repository.

* `src` - Our apps code belongs in here.
  * `/index.html` - This is the route web page for our app.
  * `/app` - This is the meat of our app. To keep things modular, we divide functionality up into directories. For example, directory `/library` contains the AngularJS scripts, SCSS files and HTML templates directly related to our Library page.
    * `/app.js` - This is our app launcher script. It loads all of our submodules and sets up app-wide functionality such as routing.
  * `/assets` - Any assets to be used in the app, such as images, should be placed here.
  * `/scss` - Contains our Sass. The root folder contains our initializers, mixins and variables.
    * `/components` - All of our components style is written here.
    * `/sprites` - Sprite image files are separated by sprite map name. Compass uses each folder to create a sprite image.
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

In the root directory, running `grunt` will go through the following process.

1. `dist` is cleaned (i.e. deleted).
2. Our custom scripts are checked for syntax errors with [JSHint](www.jshint.com).
3. `main.scss` from `src/scss` is compiled by Compass. All of our style and any vendor style is outputted to a single file, `main.css` and placed in `dist/css`.
4. App assets are copied from `src/assets` to `dist/assets`. This includes any sprites that Compass compiled in the previous step.
5. Vendor assets are copied from `vendor/assets` to `dist/assets`.
6. All HTML template files from within `src/app` are copied to `dist/`.
7. Both local vendor and our app script is concatenated into a single JS script file and placed in `dist/js`.
8. Grunt begins 'watching' for future changes made to any of our js, scss or html files. Once a change is made, grunt automagically runs through the build process outlined above again.

We've also implemented the commant `grunt prod` which does the exact same as above except that all compiled CSS and JS is minified and uglified respectively, resulting in smaller file sizes.

### Package management

We use the Node package manager (npm) to keep our node modules up to date. If you need to install a new node module dependency, make sure you also add it to our `package.json` by using the following example command.

`npm install <module_name> --save-dev`

For our vendor packages (front-end assets that we want to include in our app) we use Bower. Similar to npm, you should install packages using the following command.

`bower install <package_name> --save`

### Coding standards

We write our [SMACSS](http://smacss.com/) adhering CSS using [Sass](http://sass-lang.com/), [Compass](http://compass-style.org/) and [Susy](http://susy.oddbird.net/). You should probably know how all of those work before attempting to write any SCSS!

There is also a few simple coding standards to follow when writing SCSS in this app:
* Use soft-tabs with a two space indent.
* Put spaces after `:` in property declarations.
* Put spaces before `{` in rule declarations.
* Use hex color codes #000 unless using rgba.
* Use `//` for comment blocks (instead of `/* */`).

AngularJS coding standards coming soon..

### Known issues

If you navigate to a sub-page (e.g. http://localhost:8000/library) and hit refresh you will receive a 404. This is because we need to rewrite all URLs to point to the root index.html which handles our app routing.
