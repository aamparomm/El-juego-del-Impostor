
function Juego(){
	this.partidas = {}; // que coleccion? --> Array Asociativo
	this.crearPartida = function(num,owner){
		let codigo=this.obtenerCodigo();
		if(!this.partidas[codigo]){
			this.partidas[codigo] = new Partida(num,owner);
		}
		
		//crear el objeto partida:num owner y código
		//asignacion --> this.partidas[codigo]= nueva partida
	}
	
	this.unirAPartida= function(nik){
		//ToDo
	}
	this.obtenerCodigo=function(){
		let cadena="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let letras=cadena.split('');
		let codigo=[];
		for(i=0;i<6;i++){
			codigo.push(letras[randomInt(1,25)-1]);
		}
		return codigo.join('');
	}
}
function Partida(num, owner){
	this.maximo=num;// numero máximo de usuarios
	this.owner=owner;
	this.usuarios=[];// el index 0 es el propietario
	//this.usuarios={}; versión array asociativo o diccionario
	this.agregarUsuario=function(nick){
		//comprobar que el nick es unico
		//comprobar si maximo
	}
	this.agregarUsuario(owner);
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}
