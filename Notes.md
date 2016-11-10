## Next
* follow the tutorial, learn how to debug and program in JavaScript



## JavaScript

* JavaScript is immediatly loaded as soon as the browser sees it.
* Could be put inside <body> tag, it's immediatly executed
* So that the js could be loaded after the canvas element.
* If putting the js inside <head> tag, there won't be any guarantee which one is called first.
* Everything is 64bit floating point precision, whereas opengl expects 32bit

## OpenGL / WebGL
* Remember, inside the vertexShader, the 3D paint math has to be model -> view -> projection from going from right to the left.
* above means:     gl_Position = projection * view * model * vec4(position, 1.0f);


