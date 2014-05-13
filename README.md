### Getting started

Before using this application you'll want to make sure you have all the required dependencies. Here is a quick guide on getting started.

1. Install [Node](http://nodejs.org/), `brew install node`.
2. Install [Bundler](http://bundler.io) `gem install bundler`
3. Clone this repository and navigate to the root.
4. Install required node packages, `npm install`.
5. Using Bundler, install required gems, `bundle install`.
6. Run `grunt` to build and compile the app files with [Grunt](http://gruntjs.com/).
7. Until we go fully decoupled, you will need to configure your Apache to serve the `/dist` folder. Edit your Apache config so that at the very least the path alias `/dist` is redirected to the apps `/dist` directory. For example, add this to your VirtualHost:

```
Alias /dist /Users/jfender/Documents/Workspace/dmeapp/dist # Required
Alias /videos /Users/jfender/Documents/Workspace/dmeapp/dist # Serves Library page from dmeapp
```

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

Running `grunt` in the root directory will build a development environment for dmeapp by going through the following steps.

1. `dist` is cleaned (i.e. deleted).
2. Our custom scripts are checked for syntax errors with [JSHint](www.jshint.com).
3. `main.scss` from `src/scss` is compiled by Compass. All of our style and any vendor style is outputted to a single file, `main.css` and placed in `dist/css`.
4. App assets are copied from `src/assets` to `dist/assets`. This includes any sprites that Compass compiled in the previous step.
5. Vendor assets are copied from `vendor/assets` to `dist/assets`.
6. All HTML template files from within `src/app` are copied to `dist/`.
7. Both local vendor and our app script is concatenated into a single JS script file and placed in `dist/js`.
8. Grunt begins 'watching' for future changes made to any of our js, scss or html files. Once a change is made, grunt automagically runs through the build process outlined above again.

You can append the `--offline` command line parameter if you would rather load certain vendor assets locally as opposed to from their CDN.

When you're ready to compile for production, run command `grunt prod`. It goes through the same flow as above except that all compiled CSS and JS is minified and uglified respectively, resulting in smaller file sizes. This will also point the API URI to the production server so be extra careful when doing this!

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
