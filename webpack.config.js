var path = require('path');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'simple-router.js',
        // library: 'simpleRouter',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: [
                    'babel-loader'
                ]
            }
        ]
    }
}