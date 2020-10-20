
function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		let codigo=this.obtenerCodigo();
		if (!this.partidas[codigo] & this.comprobarlimites(num)){
			this.partidas[codigo]=new Partida(num,owner.nick);
			owner.partida=this.partidas[codigo];
			}
			return codigo;
		}
	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}
	/*this.salirPartida=*/
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
		let letras=cadena.split('');
		let maxCadena=cadena.length;
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,maxCadena)-1]);
		}
		return codigo.join('');
	}
	this.comprobarlimites=function(num){
		return num <= 10 & num >= 4;
	}
}


function Partida(num,owner){
	this.maximo=num;
	this.nickOwner=owner;
	this.fase=new Inicial();
	this.usuarios={};
	this.agregarUsuario=function(nick){
		this.fase.agregarUsuario(nick,this)
	}
	this.puedeAgregarUsuario=function(nick){
		let nuevo=nick;
		let contador=1;
		while(this.usuarios[nuevo]){
			nuevo=nick+contador;
			contador=contador+1;
		}
		this.usuarios[nuevo]=new Usuario(nuevo);
		this.usuarios[nuevo].partida=this;
		//this.comprobarMinimo();
	}
	this.numUsuarios=function(){
		return Object.keys(this.usuarios).length;
	}
	this.numImpostores=function(){
		var count=0;
		for (i in this.usuarios){
			if (this.usuarios[i].impostor == true){
				count++;
			}
		}
		return count;
	}
	this.numTripulantes=function(){
		var count=0;
		for (i in this.usuarios){
			if (this.usuarios[i].impostor == false){
				count++;
			}
		}
		return count;
	}
	this.comprobarMinimo=function(){
		return Object.keys(this.usuarios).length>=4;		
	}
	this.comprobarMaximo=function(){
		return Object.keys(this.usuarios).length<this.maximo;		
	}
	this.iniciarPartida=function(nick){
		this.fase.iniciarPartida(this,nick);
	}
	
	this.puedeIniciarPartida=function(){
		this.fase=new Jugando();
	};
	
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.eliminarPartida=function(){
		delete this;
	}
	
	this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		partida.puedeAgregarUsuario(nick);
		if (partida.comprobarMinimo()){
			partida.fase=new Completado();
		}
	}
	this.iniciarPartida=function(partida,nick){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (partida.numUsuarios == 0){
			partida.eliminarPartida();
		}	
	}
}

function Completado(){
	this.nombre="completado";
	this.encargos=["basurero","mobiliario","jardinero","calles"];
	this.iniciarPartida=function(partida,nick){
		if(nick == partida.nickOwner & partida.comprobarMinimo()){			
			this.asignarencargos(partida);
			this.asignarimpostor(partida);
			partida.puedeIniciarPartida();
		}
	}
	
	this.asignarencargos=function(partida){
		j=0;
		for (i in partida.usuarios){
			partida.usuarios[i].encargo = this.encargos[j%4];
			j++;
		}
	};
	
	this.asignarimpostor=function(partida){
		
		let numAl = Math.floor(Math.random()*(partida.numUsuarios()));
		let j=0;
		
		if (partida.numUsuarios() >= 7){
			
			let numAl2 = Math.floor(Math.random()*(partida.numUsuarios()));
			
			for (i in partida.usuarios){
				if (j == numAl || j == numAl2 ){
				partida.usuarios[i].impostor = true;
				}
				j++;
			}
			
		}else{
			for (i in partida.usuarios){
				if (j == numAl){
				partida.usuarios[i].impostor = true;
				}
				j++;
			}
		}
	
	};
	
	this.agregarUsuario=function(nick,partida){
		
		if (partida.comprobarMaximo()){
			partida.puedeAgregarUsuario(nick);
		}else{
			console.log("La partida esta completa");
		}
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (!partida.comprobarMinimo()){
			partida.fase=new Inicial();
		}
	}
}

function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida,nick){
		console.log("La partida ya ha comenzado");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		
		if(partida.numImpostores()==0){
			partida.fase=new Final();
			console.log("Han ganado los Tripulantes");
		}else if(partida.numImpostores()>=partida.numTripulantes()){
			partida.fase=new Final();
			console.log("Han ganado los impostores");
		}	
	}
}

function Final(){
	this.nombre="final";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ha terminado");
	}
	this.iniciarPartida=function(partida,nick){
		console.log("La partida ya ha comenzado");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (partida.numUsuarios == 0){
			partida.eliminarPartida();
		}
	}
}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.partida;
	this.estado = Vivo();
	this.impostor=false;
	this.encargo="ninguno";
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida(nick);
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
	}
}

function Vivo(){
	
}
function Muerto(){
	
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function inicio(){
	juego = new Juego();
	var usr=new Usuario("Pepe",juego);
	var codigo = usr.crearPartida(4);
	juego.unirAPartida(codigo,"Luis");
	juego.unirAPartida(codigo,"Luis1");
	juego.unirAPartida(codigo,"Luis2");
	juego.unirAPartida(codigo,"Juana");
	usr.iniciarPartida();
}

function inicio2(){
	juego2 = new Juego();
	var usr=new Usuario("Juan",juego2);
	var codigo2 = usr.crearPartida(8);
	juego2.unirAPartida(codigo2,"Pedro");
	juego2.unirAPartida(codigo2,"Pedro1");
	juego2.unirAPartida(codigo2,"Pedro2");
	juego2.unirAPartida(codigo2,"Juana");
	juego2.unirAPartida(codigo2,"Juana1");
	juego2.unirAPartida(codigo2,"Juana2");
	juego2.unirAPartida(codigo2,"Juana3");
	juego2.unirAPartida(codigo2,"Juana4");
	usr.iniciarPartida();
}


