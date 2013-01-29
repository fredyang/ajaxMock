/**
 * ajaxMock v0.1 - A mock for jQuery AJAX
 *
 * http://semanticsworks.com
 *
 * Copyright (c) 2011 Fred Yang
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * or GPL (GPL-LICENSE.txt) licenses.
 */
(function( $ ) {

	var enableMock = true,
		mockValueMappers = [],

		tryGetMockValue = function( url, params ) {
			for (var i = 0; i < mockValueMappers.length; i++) {
				var r = mockValueMappers[i]( url, params );
				if (r !== undefined) {
					return r;
				}
			}
		};

	$.ajaxMock = {

		mockValueMappers: mockValueMappers,

		on: function() {
			enableMock = true;
		},

		off: function() {
			enableMock = false;
		},

		//support setup(predicateFunction, resultFunction)
		//predicateFunction is function (url, params) { }
		//resultFunction is function (params) { }
		setup: function( predicate, result ) {

			var mapper;

			if (arguments.length === 1) {
				mapper = predicate
			} else {
				mapper = function( url, params ) {

					if (predicate( url, params )) {

						return $.isFunction( result ) ?
							result( params ) :
							result;
					}
				};
			}

			mockValueMappers.push( mapper );
			return this;
		},

		returnValueForAjaxCall: function( result ) {

			//put it the head, so that it will always evaluate first
			mockValueMappers.unshift( function( url, params ) {
				//remove itself immediately,
				// so that it will not be evaluated again
				mockValueMappers.shift();
				return $.isFunction( result ) ?
					result( params ) :
					result;
			} );
		},

		reset: function() {
			mockValueMappers = [];
		},

		//url can be regular expression or static string
		//result can be a fix object value or a function like function (params) {}
		url: function( predefinedUrl, result ) {

			var predicate;

			if (predefinedUrl instanceof RegExp) {

				predicate = function( userUrl ) {
					return predefinedUrl.test( userUrl );
				};

			} else {
				predicate = function( url ) {
					return predefinedUrl === url;
				};
			}

			return this.setup( predicate, result );
		}

		//expose it for testing the setup mock, otherwise it can be closured
		//tryGetMockValue: tryGetMockValue
	};

	$.ajaxSetup( {
		//extract responses.mock
		converters: {
			//mock is the final data type
			"mock json": function( data ) {
				return data;
			},
			//"mock html": window.String,
			"mock html": true,
			"mock xml": $.parseXML
			//no need "mock text", as we already have "* text"
			//"mock text" : window.String
		}
	} )

	//prefilter is used modified ajaxMergedOptions
	$.ajaxPrefilter( function /*applyMockToAjax*/ ( ajaxMergedOptions, ajaxOriginalOptions, jqXhr ) {
		if (enableMock) {
			//debugger;
			if (ajaxOriginalOptions.dataType == "json" && typeof ajaxOriginalOptions.data == "string") {
				try {
					ajaxOriginalOptions.data = JSON.parse( ajaxOriginalOptions.data );
				}
				catch (e) {}
			}

			var r = tryGetMockValue( ajaxOriginalOptions.url, ajaxOriginalOptions.data );
			if (r !== undefined) {
				ajaxMergedOptions.mockValue = r;
			}
		}
	} );

	//put it to the head of transport builder list for data type "*" using "+" sign
	//otherwise it will not be evaluated
	$.ajaxTransport( "+*", function /*createMockTransport*/ ( mergedOptions, originalOptions, jqXhr ) {
			if (enableMock && mergedOptions.mockValue !== undefined) {
				//if mark value is defined, hi-jack the ajax call to return a
				//fake transport
				//debugger;
				return {
					send: function( headers, transportDone ) {
						//instead of sending a request to xhr
						//shortcut to return the result immediately

						transportDone( "200", "OK",
							//fake a responses object
							{
								//mock is the data type, which will be used in converters
								mock: mergedOptions.mockValue
							} )
						;
					},
					abort: function() {}
				};
			}
		}
	);

}( jQuery ));
