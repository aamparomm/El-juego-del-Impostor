
function Juego(){
	this.partidas={};//que coleccion?
	this.crearPartida=function(num,owner){
		let codigo=this.obtenerCodigo();
		if (!this.partidas[codigo]){
			this.partidas[codigo]=new Partida(num,owner);
		}
	}
	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}
	
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
	}
	this.agregarUsuario(owner);
}

function Inicial(){
	this.agregarUsuario=function(nick,partida){
		if (Object.keys(partida.usuarios).length>=partida.maximo){
			partida.fase=new Jugando();
		}
		else{
			partida.puedeAgregarUsuario(nick);
		}
	}
}

function Jugando(){
	this.agregarUsuario=function(nick,partida){
		//this.puedeAgregarUsuario(nick);
		console.log("La partida ya ha empezado no se pueden agregar nuevos usuarios");
	}
}

function Final(){
	this.agregarUsuario=function(nick,partida){
		//this.puedeAgregarUsuario(nick);
	}
}

function Usuario(nick){
	this.nick=nick;
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

	


