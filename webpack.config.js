module.exports = {
    entry: {
        background: './src/script/background.ts',
        content: './src/script/content.ts',
        pop: './src/script/pop.ts',
    },
    output: {
        path: __dirname + '/output/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.json', '.ts']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: "awesome-typescript-loader" }
        ]
    }
}