/**
 * ajaxMock v0.1pre - A mock utilities for jQuery AJAX
 *
 * http://semanticsworks.com
 *
 * Copyright (c) 2011 Fred Yang
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * or GPL (GPL-LICENSE.txt) licenses.
 */
(function( $ ) {

	var mockDataType = "mock",
		enableMock = false,
		mocks = [],
		getMockResult = function ( mergedOptions, originalOptions ) {
			for ( var i = 0; i < mocks.length; i++ ) {
				var r = mocks[i]( mergedOptions, originalOptions );
				if ( r !== undefined ) {
					return r;
				}
			}
		},
		ajaxMock = {

			on: function () {
				enableMock = true;
			},

			off: function () {
				enableMock = false;
			},

			setup: function ( match, result ) {
				var predicate = arguments.length === 1 ?
					match :
					function ( mergedOptions, originalOptions ) {

						if ( match( mergedOptions, originalOptions ) ) {

							return $.isFunction( result ) ?
								result( mergedOptions, originalOptions ) :
								result;
						}
					}

				mocks.push( predicate );
				return this;
			},

			//expose it for testing the setup mock, otherwise it can be closured
			mockResult: getMockResult
		};

	$.ajaxMock = ajaxMock;

	ajaxMock.url = function (key, result) {
		var match = key instanceof RegExp ? function (mergeOptions) {
			return key.test(mergeOptions.url);
		} : function (mergedOptions) {
			return key === mergedOptions.url;
		};
		
		return ajaxMock.setup(match, result);
	};


	$.ajaxSetup( {
		converters: {
			//no need "mock text", as we already have "* text"
			"mock json": function ( data ) {
				if ( typeof data === "object" ) {
					return data;
				}
				return $.parseJSON( data );
			},
			"mock html": window.String,
			"mock xml": $.parseXML
		}
	} )

	$.ajaxPrefilter( function applyMockToAjax( mergedOptions, originalOptions, jqXhr ) {
		if ( enableMock ) {
			var r = getMockResult( mergedOptions, originalOptions );
			if ( r !== undefined ) {
				mergedOptions.mockResult = r;
			}
		}
	} );

	//put it to the head of transport builder list for data type "*" using "+" sign
	//otherwise it will not be evaluated
	$.ajaxTransport( "+*", function createMockTransport( mergedOptions, originalOptions, jqXhr ) {
			if ( mergedOptions.mockResult ) {
				return {
					send: function ( headers, transportDone ) {

						var responses = {};

						responses[mockDataType] = mergedOptions.mockResult;
						transportDone( "200", "OK", responses );
					},
					abort: function () {}
				};
			}
		}
	);

}( jQuery ));
