var ajaxMock = $.ajaxMock;

test( "ajaxMock", function () {


	ajaxMock.off();

	stop();
	$.get( "string" ).fail( function ( data ) {
		start();
		ok( true, "before ajaxMock is turned on, jquery ajax use default XMLHttpRequest" );
	} );

	ajaxMock.on();

	ajaxMock.url( "string", "string result" );
	var mockValue = ajaxMock.getMockValue({
		url: "string"
	});
	equal(mockValue, "string result", "$.ajaxMock.getMockValue allow you to test your mockSetup");

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

	ajaxMock.url( /^testregex/, function () {
		return "regex";
	} );

	$.get( "testregex1" ).done( function ( data ) {
		equal( data, "regex", "url can be an regular expression" );
	} );

	$.get( "testregex2" ).done( function ( data ) {
		equal( data, "regex", "url can be an regular expression 2" );
	} );

	ajaxMock.nextValue( "nextValue" );

	$.get( "whatever" ).done( function ( data ) {
		equal( data, "nextValue", "ajaxMock.nextValue allow you setup a value for value for next ajax call" );
	} );

	//above ajax calls are synchronous, because they are fake
	//the following can not be faked, so it is async
	stop();
	$.get( "whatever" ).fail( function ( data ) {
		start();
		ok( true, "ajaxMock.nextValue allow you setup a value for value for next ajax call only, but not calls after the next" );
	} );

	ajaxMock.setup( function match( mergedOptions, originalOptions ) {
		return (mergedOptions.url === "testsetup");

	}, function result( mergedOptions, originalOptions ) {
		return originalOptions.data;
	} );

	$.get("testsetup", "testdata").done(function (data){

		equal(data, "testdata", "ajaxMock.setup allow you greater control how to fake values and " +
		                        "you can use it to build power api like $.ajaxMock.url");
		
	});


	//increase the expect value if you add more assertions
	expect(12);

} )