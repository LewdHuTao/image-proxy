const colors = require("colors");

const logger = {
    info: (message) => {
      console.log(`${colors.gray(currentDate())} - ${colors.blue('[INFO]')} - ${colors.green(message)}`);
    },
    warn: (message) => {
      console.log(`${colors.gray(currentDate())} - ${colors.yellow('[WARN]')} - ${colors.yellow(message)}`);
    },
    error: (message) => {
      console.error(`${colors.gray(currentDate())} - ${colors.red('[ERROR]')} - ${colors.red(message)}`);
    },
  };
  
  const currentDate = () => {
    return new Date().toLocaleTimeString().replace(/:\d+ /, " ");
  };
  
  module.exports = logger;