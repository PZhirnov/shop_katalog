const path = require('path');
const htmlWeBPl = require('html-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        filename: path.resolve(__dirname, 'src/index.js'),
        filecontact: path.resolve(__dirname, 'src/js/contact_form.js'),
    },
    output: {
        path: path.resolve(__dirname, 'build'), 
        // filename: '[name][contenthash].js', 
        assetModuleFilename: '[name][ext]', // сохраняем имена изображений  
        clean: true, 
    },
    // Оптимизация изображений
    performance: {
        hints: false,
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
    },
    // Конфигурация Dev сервера
    devServer: {
        port: 9000,     
        compress: true,  
        hot: true,      
        static: {
            directory: path.join(__dirname, 'build'),
        }
    },
    module: {
        rules: [
            {   
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {   
                test: /\.(jpg|jpeg|svg|png)$/i,  
                type: 'asset/resource'
            },
            

        ]
    },
    plugins: [
       new htmlWebpackPlugin(
        {
            title: 'Главная',
            filename: 'index.html',
            template: 'src/index.html',
        },
       ),
       new htmlWebpackPlugin(
        {
            title: 'Контакты',
            filename: 'contacts.html',
            template: 'src/contacts.html',
        },
       ) 
    ]
}
