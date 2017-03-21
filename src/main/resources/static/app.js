var stompClient = null;
var x=0;
var y=0;
var canvas=null;


function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        stompClient.subscribe('/topic/newpoint', function (data) {
            //var x = data.x;
            //var y = data.y;
            var theObject=JSON.parse(data.body);
            callBack(theObject);


        });
    });
}
 sendPoint= function() {

    stompClient.send("/topic/newpoint", {}, JSON.stringify({x: x, y: y}));
}
function callBack(theObject){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(theObject["x"],theObject["y"],1,0,2*Math.PI);
    ctx.stroke();
    //alert("Posx"+theObject["x"]+"Posy"+theObject["y"]);
}
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
            
            canvas.addEventListener('mousedown', function(evt) {
            var mousePos = getMousePos(canvas, evt);
            x=mousePos.x;
            y=mousePos.y;
            sendPoint();
            var mensaje = 'Position'+ mousePos.x + mousePos.y;
            }, false);
        }
);
