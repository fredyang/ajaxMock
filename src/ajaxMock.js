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

	var mockDataType = "mock",
		enableMock = false,
		mockValueMappers = [],

		tryGetMockValue = function( ajaxMergedOptions, ajaxOriginalOptions ) {
			for (var i = 0; i < mockValueMappers.length; i++) {
				var r = mockValueMappers[i]( ajaxMergedOptions, ajaxOriginalOptions );
				if (r !== undefined) {
					return r;
				}
			}
		};

	$.ajaxMock = {

		on: function() {
			enableMock = true;
		},

		off: function() {
			enableMock = false;
		},

		setup: function( predicate, result ) {

			var mapper;

			if (arguments.length === 1) {
				mapper = predicate
			} else {
				mapper = function( ajaxMergedOptions, ajaxOriginalOptions ) {

					if (predicate( ajaxMergedOptions, ajaxOriginalOptions )) {

						return $.isFunction( result ) ?
							result( ajaxMergedOptions, ajaxOriginalOptions ) :
							result;
					}
				};
			}

			mockValueMappers.push( mapper );
			return this;
		},

		returnValueForAjaxCall: function( result ) {

			//put it the head, so that it will always evaluate first
			mockValueMappers.unshift( function( ajaxMergedOptions, ajaxOriginalOptions ) {
				//remove itself immediately, so that it will not be evaluated again
				mockValueMappers.shift();
				return $.isFunction( result ) ?
					result( ajaxMergedOptions, ajaxOriginalOptions ) :
					result;
			} );
		},

		reset: function() {
			mockValueMappers = [];
		},

		url: function( urlPredicate, result ) {
			var predicate = urlPredicate instanceof RegExp ? function( ajaxMergeOptions ) {
				return urlPredicate.test( ajaxMergeOptions.url );
			} : function( mergedOptions ) {
				return urlPredicate === mergedOptions.url;
			};

			return this.setup( predicate, result );
		}

		//expose it for testing the setup mock, otherwise it can be closured
		//tryGetMockValue: tryGetMockValue
	};

	$.ajaxSetup( {
		converters: {
			//no need "mock text", as we already have "* text"
			"mock json": function( data ) {
				if (typeof data === "object") {
					return data;
				}
				return $.parseJSON( data );
			},
			"mock html": window.String,
			"mock xml": $.parseXML
		}
	} )

	$.ajaxPrefilter( function /*applyMockToAjax*/ ( ajaxMergedOptions, ajaxOriginalOptions, jqXhr ) {
		if (enableMock) {
			var r = tryGetMockValue( ajaxMergedOptions, ajaxOriginalOptions );
			if (r !== undefined) {
				ajaxMergedOptions.mockValue = r;
			}
		}
	} );

	//put it to the head of transport builder list for data type "*" using "+" sign
	//otherwise it will not be evaluated
	$.ajaxTransport( "+*", function /*createMockTransport*/ ( mergedOptions, originalOptions, jqXhr ) {
			if (enableMock && mergedOptions.mockValue) {
				return {
					send: function( headers, transportDone ) {

						debugger;
						var responses = {};
						responses[mockDataType] = mergedOptions.mockValue;
						transportDone( "200", "OK", responses );
					},
					abort: function() {}
				};
			}
		}
	);

}( jQuery ));
