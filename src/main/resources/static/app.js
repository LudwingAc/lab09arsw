var stompClient = null;
var x = 0;
var y = 0;
var canvas;
var context;


function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/newpoint', function (data) {

            theObject = JSON.parse(data.body);
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(theObject["x"], theObject["y"], 1, 0, 2 * Math.PI);
            ctx.stroke();
        });
        stompClient.subscribe('/topic/newpolygon', function (data) {
            var points = JSON.parse(data.body);
            console.log(points);
            
            context.fillStyle = 'blue';
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            context.lineTo(points[1].x, points[1].y);
            context.lineTo(points[2].x, points[2].y);
            context.lineTo(points[3].x, points[3].y);
            context.closePath();
            context.fill();

        });


    });
}
sendPoint = function () {

    stompClient.send("/app/newpoint", {}, JSON.stringify({x: x, y: y}));
    console.log("Nuevo resgistro");
}
//function callBack(theObject) {
//  var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");

//alert("Posx"+theObject["x"]+"Posy"+theObject["y"]);
//}
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}



$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');
            canvas = document.getElementById('myCanvas');
            context = canvas.getContext('2d');

            canvas.addEventListener('mousedown', function (evt) {
                var mousePos = getMousePos(canvas, evt);
                x = mousePos.x;
                y = mousePos.y;
                sendPoint();
                //stompClient.send("/app/newpoint", {}, JSON.stringify({x: x, y: y}));
                var mensaje = 'Position' + mousePos.x + mousePos.y;

            }, false);
        }
);
