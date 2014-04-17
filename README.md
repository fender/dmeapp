App folder structure

app.js is the root of our AngularJS application.
index.html is the template for all of our pages.

src/app contains our application code. We split up functionality into folders based on its purpose.
For example, the `library` folder contains all the parts that make up the library page which includes
our script file, sass file and html template.

Build process:

1. `dist` is cleaned
2. app assets are copied from `src/assets` to `dist/assets`
3. vendor assets are copied from `vendor/assets` to `dist/assets`
4. all html files from within `src/app` are copied to `dist/`
5. main.scss in `src/scss` is compiled by compass and output to `dist/css`
6. vendor scss files are compiled by compass and output to `dist/css`
7. all app and vendor js files are concatenated and placed in `dist/`
8. the compiled js file is minified

grunt - default
grunt prod - production

explain package.json
tests

brew install node
gem install compass (this installs sass)
gem install susy
gem install breakpoint
npm install
bower install

   We write our <a href="http://smacss.com/">SMACSS</a> adhering CSS using <a href="http://sass-lang.com/">Sass</a>, <a href="http://compass-style.org/">Compass</a> and <a href="http://susy.oddbird.net/">Susy</a>.
    You should probably know how all of those work before attempting to write any SCSS!

  <p>
    There is also a few simple coding standards to follow when writing SCSS for our site:
    <ul>
      <li>
        Use soft-tabs with a two space indent.
      </li>
      <li>
        Put spaces after : in property declarations.
      </li>
      <li>
        Put spaces before { in rule declarations.
      </li>
      <li>
        Use hex color codes #000 unless using rgba.
      </li>
      <li>
        Use // for comment blocks (instead of /* */).
      </li>
    </ul>
  </p>