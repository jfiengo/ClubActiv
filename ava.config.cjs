export default {
    files: ['test/**/*.test.js'],
    require: ['@babel/register'],
    babel: {
      extensions: ['js'],
    },
    nodeArguments: ['--experimental-modules'],
  };
  