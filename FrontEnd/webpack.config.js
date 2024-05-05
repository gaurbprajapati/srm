module.exports = {
    // ...
    devServer: {
        hot: false,
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'source-map-loader',
                        options: {
                            exclude: [
                                // Exclude Ant Design LESS files from source-map-loader
                                /node_modules\/antd\/.*\.less$/,
                            ],
                        },
                    },
                ],
            },
        ],
    },
};