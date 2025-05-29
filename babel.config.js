module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
        }
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic' // This enables the new JSX transform (no need to import React)
      }
    ]
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
};
