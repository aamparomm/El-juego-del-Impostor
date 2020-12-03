function ClienteWS(){
	this.socket=undefined;
	this.nick= undefined;
	this.codigo= undefined;
	this.numJugador=undefined;
	this.owner=false;
	this.crearPartida=function(nick,numero){
		this.nick=nick;
		this.socket.emit("crearPartida",nick,numero);
		
		//pruebasWS();
	}
	this.unirAPartida=function(nick,codigo){
		this.socket.emit("unirAPartida",nick,codigo);
	}
	this.iniciarPartida=function(){
		this.socket.emit("iniciarPartida",this.nick,this.codigo);//,nick,codigo);
	}
	
	this.ini=function(){
		this.socket=io.connect();
		this.lanzarSocketSrv();
	}
	this.listaPartidas=function(){
		this.socket.emit("listaPartidas");//,nick,codigo);
	}
	this.listarJugadores=function(codigo){
		this.socket.emit("listarJugadores",codigo);//,nick,codigo);
	}
	this.listaPartidasDisponibles=function(){
		this.socket.emit("listaPartidasDisponibles");//,nick,codigo);
	}
	
	this.atacar=function(atacado){
		this.socket.emit("atacar",this.nick,this.codigo,atacado);
	}
	this.lanzarVotacion=function(){
		this.socket.emit("lanzarVotacion",this.nick,this.codigo);
	}
	this.saltarVotacion=function(){
		this.socket.emit("saltarVotacion",this.nick,this.codigo);
	}
	this.votar=function(sospechoso){
		this.socket.emit("votar",this.nick,this.codigo,sospechoso);
	}
	this.obtenerEncargo=function(){
		this.socket.emit("obtenerEncargo",this.nick,this.codigo);
		
		//pruebasWS();
	}
	this.estoyDentro=function(){
		this.socket.emit("estoyDentro",this.nick,this.codigo);
		
		//pruebasWS();
	}
	this.movimiento=function(direccion){
		this.socket.emit("movimiento",this.nick,this.codigo,this.numJugador, direccion);
		
		//pruebasWS();
	}
	//Servidor de web socket dentro del cliente
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function(){			
			console.log("conectado al servidor de Ws");
		});
		this.socket.on('partidaCreada',function(data){
			cli.codigo=data.codigo;
			console.log(data);
			if(data.codigo!= undefined){
				cli.owner=true;
				cw.mostrarEsperandoRival();
				cli.numJugador=0;
			}else{
				console.log("La partida no se ha creado: es indefinida");
			}
		});
		this.socket.on('unidoAPartida',function(data){
			cli.codigo=data.codigo;
			cli.nick=data.nick;
			cli.numJugador=data.numJugador;
			console.log(data);
			cw.mostrarEsperandoRival();
			
		});
		this.socket.on('nuevoJugador',function(nick){
			console.log(nick+"se une a la partida");
			//cli.iniciarPartida();
		});
		this.socket.on('PartidaIniciada',function(fase){
			console.log("Partida en fase "+fase);
			cw.limpiar();
			lanzarJuego();
			//cli.obtenerencargo();
		});
		this.socket.on('RecibirListaJugadores',function(lista){
			console.log(lista);
			cw.mostrarListarJugadores(lista);
		});
		this.socket.on('RecibirLista',function(lista){
			console.log(lista);
		});
		this.socket.on('RecibirListaDisponibles',function(lista){
			console.log(lista);
			if (!cli.codigo){
				cw.mostrarUnirAPartida(lista);
			}
			
		});
		this.socket.on('votacionLanzada',function(data){
			console.log(data);
		});
		//final votacion y cuantos han votado tanto para saltar voto como para votar
		this.socket.on('finalVotacion',function(data){
			console.log(data);
		});
		this.socket.on('hanVotado',function(data){
			console.log(data);
		});
		this.socket.on("esAtacado",function(data){
			console.log(data);
		});
		this.socket.on('recibirEncargo',function(data){
			console.log(data);
		});
		this.socket.on('esperando',function(data){
			console.log('Esperando....'+ data);
		});
		this.socket.on('dibujarRemoto',function(lista){
			console.log(lista);
			for (var i=0;i<lista.length;i++){
				lanzarJugadorRemoto(lista[i].nick,lista[i].participante);
			}
			
		});
		this.socket.on('moverRemoto',function(datos){
			console.log(datos);
			moverRemoto(datos.direccion,datos.nick, datos.numJugador)
			
		});
	}
	this.ini();
}
var ws2,ws3,ws4;
function pruebasWS(){
	ws2=new ClienteWS();
	ws3=new ClienteWS();
	ws4=new ClienteWS();
	var codigo=ws.codigo;
	
	ws2.unirAPartida("juan",codigo);
	ws3.unirAPartida("juani",codigo);
	ws4.unirAPartida("juanjo",codigo);
	
	//ws.iniciarPartida();
	//ws.lanzarVotacion();
}

function saltarVotos(){
	ws.saltarVoto();
	ws2.saltarVoto();
	ws3.saltarVoto();
	ws4.saltarVoto();
}
function votaciones(){
	ws.votar("juan")
	ws1.votar("juan")
	ws2.votar("juan")
	ws4.votar("juan")
}

function votaciones2(){
	ws.votar("juani")
	ws1.votar("juanjo")
	ws2.votar("juan")
	ws4.votar(nick)
}