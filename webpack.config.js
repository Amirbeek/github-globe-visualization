module.exports = {
    module: {
        rules: [
            {
                test: /\.json$/,
                loader: 'json-loader',
                type: 'javascript/auto'
            }
        ]
    }
};
