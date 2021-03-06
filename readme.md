[ajaxMock](http://semanticsworks.com/) - A mock for jQuery AJAX
==================================================
It is inspired by [gist:1445906](https://gist.github.com/1445906) by cowboy.

How can you use it?
--------------------------------------

You can write your normal jQuery ajax code as usual. When you want to
mock your ajax call, import it ajaxMock.js into your page, and use the following code, and 
your ajax call will be served by the mock. However, if there is no ajax setup match with an ajax
call, that ajax call be real ajax call, so you can mix mock ajax and real ajax together.

$.ajaxMock.on();

//for simple url mock use

$.ajaxMock.url( urlOrUrlRegEx, resultOrResultFunction);

//for full control use, or develop your own higher level api use

$.ajaxMock.setup(function match(mergedOptions, originalOptions) { return true;},
function result(mergedOptions, originalOptions) { return mockValue});

//if you want to throw away the previous setup, and start over.

$.ajaxMock.reset();

//when you want to switch real ajax

$.ajaxMock.off();

For more full usage details, see [test case](https://github.com/fredyang/ajaxMock/blob/master/test/test.js).