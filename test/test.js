var ajaxMock = $.ajaxMock;

test( "ajaxMock", function() {

	ajaxMock.off();

	stop();
	var url = "string";
	var valueMappedToUrl = "string result";

	$.get( url ).fail( function( data ) {
		start();
		ok( true, "before ajaxMock is turned on, jquery ajax use default XMLHttpRequest" );
	} );

	ajaxMock.on();

	ajaxMock.url( url, valueMappedToUrl );

	//	var mockValue = ajaxMock.tryGetMockValue({
	//		url: "string"
	//	});
	//	equal(mockValue, "string result", "$.ajaxMock.getMockValue allow you to test your mockSetup");

	$.get( url ).done( function( data ) {
		equal( data, valueMappedToUrl, "can setup a fake value for an url" );
	} );

	ajaxMock.reset();

	stop();

	$.get( url ).fail( function( data ) {
		start();
		ok( true, "after reset all the rules will be cleared, and your ajax call well fall back " +
		          "to real ajax call" );
	} );

	valueMappedToUrl = {
		result: "json result"
	};

	ajaxMock.url( url, valueMappedToUrl );
	$.getJSON( url ).done( function( data ) {
		equal( data, valueMappedToUrl, "can get json" );
	} );

	ajaxMock.reset();

	valueMappedToUrl = "var scriptResult = true;"
	ajaxMock.url( url, valueMappedToUrl );
	$.getScript( url ).done( function( data ) {
		equal( scriptResult, true, "can get script" );
	} );

	ajaxMock.reset();

	var param = {
		name: "john"
	};

	ajaxMock.url( url, function( userPrameter ) {
		equal( userPrameter, param, "original data can be retrieve in originalOptions.data" );
		return userPrameter;
	} );

	$.get( url, param ).done( function( data ) {
		equal( data, param, "can retrieve data from a result function" );
	} );

	ajaxMock.reset();

	url = /^testregex/;
	valueMappedToUrl = "regex";
	ajaxMock.url( url, valueMappedToUrl );

	$.get( "testregex1" ).done( function( data ) {
		equal( data, valueMappedToUrl, "url can be an regular expression" );
	} );

	$.get( "testregex2" ).done( function( data ) {
		equal( data, valueMappedToUrl, "url can be an regular expression 2" );
	} );

	ajaxMock.reset();

	var valueForNextAjaxCall = "returnValueForAjaxCall";

	ajaxMock.returnValueForAjaxCall( valueForNextAjaxCall );

	$.get( "whateverUrl" ).done( function( data ) {
		equal( data, valueForNextAjaxCall, "ajaxMock.returnValueForAjaxCall allow you setup a value for value for next ajax call" );
	} );

	ajaxMock.reset();

	//above ajax calls are synchronous, because they are fake
	//the following can not be faked, so it is async
	stop();

	$.get( "whateverUrl" ).fail( function( data ) {
		start();
		ok( true, "ajaxMock.returnValueForAjaxCall allow you setup a value for value for next ajax call only, but not calls after the next" );
	} );

	url = "testsetup";
	valueMappedToUrl = "testdata";

	ajaxMock.setup( function predicate ( myurl ) {
		return (myurl === url);

	}, function result ( data ) {
		return data;
	} );

	$.get( "testsetup", "testdata" ).done( function( data ) {

		equal( data, valueMappedToUrl, "ajaxMock.setup allow you greater control how to fake values and " +
		                               "you can use it to build power api like $.ajaxMock.url" );

	} );

	//increase the expect value if you add more assertions
	expect( 12 );

} )