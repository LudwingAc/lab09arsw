var stompClient = null;
var x=0;
var y=0;


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
function sendPoint() {

    stompClient.send("/topic/newpoint", {}, JSON.stringify({x: 10, y: 10}));
}
function callBack(theObject){
    alert("Posx"+theObject["x"]+"Posy"+theObject["y"]);
}
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}


$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');

        }
);
