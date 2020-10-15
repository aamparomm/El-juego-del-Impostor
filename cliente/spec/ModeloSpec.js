describe("El juego del impostor", function() {
  var juego;
  var usuario;

  beforeEach(function() {
    juego = new Juego();
	usr=new Usuario("Pepe",juego);
  });
  
  it("configuracion inicial", function() {
	  
	  expect(Object.keys(juego.partidas).length).toEqual(0);
	  expect(usr.nick).toEqual("Pepe");
	  expect(usr.juego).not.toBe(undefined);
	  
	}); 
	
  it("el usuario Pepe crea una partida de 4 jugadores", function() {
	  var num = 4;
	  var inicial= new Inicial();
	  var codigo=usr.crearPartida(num);
	  expect(juego.partidas[codigo].maximo).toEqual(num);
	  expect(codigo).not.toBe(undefined);
	  expect(juego.partidas[codigo].nickOwner).toEqual(usr.nick);
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(1);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	}); 
	
  it("Los usuarios se unen a la partida introduciendo el codigo", function() {
	  
	  var num = 4;
	  var nick ="Elena";
	  var codigo=usr.crearPartida(num);
	  juego.unirAPartida(codigo,"Ana");
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(2);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	  juego.unirAPartida(codigo,"Elena");
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(3);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	  juego.unirAPartida(codigo,"Tomas");
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(4);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
	  
	}); 
	
	it("El owner de la partida unicia la partida cuando el quiera", function() {
	  var num = 4;
	  var nick ="Elena";
	  var codigo=usr.crearPartida(num);
	  juego.unirAPartida(codigo,"Ana");
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(2);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	  juego.unirAPartida(codigo,"Elena");
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(3);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("inicial");
	  juego.unirAPartida(codigo,"Tomas");
	  expect(Object.keys(juego.partidas[codigo].usuarios).length).toEqual(4);
	  expect(juego.partidas[codigo].fase.nombre).toEqual("completado");
	  usr.iniciarPartida();
	  expect(juego.partidas[codigo].fase.nombre).toEqual("jugando");  
	});

})