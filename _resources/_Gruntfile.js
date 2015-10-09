var /*blink   = require('./lib/blink.js'),*/
	imports = require('./lib/imports.js'),
	moment  = require('moment'),
	path    = require('path'),
	async   = require('async'),
	_       = require('underscore');

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-node-inspector');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-http');
	grunt.loadNpmTasks('grunt-datauri');
	grunt.loadNpmTasks('grunt-contrib-compress');

	var timestampFormat = 'YYYY-MM-DD_HH-mm-ss';
	var rtimestamp = /\.((\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2}))\./;

	var now = new Date().getTime();
	var timestamp = moment(now).format(timestampFormat);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
			' * Copyright (c) 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		timestamp: timestamp,

		directories: {
			dist:  'dist',
			bower: 'bower_components',
			css:   'public/css',
			js:    'public/js'
		},

		filenames: {
			dev: {
				css: {
					libs: {
						src: 'libs.less',
						out: 'libs.css',
						map: 'libs.css.map'
					},
					styles: {
						src: 'styles.less',
						out: 'styles.css',
						map: 'styles.css.map'
					}
				}
			},

			dist: {
				mod: {
					min: 'modernizers.<%= timestamp %>.min.js',
					map: 'modernizers.<%= timestamp %>.min.js.map'
				},
				css: {
					src: 'dist.less',
					min: 'styles.<%= timestamp %>.min.css',
					map: 'styles.<%= timestamp %>.min.css.map'
				},
				js: {
					min: 'scripts.<%= timestamp %>.min.js',
					map: 'scripts.<%= timestamp %>.min.js.map'
				}
			}
		},

		paths: {
			dev: {
				css: {
					libs: {
						src: '<%= directories.css %>/<%= filenames.dev.css.libs.src %>',
						out: '<%= directories.css %>/<%= filenames.dev.css.libs.out %>',
						map: '<%= directories.css %>/<%= filenames.dev.css.libs.map %>'
					},
					styles: {
						src: '<%= directories.css %>/<%= filenames.dev.css.styles.src %>',
						out: '<%= directories.css %>/<%= filenames.dev.css.styles.out %>',
						map: '<%= directories.css %>/<%= filenames.dev.css.styles.map %>'
					}
				}
			},

			dist: {
				mod: {
					min: '<%= directories.dist %>/<%= filenames.dist.mod.min %>',
					map: '<%= directories.dist %>/<%= filenames.dist.mod.map %>'
				},
				css: {
					src: '<%= directories.css %>/<%= filenames.dist.css.src %>',
					min: '<%= directories.dist %>/<%= filenames.dist.css.min %>',
					map: '<%= directories.dist %>/<%= filenames.dist.css.map %>'
				},
				js: {
					min: '<%= directories.dist %>/<%= filenames.dist.js.min %>',
					map: '<%= directories.dist %>/<%= filenames.dist.js.map %>'
				}
			}
		},

		clean: {
			files: [ '<%= directories.dist %>' ]
		},

		uglify: {
			options: {
				/** The number of directories to drop from the path prefix when declaring files in the source map. */
				sourceMapPrefix: 0,

				/** The location where your source files can be found. This sets the sourceRoot field in the source map. */
				sourceMapRoot: '/'
			},

			distMod: {
				options:  {
//					// Grunt-contrib-uglify does not support adding a banner alongside sourcemaps. Add the banner to your unminified source and then uglify.
//					banner: '<%= banner %>',

					sourceMap: '<%= paths.dist.mod.map %>',

					/** Overrides the path to the sourcemap file in the minified file. */
					sourceMappingURL: '<%= filenames.dist.mod.map %>'
				},
				src: imports.getModernizers(true),
				dest: '<%= paths.dist.mod.min %>'
			},

			distJs: {
				options:  {
//					// Grunt-contrib-uglify does not support adding a banner alongside sourcemaps. Add the banner to your unminified source and then uglify.
//					banner: '<%= banner %>',

					sourceMap: '<%= paths.dist.js.map %>',

					/** Overrides the path to the sourcemap file in the minified file. */
					sourceMappingURL: '<%= filenames.dist.js.map %>'
				},
				src: imports.getScripts(true),
				dest: '<%= paths.dist.js.min %>'
			}
		},

		http: {
			blinkSuccess: {
				url: 'http://localhost:8934/blink1/fadeToRGB',
				qs: { rgb: '#00FF00', time: 0.5 },
				ignoreErrors: true
			}
		},

		datauri: {
			clients: {
				options: {
					classPrefix: 'client-'
				},
				src: [
					'cms/about/clients/*.png'
				],
				dest: [
					'public/css/sprites/clients.css'
				]
			},
			npos: {
				options: {
					classPrefix: 'npo-'
				},
				src: [
					'cms/about/npos/*.png'
				],
				dest: [
					'public/css/sprites/npos.css'
				]
			},
			our_brands: {
				options: {
					classPrefix: 'brand-'
				},
				src: [
					'cms/our-brands/logos/*.png'
				],
				dest: [
					'public/css/sprites/our-brands.css'
				]
			}
		},

		less: {
			devLibs: {
				options: {
					sourceMap: true,
					sourceMapFilename: '<%= paths.dev.css.libs.map %>',
					sourceMapBasepath: '<%= directories.css %>/'
				},
				src: '<%= paths.dev.css.libs.src %>',
				dest: '<%= paths.dev.css.libs.out %>'
			},

			devStyles: {
				options: {
					sourceMap: true,
					sourceMapFilename: '<%= paths.dev.css.styles.map %>',
					sourceMapBasepath: '<%= directories.css %>/'
				},
				src: '<%= paths.dev.css.styles.src %>',
				dest: '<%= paths.dev.css.styles.out %>'
			},

			dist: {
				options: {
					compress: true,
					sourceMap: true,
					sourceMapFilename: '<%= paths.dist.css.map %>',
					sourceMapBasepath: '<%= directories.css %>/'
				},
//				src: imports.getStyles(true), // BREAKS SOURCE MAPS!
				src: 'public/css/dist.less',
				dest: '<%= paths.dist.css.min %>'
			}
		},

		fixSourceMap: {
			options: {
				removePrefixes: '<%= directories.dist %>/',
				replacements: {
					'<%= directories.bower %>': '/<%= directories.bower %>',
					'<%= directories.css %>': '/<%= directories.css %>',
					'<%= directories.js %>': '/<%= directories.js %>'
				}
			},

			devCssLibs: {
				src:  '<%= paths.dev.css.libs.map %>',
				dest: '<%= paths.dev.css.libs.map %>'
			},

			devCssStyles: {
				src:  '<%= paths.dev.css.styles.map %>',
				dest: '<%= paths.dev.css.styles.map %>'
			},

			distCss: {
				src:  '<%= paths.dist.css.map %>',
				dest: '<%= paths.dist.css.map %>',
				options: {
					min:  '<%= paths.dist.css.min %>'
				}
			},

			distMod: {
				src:  '<%= paths.dist.mod.map %>',
				dest: '<%= paths.dist.mod.map %>'
			},

			distJs: {
				src:  '<%= paths.dist.js.map %>',
				dest: '<%= paths.dist.js.map %>'
			}
		},

		compress: {
			js: {
				options: {
					mode: 'gzip'
				},
				files: [
					{
						expand: true,
						src: [ 'dist/*.js' ],
						ext: '.' + timestamp + '.min.gz.js'
					}
				]
			},
			css: {
				options: {
					mode: 'gzip'
				},
				files: [
					{
						expand: true,
						src: [ 'dist/*.css' ],
						ext: '.' + timestamp + '.min.gz.css'
					}
				]
			}
		},

		s3: {
			js: {
				files: [
					{ dest: 'js', src: [ '<%= directories.dist %>/*.js', '<%= directories.dist %>/*.js.map' ] }
				]
			},
			css: {
				files: [
					{ dest: 'css', src: [ '<%= directories.dist %>/*.css', '<%= directories.dist %>/*.css.map' ] }
				]
			},
		},

		// Recompiles LESS files when they change
		watch: {
			dev: {
				files: '**/*.less',
				tasks: ['less:devStyles', 'fixSourceMap:devCssStyles'/*, 'http:blinkSuccess'*/]
			}
		},

		// Restarts Express server when .js/.json files change
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					args: ['dev'],
					nodeArgs: ['--debug'],
					// callback: function (nodemon) {
					// 	nodemon.on('log', function (event) {
					// 		console.log(event.colour);
					// 	});
					// },
					// env: {
					// 	PORT: '8181'
					// },
					// cwd: __dirname,
					ignore: ['node_modules/', 'bower_components/', 'public/', 'Gruntfile.js'],
					ext: 'js,json',
					// watch: ['server'],
					delay: 1000,
					// legacyWatch: true
				}
			},
			// options: {
			// 	file: 'app.js',
			// 	args: [],
			// 	nodeArgs: ['--debug'],
			// 	ignoredFiles: ['node_modules/**', 'bower_components/**', 'Gruntfile.js', 'public/**'],
			// 	watchedExtensions: ['js', 'json']
			// },
			// dev: {},
			// prod: {
			// 	options: {
			// 		env: {
			// 			NODE_ENV: 'production'
			// 		}
			// 	}
			// }
		},

		// Chrome DevTools web interface for debugging Node.js code
		'node-inspector': {
			dev: {}
		},

		concurrent: {
			dev: {
				tasks: ['watch', 'nodemon:dev', 'node-inspector'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerMultiTask('fixSourceMap', 'Fix source map paths.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			/**
			 * Path prefixes to remove from source file paths in the sourcemap (<code>.map</code>) file.
			 * @type {String|String[]}
			 */
			removePrefixes: [],

			/**
			 * Map of prefixes to find (key) and their replacements (value).
			 * @type {String|String[]}
			 */
			replacements: {
//				"find": "replace"
			},

			// Separate concatenated files
			// TODO: This should never actually be used, since src should only ever contain one sourcemap.map file
			separator: '\n'
		});

		// Ensure option is an array of prefixes
		options.removePrefixes =
			Array.isArray(options.removePrefixes) ? options.removePrefixes :
				typeof (options.removePrefixes) === 'string' ? [ options.removePrefixes ] : [];

		/**
		 * Expands Grunt <code>&lt;% %&gt;</code> templates in the given string.
		 * @param {String} str String possibly containing Grunt <code>&lt;% %&gt;</code> templates to expand.
		 * @returns {String} <code>str</code> with Grunt <code>&lt;% %&gt;</code> templates expanded.
		 * @private
		 * @see http://gruntjs.com/api/grunt.config#grunt.config.process
		 */
		var _expand = function(str) {
			return grunt.config.process(str);
		};

		var _expandObj = function(obj) {
			var expObj = {},
				key,
				value;

			for (key in obj) {
				value = obj[key];
				if (value && obj.hasOwnProperty(key) && typeof(value) === 'string') {
					key = _expand(key);
					expObj[key] = _expand(value);
				}
			}

			return expObj;
		};

		options.removePrefixes = options.removePrefixes.map(_expand);
		options.replacements = _expandObj(options.replacements);

		/**
		 * @param {String} filepath
		 * @returns {boolean}
		 */
		var _doesFileExist = function(filepath) {
			// Warn on and remove invalid source files (if nonull was set).
			if (!grunt.file.exists(filepath)) {
				grunt.log.warn('Source file "' + filepath + '" not found.');
				return false;
			} else {
				return true;
			}
		};

		var _fixPath = function(sourceFilePath) {
			var fixedSourceFilePath = sourceFilePath;

			options.removePrefixes.every(function(removePathPrefix) {
				var strIdx = sourceFilePath.indexOf(removePathPrefix);

				// Source file path starts with the current path prefix - we need to remove it
				if (strIdx === 0) {
					fixedSourceFilePath = sourceFilePath.substr(removePathPrefix.length);

					// Break out of .every() loop
					return false;
				}

				// Continue .every() loop
				return true;
			});

			replacementLoop:
				for (var prefix in options.replacements) {
					if (!options.replacements.hasOwnProperty(prefix)) { return; }

					var strIdx = sourceFilePath.indexOf(prefix);

					// Source file path starts with the current path prefix - we need to remove it
					if (strIdx === 0) {
						var replacement = options.replacements[prefix];

						fixedSourceFilePath = replacement + sourceFilePath.substr(prefix.length);

						break replacementLoop;
					}
				}

			return fixedSourceFilePath;
		};

		/**
		 * @param {String} sourceMapFilePath Path to the <code>.map</code> sourcemap file.
		 */
		var _getFixedSourceMapFileContents = function(sourceMapFilePath) {
			var sourceMap = grunt.file.readJSON(sourceMapFilePath);

			if (sourceMap['file']) {
				sourceMap['file'] = _fixPath(sourceMap['file']);
			}

			sourceMap['sources'] = sourceMap['sources'].map(_fixPath);

			return JSON.stringify(sourceMap);
		};

		/**
		 * @param {{src: String[], dest: String}} f
		 */
		var _fileIterator = function(f) {
			/**
			 * Array of source file paths.
			 * @type {String[]}
			 */
			var srcPaths = f.src,

				/**
				 * Path to the destination output file.
				 * @type {String}
				 */
				destPath = f.dest;

			// Concat specified files.
			var srcConcat = srcPaths
				.filter(_doesFileExist)
				.map(_getFixedSourceMapFileContents)
				.join(grunt.util.normalizelf(options.separator))
			;

			// Write the destination file.
			grunt.file.write(destPath, srcConcat);

			// Print a success message.
			grunt.log.writeln('File "' + f.dest + '" created.');
		};

		// Iterate over all specified file groups.
		this.files.forEach(_fileIterator);

		if (options.min) {
			var code = grunt.file.read(options.min);
			var rinline = new RegExp("(//#\\s+sourceMappingURL=)(.+)()", 'g');
			var rblock = new RegExp("(/\\*#\\s+sourceMappingURL=)(.+?)(\\s+\\*/)", 'g');

			var fixed = code;

			var replace = function(regex) {
				fixed = fixed.replace(regex, function(match, pre, sourceMappingURL, post, offset, string) {
					console.log(sourceMappingURL);
					return match.replace(regex, pre + _fixPath(sourceMappingURL) + post);
				});
			};

			replace(rinline);
			replace(rblock);

			grunt.file.write(options.min, fixed);
		}
	});

	grunt.registerTask('timestamp', function() {
		// TODO: Make configurable
		grunt.file.write('dist/timestamp.json', JSON.stringify({ timestamp: timestamp }));
	});

	grunt.registerTask('compile-css', [/*'datauri', */'less', 'fixSourceMap']);
	grunt.registerTask('compile-js', ['uglify', 'fixSourceMap']);

	grunt.registerTask('default', ['clean', 'timestamp', 'compile-css', 'compile-js', 'compress']);
	grunt.registerTask('prod', ['default', 'nodemon:prod']);
	grunt.registerTask('dev', ['compile-css', 'concurrent']);

	// grunt.event.on('watch', function(action, filepath) {
	// 	blink.pending();
	// });

	// blink.clear();

};
