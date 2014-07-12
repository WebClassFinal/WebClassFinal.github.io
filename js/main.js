/**
 * Created by Travis on 2014/7/12.
 */
var body, canvas, ctx;

$(document).ready(function() {
    body = $('body');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = screen.width;
    canvas.height = screen.height - 2 + 'px';

    body.tap(function () {
        console.log("body tapped");
        alert("body");
    });
});