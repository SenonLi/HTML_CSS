// load a text resource from a file over the network
var loadTextResource = function(url, callback) {
    //With the XMLHttpRequest object you can update parts of a web page, without reloading the whole page.
    var request = new XMLHttpRequest();
    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function ()    {
        
        // HTTP status code 200~299 are usually OK,
        // 300~399 are dedicated for something new
        // 400+ / 500+ are error codes
        if (request.status < 200 || request.status > 299)   {
            // Tell the error message
            callback('Error: HTTP Status ' + request.status +' on resource ' + url);
        }else {
            // Tell the response message
            callback(null, request.responseText);
        }
    };
    request.send();
};

var loadImage = function (url, callback)    {
    var image = new Image();
    image.onload = function ()  {
        callback(null, image);
    };
    image.src = url;
};

var loadJSONresourse = function (url, callback) {
    // seperate the loadJSONrescource function from loadTextResource function
    // to make this part independent
    // Reason 1: JSON (Graphics) thing could be simple without if(error).. test
    // Reason 2: try/catch cannot be optimized
    loadTextResource(url,
        function (error, result) {
            if (error) {
                callback(error);
            } else {
                // At least in Chome initiation there are two JavaScript-compilers
                // Optimizing Compliler & General Purpose Compiler
                // anything with try/catch block cannot be optimized by the optimizing-compiler (Per-function basis)
                try {
                    callback(null, JSON.parse(result));
                } catch (err) {
                    callback(err);
                }
            }
        }
    );
};
























