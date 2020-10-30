var modelo=require("./modelo.js");

describe("El juego del impostor", function() {
  var juego;
  var usr;

  beforeEach(function() {
  	juego=new modelo.Juego();
  	usr=new modelo.Usuario("Pepe",juego);
  });

  it("comprobar valores iniciales del juego", function() {
  	expect(Object.keys(juego.partidas).length).toEqual(0);
  	expect(usr.nick).toEqual("Pepe");
  	expect(usr.juego).not.toBe(undefined);
  });
  
  it("no se puede crear la partida si el numero de participantes no esta dentro de un limite", function() {
  	var codigo=usr.crearPartida(3);
	expect(codigo).toBe(undefined);
	var codigo2=usr.crearPartida(11);
	expect(codigo2).toBe(undefined);
  });
  

  describe("el usr crea una partida de 4 jugadores",function(){
	var codigo;
	beforeEach(function() {
	  	codigo=usr.crearPartida(4);
	  });

	it("se comprueba la partida",function(){ 	
	  	expect(codigo).not.toBe(undefined);
	  	expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
	  	expect(juego.partidas[codigo].maximo).toEqual(4);
	  	expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	 	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(1);
	  });
	  

	it("varios usuarios se unen a la partida",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
	  });

	it("El usr inicia la partida",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});
	it("El juego asigna las tareas",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		for (i in juego.partidas[codigo].usuarios){
			expect(i.encargo).not.toEqual("ninguno");
		}
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});
	it("El juego asigna impostor",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		var count=juego.partidas[codigo].numImpostores();
		if (juego.partidas[codigo].numUsuarios() <=7 ){
			expect(count).toEqual(1);
		}else {
			expect(count).toEqual(2);
		}
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});
	
	it("Abandonar Partida 2.0",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		//usr.iniciarPartida();
		//expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
		var partida=juego.partidas[codigo];
		partida.usuarios["tomas"].abandonarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		partida.usuarios["isa"].abandonarPartida();
		partida.usuarios["ana"].abandonarPartida();
		partida.usuarios["Pepe"].abandonarPartida();
		expect(partida.numUsuarios()).toEqual(0);
		juego.eliminarPartida(codigo);
		expect(juego.partidas[codigo]).toBe(undefined)
	});
	
	it("El impostor ataca muere un ciudadano",function(){
		juego.unirAPartida(codigo,"ana");
		juego.unirAPartida(codigo,"isa");  	
		juego.unirAPartida(codigo,"tomas");
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==true){
				var imp= juego.partidas[codigo].usuarios[i];

			}else{
				var atacado=juego.partidas[codigo].usuarios[i];
			}
		}
		juego.partidas[codigo].usuarios[imp.nick].atacar(atacado.nick);
		expect(imp.estado.nombre).toEqual("vivo");
		expect(atacado.estado.nombre).toEqual("muerto");			
	});
	
	it("ganan Impostores",function(){
		juego.unirAPartida(codigo,"ana");
		juego.unirAPartida(codigo,"isa");  	
		juego.unirAPartida(codigo,"tomas");
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==true){
				var imp= juego.partidas[codigo].usuarios[i];

			}else{
				var atacado=juego.partidas[codigo].usuarios[i];
			}
		}
		juego.partidas[codigo].usuarios[imp.nick].atacar(atacado.nick);
		
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==true){
				var imp= juego.partidas[codigo].usuarios[i];

			}else if(juego.partidas[codigo].usuarios[i].estado.nombre =="vivo"){
				var atacado2=juego.partidas[codigo].usuarios[i];
			}
		}
		juego.partidas[codigo].usuarios[imp.nick].atacar(atacado2.nick);
		expect(juego.partidas[codigo].fase.nombre).toEqual("final");
	});
	
	it(" se realiza la votacion y ganan tripulantes",function(){
		juego.unirAPartida(codigo,"ana");
		juego.unirAPartida(codigo,"isa");  	
		juego.unirAPartida(codigo,"tomas");
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==true){
				var imp= juego.partidas[codigo].usuarios[i];
			}
		}
		imp.lanzarVotacion();
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==true){
				juego.partidas[codigo].usuarios[i].votar("skip");
			}else{
				juego.partidas[codigo].usuarios[i].votar(imp.nick);
			}
		}
		juego.partidas[codigo].comprobarVotacion();
		expect(juego.partidas[codigo].usuarios[imp.nick].estado.nombre).toEqual("muerto");
		expect(juego.partidas[codigo].fase.nombre).toEqual("final");
	});
	
	it(" se realiza la votacion y todos saltan, nadie muere y se continua",function(){
		juego.unirAPartida(codigo,"ana");
		juego.unirAPartida(codigo,"isa");  	
		juego.unirAPartida(codigo,"tomas");
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==true){
				var imp= juego.partidas[codigo].usuarios[i];
			}
		}
		imp.lanzarVotacion();
		for (i in juego.partidas[codigo].usuarios){
			juego.partidas[codigo].usuarios[i].votar("skip");
		}
		juego.partidas[codigo].comprobarVotacion();
		for (i in juego.partidas[codigo].usuarios){
			expect(juego.partidas[codigo].usuarios[i].estado.nombre).toEqual("vivo");
		}
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});
	
	it(" se realiza la votacion y se vota a alguien distinto del impostor,se continua",function(){
		juego.unirAPartida(codigo,"ana");
		juego.unirAPartida(codigo,"isa");  	
		juego.unirAPartida(codigo,"tomas");
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");		
		for (i in juego.partidas[codigo].usuarios){
			if(juego.partidas[codigo].usuarios[i].impostor==false){
				var atacado= juego.partidas[codigo].usuarios[i];
			}
		}
		atacado.lanzarVotacion();
		for (i in juego.partidas[codigo].usuarios){
			juego.partidas[codigo].usuarios[i].votar(atacado.nick);
		}
		juego.partidas[codigo].comprobarVotacion();
		expect(juego.partidas[codigo].usuarios[atacado.nick].estado.nombre).toEqual("muerto");
		expect(juego.partidas[codigo].numTripulantes()).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	});
	
	it("Comprobación del funcionamiento abandonar partida",function(){
		
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		
		usr.abandonarPartida(usr.nick);
		var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		
		juego.unirAPartida(codigo,usr.nick);
		var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		
		usr.iniciarPartida();
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
		
		if (juego.partidas[codigo].usuarios[usr.nick].impostor==true){
			usr.abandonarPartida(usr.nick);
			expect(juego.partidas[codigo].fase.nombre).toEqual("final");
			var num=Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
		}else{
			usr.abandonarPartida(usr.nick);
			expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
			var num=Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(3);
			juego.partidas[codigo].usuarios["ana"].abandonarPartida("ana");
			expect(juego.partidas[codigo].fase.nombre).toEqual("final");
			var num=Object.keys(juego.partidas[codigo].usuarios).length;
			expect(num).toEqual(2);
		}
		
		
	})
   
   });
   
   
   
   describe("el usr crea una partida de 8 jugadores",function(){
	var codigo;
	beforeEach(function() {
	  	codigo=usr.crearPartida(8);
	  });
	
	it("se comprueba la partida",function(){ 	
	  	expect(codigo).not.toBe(undefined);
	  	expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
	  	expect(juego.partidas[codigo].maximo).toEqual(8);
	  	expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	 	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(1);
	  });
	  
	it("Se comprueba la asignacion de tareas",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"jaime");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(5);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"andrea");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(6);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"pedro");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(7);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"juan");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(8);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		usr.iniciarPartida();
		for (i in juego.partidas[codigo].usuarios){
			expect(i.encargo).not.toEqual("ninguno");
		}
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	 });
	 it("Se comprueba la asignacion de impostores",function(){
		juego.unirAPartida(codigo,"ana");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(2);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
		juego.unirAPartida(codigo,"isa");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(3);
		expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");	  	
		juego.unirAPartida(codigo,"tomas");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(4);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"jaime");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(5);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"andrea");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(6);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"pedro");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(7);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		juego.unirAPartida(codigo,"juan");
	  	var num=Object.keys(juego.partidas[codigo].usuarios).length;
	  	expect(num).toEqual(8);
		expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
		usr.iniciarPartida();
		var count=juego.partidas[codigo].numImpostores();
		
		expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");
	 });
	});
})