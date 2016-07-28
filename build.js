const build = require('./lib/build');

// options
const options = {
    src: 'src',
    dst: 'build'
};

console.log("Let's do this!");
build(options)
.then(() => console.log("... that was fast :)"))
.catch((ex) => console.log("... damn Daniel!" + ex));