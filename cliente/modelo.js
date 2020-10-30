
function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		let codigo="";
		if ( this.comprobarlimites(num)){
			let codigo=this.obtenerCodigo();
			if(!this.partidas[codigo]){
			this.partidas[codigo]=new Partida(num,owner.nick,codigo);
			owner.partida=this.partidas[codigo];
			}
		return codigo;
		}
	}
	this.unirAPartida=function(codigo,nick){
		if (this.partidas[codigo]){
			this.partidas[codigo].agregarUsuario(nick);
		}
	}
	this.eliminarPartida=function(codigo){
		delete this.partidas[codigo];
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


function Partida(num,owner,codigo){
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
	}
	this.atacar=function(nick){
		this.fase.atacar(this,nick);
	}
	this.puedeAtacar=function(nick){
		this.usuarios[nick].esAtacado();
	}
	this.numUsuarios=function(){
		return Object.keys(this.usuarios).length;
	}
	this.numImpostores=function(){
		var count=0;
		for (i in this.usuarios){
			if (this.usuarios[i].impostor == true && this.usuarios[i].estado.nombre=="vivo"){
				count++;
			}
		}
		return count;
	}
	this.numTripulantes=function(){
		var count=0;
		for (i in this.usuarios){
			if (this.usuarios[i].impostor == false && this.usuarios[i].estado.nombre=="vivo"){
				count++;
			}
		}
		return count;
	}
	this.gananTripulantes=function(){
		return this.numImpostores()==0;
	}
	this.gananImpostores=function(){
		return this.numImpostores()>= this.numTripulantes();
	}
	this.votar=function(nick){
		this.fase.votar(nick,this);
	}
	this.puedeVotar=function(nick){
		this.usuarios[nick].esVotado();
	}
	
	this.masVotado=function(){
		var max=0;
		var usr=undefined;
		
		for(i in this.usuarios){
			if(this.usuarios[i].votos>=max){
				usr=this.usuarios[i];
				max=this.usuarios[i].votos;
			}
		}
		return usr;
	}
	this.numeroSkips=function(){
		count=0;
		for(i in this.usuarios){
			if(this.usuarios[i].skip == true){
				count++;
			}
		}	
		return count;
	}
	this.reiniciarContadores=function(){
		for(i in this.usuarios){
			this.usuarios[i].votos=0;
			this.usuarios[i].skip=false;
		}
	}
	this.comprobarVotacion=function(){
		let elegido=this.masVotado();
		if(elegido.votos > this.numeroSkips()){
			elegido.esAtacado();
		}else{
			this.fase=new Jugando();
		}
		this.reiniciarContadores();
	}
	this.comprobarMinimo=function(){
		return this.numUsuarios()>=4;		
	}
	this.comprobarMaximo=function(){
		return this.numUsuarios()<this.maximo;		
	}
	this.iniciarPartida=function(nick){
		this.fase.iniciarPartida(this,nick);
	}
	
	this.puedeIniciarPartida=function(){
		this.fase=new Jugando();
	}
	
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartida();
		}else if(this.gananTripulantes()){
			this.finPartida();
		}else{
			this.fase=new Jugando();
		}
	}
	this.finPartida=function(){
		this.fase=new Final();
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
			this.juego.eliminarPartida(this.partida.codigo);
		}	
	}
	this.atacar=function(partida,nicka){
		console.log("No se puede atacar en esta etapa del juego");
	}
	this.votar=function(nick,partida){
		console.log("En esta fase no se puede votar");
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
	this.atacar=function(partida,nicka){
		console.log("No se puede atacar en esta etapa del juego");
	}
	this.votar=function(nick,partida){
		console.log("En esta fase no se puede votar");
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
		partida.comprobarFinal();	
	}
	this.atacar=function(partida,nick){
		partida.puedeAtacar(nick);
	}
	this.votar=function(nick,partida){
		console.log("En esta fase no se puede votar");
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
			this.juego.eliminarPartida(this.partida.codigo);
		}
	}
	this.atacar=function(partida,nicka){
		console.log("No se puede atacar en esta etapa del juego");
	}
	this.votar=function(nick,partida){
		console.log("En esta fase no se puede votar");
	}
}
function Votacion(){
	this.nombre="votacion";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha empezado");
	}
	this.iniciarPartida=function(partida,nick){
		console.log("La partida ya ha comenzado");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (partida.numUsuarios == 0){
			this.juego.eliminarPartida(this.partida.codigo);
		}
	}
	this.atacar=function(partida,nicka){
		console.log("No se puede atacar en esta etapa del juego");
	}
	this.votar=function(nick,partida){
		partida.puedeVotar(nick);
	}
	
}

function Usuario(nick,juego){
	this.nick=nick;
	this.juego=juego;
	this.partida;
	this.estado = new Vivo();
	this.impostor=false;
	this.encargo="ninguno";
	this.votos=0;
	this.skip=false;
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida(nick);
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
	}
	this.atacar=function(nicka){
		if (this.impostor){
			this.partida.atacar(nicka);
		}else{
			console.log("NO eres impostor y por tanto no puedes atacar");
		}
	}
	this.votar=function(nick){
		if (this.estado.nombre == "vivo"){
			if(nick!="skip"){
				this.partida.votar(nick);
			}else{
				this.skip=true;
			}
		}else{
			console.log("Estas muerto no puede votar");
		}
	}
	this.esVotado=function(){
		this.votos+=1;
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this);
		this.partida.comprobarFinal();
	}
	this.lanzarVotacion=function(){
		if (this.partida.fase.nombre=="jugando"){
			this.estado.lanzarVotacion(this);
		}
	}
	this.puedeLanzarVotacion=function(){
		this.partida.fase=new Votacion();
	}
}

function Vivo(){
	this.nombre="vivo";
	this.esAtacado=function(usr){
		usr.estado=new Muerto();;
	}
	this.lanzarVotacion=function(usr){
		usr.puedeLanzarVotacion();
	}
	
}
function Muerto(){
	this.nombre="muerto";
	this.esAtacado=function(usr){
		console.log("El usuario",usr.nick," no puede ser atacado porque esta muerto");
	}
	this.lanzarVotacion=function(){
		console.log("No puedes lanzar votacion");
	}
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


