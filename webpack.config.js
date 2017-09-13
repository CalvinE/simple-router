var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'simple-router.js',
        // library: 'simpleRouter',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
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