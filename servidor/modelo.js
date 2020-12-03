
function Juego(){
	this.partidas={};
	this.crearPartida=function(num,owner){
		let codigo=undefined;
		if ( this.comprobarlimites(num)){
			let codigo=this.obtenerCodigo();
			if(!this.partidas[codigo]){
			this.partidas[codigo]=new Partida(num,owner,codigo,this);
			owner.partida=this.partidas[codigo];
			}
		return codigo;
		}
	}
	this.unirAPartida=function(codigo,nick){
		var res=-1;
		if (this.partidas[codigo]){
			res = this.partidas[codigo].agregarUsuario(nick);	
		}
		return res;
	}
	this.eliminarPartida=function(codigo){
		delete this.partidas[codigo];
	}
	this.listaPartidas=function(){
		var lista=[];

		for (i in this.partidas){
			var partida=this.partidas[i];
			var owner= partida.nickOwner;
			lista.push({"codigo":partida.codigo,"owner":owner});
		}
		
		return lista
	}
	
	this.listaPartidasDisponibles=function(){
		var lista=[];
		var huecos=0;
		var maximo=0;
		for (i in this.partidas){
			var partida=this.partidas[i];
			var huecos=partida.obtenerHuecos();
			maximo= partida.maximo;
			if(huecos>0){
				lista.push({"codigo":partida.codigo,"huecos": huecos, "maximo": maximo});
			}
			
		}
		
		return lista
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
	this.iniciarPartida=function(nick,codigo){
		this.partidas[codigo].iniciarPartida(nick);
		
	}
	this.abandonarPartida=function(nick,codigo){
		this.partidas[codigo].abandonarPartida(nick);
	}
	this.lanzarVotacion=function(nick,codigo){
		var usr= this.partidas[codigo].usuarios[nick];
		usr.lanzarVotacion();
	}
	this.atacar=function(nick,codigo,atacado){
		var res={};
		var impostor=this.partidas[codigo].usuarios[nick];
		if(impostor.impostor){
			impostor.atacar(atacado);
			res={"atacado":atacado,"impostor":nick};
		}
		return res;
	}
	this.saltarVotacion=function(nick,codigo){
		var usr= this.partidas[codigo].usuarios[nick];
		usr.saltarVoto();
	}
	this.votar=function(nick,codigo,sospechoso){
		var usr= this.partidas[codigo].usuarios[nick];
		//usr=this.partidas[codigo].obtenerUsuario();
		usr.votar(sospechoso);
	}
	this.obtenerEncargo=function(nick,codigo){
		var res={};
		var encargo=this.partidas[codigo].usuarios[nick].encargo;
		var encargo=this.partidas[codigo].usuarios[nick].impostor;
		res={"encargo":encargo,"impostor":impostor};
		return res;
	}
}


function Partida(num,owner,codigo,juego){
	this.maximo=num;
	this.nickOwner=owner;
	this.codigo=codigo;
	this.fase=new Inicial();
	this.juego=juego;
	this.elegido="No hay nadie elegido";
	this.usuarios={};
	this.encargos=["basurero","mobiliario","jardinero","calles"];
	
	this.listarJugadores=function(){
		let lista=[];

		for (var i in this.usuarios){
			var nick= this.usuarios[i].nick;
			var participante= this.usuarios[i].numJugador;
			lista.push({"participante":participante ,"nick":nick});
			
		}
		
		return lista;
	}
	this.agregarUsuario=function(nick){
		return this.fase.agregarUsuario(nick,this);
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
		var numero=this.numUsuarios()-1;
		this.usuarios[nuevo].numJugador=numero;
		if (this.comprobarMinimo()){
			this.fase=new Completado();
		}
		return {"codigo":this.codigo,"nick":nick,"numJugador":numero};
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
	this.obtenerHuecos=function(){
		return (this.maximo-this.numUsuarios());
	}
	this.numImpostores=function(){
		let count=0;
		for (var i in this.usuarios){
			if (this.usuarios[i].impostor){
				count++;
			}
		}
		return count;
	}
	this.numImpostoresVivos=function(){
		let count=0;
		for (var i in this.usuarios){
			if (this.usuarios[i].impostor && this.usuarios[i].estado.nombre=="vivo"){
				count++;
			}
		}
		return count;
	}
	this.numTripulantesVivos=function(){
		let count=0;
		for (var i in this.usuarios){
			if (!this.usuarios[i].impostor && this.usuarios[i].estado.nombre=="vivo"){
				count++;
			}
		}
		return count;
	}
	this.numTripulantes=function(){
		let count=0;
		for (var i in this.usuarios){
			if (!this.usuarios[i].impostor){
				count++;
			}
		}
		return count;
	}
	this.gananTripulantes=function(){
		return this.numImpostoresVivos()==0;
	}
	this.gananImpostores=function(){
		return this.numImpostoresVivos()>= this.numTripulantesVivos();
	}
	
	this.comprobarMinimo=function(){
		return this.numUsuarios()>=4;		
	}
	this.comprobarMaximo=function(){
		return this.numUsuarios()<this.maximo;		
	}
	this.iniciarPartida=function(nick){
		if (nick==this.nickOwner){
			this.fase.iniciarPartida(this);
		}
	}
	
	this.puedeIniciarPartida=function(){
		this.asignarencargos();
		this.asignarimpostor();
		this.fase=new Jugando();
	}
	this.asignarencargos=function(){
		j=0;
		for (i in this.usuarios){
			this.usuarios[i].encargo = this.encargos[j%4];
			j++;
		}
	};
	
	this.asignarimpostor=function(){
		
		let numAl = Math.floor(Math.random()*(this.numUsuarios()));
		let j=0;
		
		if (this.numUsuarios() >= 7){
			
			let numAl2 = Math.floor(Math.random()*(this.numUsuarios()));
			
			for (i in this.usuarios){
				if (j == numAl || j == numAl2 ){
					this.usuarios[i].impostor = true;
				}
				j++;
			}
			
		}else{
			for (i in this.usuarios){
				if (j == numAl){
					this.usuarios[i].impostor = true;
				}
				j++;
			}
		}
	
	};
	
	this.abandonarPartida=function(nick){
		this.fase.abandonarPartida(nick,this);
	}
	this.puedeAbandonarPartida=function(nick){
		this.eliminarUsuario(nick);
		if (!this.comprobarMinimo()){
			this.fase=new Inicial();
		}
		if (this.numUsuarios()<=0){
			this.juego.eliminarPartida(this.codigo);
		}
	}
	
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];
	}
	this.votar=function(nick){
		this.fase.votar(nick,this);
	}
	this.puedeVotar=function(nick){
		this.usuarios[nick].esVotado();
		this.comprobarVotacion();
	}
	this.todosHanVotado=function(){
		let res=true;
		for (var i in this.usuarios){
			if(this.usuarios[i].estado.nombre =="vivo" & !this.usuarios[i].haVotado){
				res=false;
				break;
			}
		}
		return res;
	}
	this.finalVotacion=function(){
		this.fase=new Jugando();
		this.reiniciarContadores();
		this.comprobarFinal();
	}
	this.masVotado=function(){
		let max=1;
		let usr="No se ha elegido a nadie";
		
		for(var i in this.usuarios){
			if(max<this.usuarios[i].votos){
				usr=this.usuarios[i];
				max=this.usuarios[i].votos;
			}
		}
		//comprobar que solo hay uno mas votado
		return usr;
	}
	this.numeroSkips=function(){
		count=0;
		for(var i in this.usuarios){
			if(this.usuarios[i].skip && this.usuarios[i].estado.nombre=="vivo"){
				count++;
			}
		}	
		return count;
	}
	this.reiniciarContadores=function(){
		for(var i in this.usuarios){
			if (this.usuarios[i].estado.nombre=="vivo"){
					this.usuarios[i].reiniciarContadores();
			}
		}
	}
	this.comprobarVotacion=function(){
		if(this.todosHanVotado()){
			let elegido=this.masVotado();
			if(elegido && elegido.votos > this.numeroSkips()){
				elegido.esAtacado();
				this.elegido=elegido.nick;
			}
			this.finalVotacion();
		}
	}
	this.comprobarFinal=function(){
		if (this.gananImpostores()){
			this.finPartida();
		}else if(this.gananTripulantes()){
			this.finPartida();
		}
	}
	this.finPartida=function(){
		this.fase=new Final();
	}
	this.listaHanVotado=function(){
		let lista=[];
		for (var i in this.usuarios){
			if(this.usuarios[i].estado.nombre =="vivo" & this.usuarios[i].haVotado){
				lista.push({"nick": i});
			}
		}
		return lista;
	}
	this.lanzarVotacion=function(){
		this.fase.lanzarVotacion(this);
	}
	this.puedeLanzarVotacion=function(){
		this.fase=new Votacion();
	}
	this.agregarUsuario(owner);
}

