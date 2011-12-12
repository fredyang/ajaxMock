[ajaxMock](http://semanticsworks.com/) - A mock for jQuery AJAX
==================================================

How can you use it?
--------------------------------------

You can write your normal code as if you don't have it imported to your page. When you want to
mock your ajax call, import it ajaxMock.js into your page.


$.ajaxMock.on();

//for simple url mock use
$.ajaxMock.url( urlOrUrlRegeEx, resultOrResultFunction);

//for full control use
$.ajaxMock.setup(function match(mergedOptions, originalOptions) { return true;},
function result(mergedOptions, originalOptions) { return mockValue});

//when you want to switch real ajax
$.ajaxMock.off();

For more full usage details, see test case.