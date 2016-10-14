const downgrade = require('./downgrade');
const emoji = require('node-emoji');
const loudRejection = require('loud-rejection');
const package = require('../package.json');
const program = require('commander');

loudRejection();

program
  .version(package.version)
  .description(package.description)
  .usage('[options] <source_file> <target_file>')
  .option('-s, --shrink', 'Shrink image to actual downgraded size')
  .action((source, target, options) => {
    downgrade(source, target, {
      maintainSize: !options.shrink
    })
      .then(() => {
        console.log('Much better! 💥 💥 💥 👍 👍 👍');
      });
  });

program.parse(process.argv);