function Inicial(){
	this.nombre="inicial";
	this.agregarUsuario=function(nick,partida){
		return partida.puedeAgregarUsuario(nick);
		
	}
	this.iniciarPartida=function(partida){
		console.log("Faltan jugadores");
	}
	this.abandonarPartida=function(nick,partida){
		partida.puedeAbandonarPartida(nick);	
	}
	this.atacar=function(partida,nicka){
		console.log("No se puede atacar en esta etapa del juego");
	}
	this.votar=function(nick,partida){
		console.log("En esta fase no se puede votar");
	}
	this.lanzarVotacion=function(){
		console.log("No se puede lanzar la votacion, fase: ", this.nombre);
	}
}

function Completado(){
	this.nombre="completado";
	this.iniciarPartida=function(partida){			
		partida.puedeIniciarPartida();
	}
	
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
	this.lanzarVotacion=function(){
		console.log("En esta fase no se puede lanzar la votacion");
	}
}

function Jugando(){
	this.nombre="jugando";
	this.agregarUsuario=function(nick,partida){
		console.log("La partida ya ha comenzado");
	}
	this.iniciarPartida=function(partida){
		console.log("La partida ya ha comenzado");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		partida.comprobarFinal();	
	}
	this.atacar=function(partida,nick){
		partida.puedeAtacar(nick);
	}
	this.lanzarVotacion=function(partida){
		partida.puedeLanzarVotacion();
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
	this.iniciarPartida=function(partida){
		console.log("La partida ya ha terminado");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (partida.numUsuarios() == 0){
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
	this.iniciarPartida=function(partida){
		console.log("La partida ya ha comenzado");
	}
	this.abandonarPartida=function(nick,partida){
		partida.eliminarUsuario(nick);
		if (partida.numUsuarios() == 0){
			this.juego.eliminarPartida(this.partida.codigo);
		}
	}
	this.atacar=function(partida,nicka){
		console.log("No se puede atacar en esta etapa del juego");
	}
	this.lanzarVotacion=function(){
		console.log("En esta fase no se puede lanzar la votacion");
	}
	this.votar=function(nick,partida){
		partida.puedeVotar(nick);
	}
	
}

function Usuario(nick,juego){
	this.nick=nick;
	//this.juego=juego;
	this.partida;
	this.numJugador;
	this.estado = new Vivo();
	this.impostor=false;
	this.encargo="ninguno";
	this.votos=0;
	this.haVotado=false;
	this.skip=false;
	
	this.reiniciarContadores=function(){
		this.votos=0;
		this.skip=false;
		this.haVotado=false;
	}
	this.saltarVoto=function(){
		this.skip=true;
		this.haVotado=true;
		this.partida.comprobarVotacion();
	}
	this.crearPartida=function(num){
		return this.juego.crearPartida(num,this);
	}
	this.iniciarPartida=function(){
		this.partida.iniciarPartida();
	}
	this.abandonarPartida=function(){
		this.partida.abandonarPartida(this.nick);
		if (this.partida.numUsuarios()<=0){
			console.log(this.nick," era el último jugador");
		}
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
			this.partida.votar(nick);
			this.haVotado=true;
		}else{
			console.log("Estas muerto no puedes votar");
		}
	}
	this.esVotado=function(){
		this.votos++;
	}
	this.esAtacado=function(){
		this.estado.esAtacado(this);
	}
	this.lanzarVotacion=function(){
		if (this.partida.fase.nombre=="jugando"){
			this.estado.lanzarVotacion(this);
		}
	}
	this.puedeLanzarVotacion=function(){
		this.partida.lanzarVotacion();
	}
}

function Vivo(){
	this.nombre="vivo";
	this.esAtacado=function(usr){
		usr.estado=new Muerto();
		usr.partida.comprobarFinal();
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

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;