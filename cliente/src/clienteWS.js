function ClienteWS(){
	this.socket=undefined;
	this.nick= undefined;
	this.codigo= undefined;
	this.crearPartida=function(nick,numero){
		this.socket.emit("crearPartida",nick,numero);
		this.nick=nick;
		//pruebasWS();
	}
	this.unirAPartida=function(nick,codigo){
		this.nick=nick;
		this.socket.emit("unirApartida",nick,codigo);
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
	this.listaPartidasDisponibles=function(){
		this.socket.emit("listaPartidasDisponibles");//,nick,codigo);
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
		});
		this.socket.on('unidoAPartida',function(data){
			cli.codigo=codigo;
			console.log(data);
		});
		this.socket.on('nuevoJugador',function(nick){
			console.log(nick+"se une a la partida");
			//cli.iniciarPartida();
		});
		this.socket.on('PartidaIniciada',function(fase){
			console.log("Partida en fase"+fase);
		});
		this.socket.on('RecibirLista',function(lista){
			console.log(lista);
		});
		this.socket.on('RecibirListaDisponibles',function(lista){
			console.log(lista);
		});
	}
	this.ini();
}

function pruebasWS(codigo){
	var ws2=new ClienteWS();
	var ws3=new ClienteWS();
	var ws4=new ClienteWS();
	//var codigo=ws.codigo;
	
	ws2.unirAPartida("juan",codigo);
	ws3.unirAPartida("juani",codigo);
	ws4.unirAPartida("juanjo",codigo);
	
	//ws.iniciarPartida();
}