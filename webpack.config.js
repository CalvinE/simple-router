var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'simple-router.js',
        library: 'simpleRouter',
        libraryTarget: 'var'
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