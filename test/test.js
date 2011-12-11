var ajaxMock = $.ajaxMock;

test( "ajaxMock", function () {

	ajaxMock.on();

	ajaxMock.setup( function ( options ) {
		if ( options.url === "string" ) {
			return "string result";
		}
	} );

	ajaxMock.setup( function ( options ) {
		if ( options.url === "json" ) {
			return { result: "json result"};
		}
	} );

	ajaxMock.setup( function ( options ) {
		if ( options.url = "script" ) {
			return "var scriptResult = true;"
		}
		;
	} );

	$.get( "string" ).done( function ( data ) {
		equal( data, "string result", "can get string" );
	} );

	$.getJSON( "json" ).done( function ( data ) {
		equal( data.result, "json result", "can get json" );
	} );

	$.getScript( "script" ).done( function ( data ) {
		equal( scriptResult, true, "can get script" );
	} );

} )