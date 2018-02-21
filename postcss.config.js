/* eslint-disable global-require */
module.exports = () => ({
  plugins: {
    'postcss-import': { path: 'source/css/' },
    'postcss-mixins': {},
    'postcss-nested': {},
    'postcss-modules-resolve-path': {
      paths: ['source', 'css'],
    },
    'postcss-cssnext': {
      browsers: ['defaults'],
    },
  },
});
