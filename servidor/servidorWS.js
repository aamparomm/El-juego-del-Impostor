var modelo =require("./modelo.js");
function ServidorWS(){ 
	//Para contestar a uno a todos solo a los que me escriben, etc
	this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
	this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
	this.enviarAalguien=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };

	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){		    
		    socket.on('crearPartida', function(nick,numero) {
		        //var usr=new modelo.Usuario(nick);
				var codigo=juego.crearPartida(numero,nick);	
				console.log('usuario nick: '+nick+" crea partida numero: "+codigo);
				socket.join(codigo);				
		       	cli.enviarRemitente(socket,"partidaCreada",{"codigo":codigo,"owner":nick})		        		        
		    });
			socket.on('unirAPartida', function(nick,codigo) {
				//nick o codigo nulo
		        console.log('usuario nick: '+nick+" se une a la partida: "+codigo);
				var res=juego.unirAPartida(codigo,nick);
				var owner = juego.partidas[codigo].nickOwner;
				socket.join(codigo);				
		       	cli.enviarRemitente(socket,"unidoAPartida",{"codigo":codigo,"owner":owner});
				cli.enviarATodosMenosRemitente(socket,codigo,"nuevo jugador",nick);
		    });
			socket.on('iniciarPartida', function(nick,codigo) {
				//para pensar
				//comprobar si nick es el owner de la partida
				//Contestar a todos la fase
				juego.iniciarPartida(nick,codigo);
				var fase= juego.partidas[codigo].fase.nombre;
				cli.enviarATodos(io,codigo,"PartidaIniciada",fase);
		    });
			socket.on('listaPartidas', function() {
				//para pensar
				//comprobar si nick es el owner de la partida
				//Contestar a todos la fase
				var lista= juego.listaPartidas();
				cli.enviarRemitente(socket,"RecibirLista",lista);
		    });
			socket.on('listaPartidasDisponibles', function() {
				//para pensar
				//comprobar si nick es el owner de la partida
				//Contestar a todos la fase
				var lista= juego.listaPartidasDisponibles();
				cli.enviarRemitente(socket,"RecibirListaDisponibles",lista);
		    });
			socket.on('lanzarVotacion', function(nick,codigo) {
				//para pensar
				//comprobar si nick es el owner de la partida
				//Contestar a todos la fase
				juego.lanzarVotacion(nick,codigo)
				var fase= juego.partidas[codigo].fase.nombre;
				cli.enviarATodos(io,codigo,"votacionLanzada",fase);
		    });
			socket.on('saltarVotacion', function(nick,codigo) {
				//para pensar
				//comprobar si nick es el owner de la partida
				//Contestar a todos la fase
				var partida=juego.partidas[codigo];
				juego.saltarVotacion(nick,codigo);
				if (partida.todosHanVotado()){
					//Enviar el mas votado
					var data={"elegido":partida.elegido,"fase":partida.fase.nombre}
					cli.enviarATodos(io,codigo,"finalVotacion",data);
				}else{
					//Enviar la lista de los que han votado
					cli.enviarATodos(io,codigo,"hanVotado",partida.listaHanVotado());
				}
		    });
			socket.on('votar', function(nick,codigo) {
				//para pensar
				//comprobar si nick es el owner de la partida
				//Contestar a todos la fase
				var partida=juego.partidas[codigo];
				juego.votar(nick,codigo, sospechoso);
				if (partida.todosHanVotado()){
					//Enviar el mas votado
					var data={"elegido":partida.elegido,"fase":partida.fase.nombre};
					cli.enviarATodos(io,codigo,"finalVotacion",data);
				}else{
					//Enviar la lista de los que han votado
					cli.enviarATodos(io,codigo,"hanVotado",partida.listaHanVotado());
				}
		    });
			socket.on("atacar",function(nick,codigo,atacado){
		    	var res=juego.atacar(nick,codigo,atacado);
				//Avisar al inocente
		    	cli.enviarRemitente(socket,"esAtacado",res);
		    });
			socket.on('obtenerEncargo', function(nick,codigo) {
				//Contestar al remitente con
				var res=juego.obtenerEncargo(nick,codigo);
		    	cli.enviarRemitente(socket,"recibirEncargo",res);
		    });
			
		});
		
	}
}
module.exports.ServidorWS=ServidorWS;