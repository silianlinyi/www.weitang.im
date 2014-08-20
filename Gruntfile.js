module.exports = function(grunt) {

	// 项目配置
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		// 样式合并与压缩
		cssmin : {
			options : {
				banner : '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			minify : {
				expand : true,
				cwd : 'public/css/',
				src : ['*.css', '!*.min.css'],
				dest : 'public/build/css/',
				ext : '.min.css'
			},
			combine : {
				files : {
					'public/dist/css/style.min.css' : ['public/build/css/semantic.min.css', 'public/build/css/common.min.css']
				}
			}
		},

		// js文件合并与压缩
		concat : {
			options : {
				separator : ';'
			},
			common : {
				files : [{
					src : ['public/lib/modernizr.js', 'public/lib/jquery-1.11.1.js', 'public/lib/semantic.js'],
					dest : 'public/dist/lib/libs.js'
				}]
			}
		},

		uglify : {
			options : {
				banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build : {
				src : 'public/dist/lib/libs.js',
				dest : 'public/dist/lib/libs.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['cssmin', 'concat', 'uglify']);
};
