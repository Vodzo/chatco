var path = require('path');

module.exports = {
	server : {
		public : './server/public'
	},
	client : {
		index : {
			dev : './client/dev/views/index.pug',
			app : './client/app/'
		},
		views : {
			dev : ['./client/dev/views/*.pug', './client/dev/views/**/*.pug', '!./client/dev/views/index.pug'],
			app : './client/app/js/'
		},
		'js' : {
			dev : ['./client/dev/js/*.js', './client/dev/js/**/*.js'],
			app : './client/app/js/'
		}
	},
	tplCacheOptions: {
        filename: 'templates.js',
        module: 'chatco',
        base : function(file) {
            return path.join('app', 'views', path.basename(file.path));
        }
    }
}
