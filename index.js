var fs = require("fs"); //Liberia para el sistema de archivos
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var modelo=require("./servidor/modelo.js");

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var juego = new modelo.Juego();

app.get('/', function (request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html"); 
   
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
    
});//las peticiones que llegan a ala raiz de mi URL.

app.get('/nuevoUsuario/:nick',function(request,response){
	var nick=request.params.nick;
	var usr=new modelo.Usuario(nick);
});// nombre-ruta-api/:parametro1:/parametro2/:.....

app.get("/crearPartida/:nick/:num",function(request,response){
	var nick=request.params.nick;
	var num=parseInt(request.params.num);
	//ojo, nick nulo o numero nulo
	//var num=4;
	var usr=new modelo.Usuario(nick);
	var codigo=juego.crearPartida(num,usr);

	response.send({"codigo":codigo});
});

app.get("/unirAPartida/:nick/:codigo",function(request,response){
	var nick=request.params.nick;
	var codigo=request.params.codigo;
	var res=juego.unirAPartida(codigo,nick);
	response.send({"res":res});
});

app.get("/listarPartidas",function(request,response){
	var lista= juego.listarPartidas();
	response.send(lista);
});

server.listen(app.get('port'), function () {
    console.log('Node esta escuchando en el puerto', app.get('port'));
});
//inicio de l index.html, que se ponga a escuchar en el puerto y muestra un mensaje

// app.listen(app.get('port'), function () {
//      console.log('Node app is running on port', app.get('port'));
// });
