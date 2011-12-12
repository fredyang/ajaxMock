var ajaxMock = $.ajaxMock;

test( "ajaxMock", function () {

	ajaxMock.on();

	ajaxMock.url( "string", "string result" );

	$.get( "string" ).done( function ( data ) {
		equal( data, "string result", "can get string" );
	} );

	ajaxMock.url( "json", {
		result: "json result"
	} );
	$.getJSON( "json" ).done( function ( data ) {
		equal( data.result, "json result", "can get json" );
	} );

	ajaxMock.url( "script", "var scriptResult = true;" );
	$.getScript( "script" ).done( function ( data ) {
		equal( scriptResult, true, "can get script" );
	} );

	var param = {
		name: "john"
	};

	ajaxMock.url( "testData", function ( mergedOptions, originalOptions ) {
		var data = originalOptions.data;
		equal( data, param, "original data can be retrieve in originalOptions.data" );
		return data.name;
	} );

	$.get( "testData", param ).done( function ( data ) {
		equal( data, param.name, "can retrieve data from a result function" );
	} );

} )