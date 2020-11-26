function ControlWeb($){
	this.mostrarCrearPartida=function(){
		var cadena='<div id="mostrarCP">';
		cadena =cadena+ '<div class="form-group">';
		cadena=cadena +'<label for ="nick">Nick:</label>';
		cadena=cadena +'<input type="text" class="form-control" size="50" id="nick">';
		cadena=cadena +'</div>';
		cadena =cadena+'<div class="form-group">';
		cadena=cadena +'<label for ="numero">Numero:</label>';
		cadena=cadena +'<input type="number" class="form-control" size="50" id="numero" min="4" max="10">';
		cadena=cadena +'</div>';
		cadena=cadena+'<button type="button" id="btnCrearPartida" class="btn btn-info">Crear Partida</button>';
		cadena=cadena +'</div>';
		$('#crearPartida').append(cadena);
		$('#btnCrearPartida').on('click',function(){
			var nick=$('#nick').val();
			var numero=$('#numero').val();
			if(nick!=""){
				ws.crearPartida(nick,numero);
				ws.listarJugadores(numero);
			}
			//Controlar la entrada
			//mostrar Esperando rival
		});
	}
	
	this.mostrarEsperandoRival=function(){
		$('#mostrarER').remove();
		$('#mostrarUAP').remove();
		$('#mostrarCP').remove();
		var cadena='<div id="mostrarER">';
		cadena =cadena+ '<div class="form-group">';
		cadena=cadena+'<img src="cliente/img/cargando.gif">';
		cadena =cadena+ '</div>';
		cadena =cadena+ '<div class="form-group">';
		cadena=cadena+'<button type="button" id="btnIniciarPartida" class="btn btn-info">Iniciar Partida</button>';
		cadena =cadena+ '</div>';
		cadena=cadena +'</div>';
		$('#esperando').append(cadena);
		$('#btnIniciarPartida').on('click',function(){
			var nick=$('#nick').val();
			var numero=$('#numero').val();
			$('#mostrarER').remove();
			$('#mostrarUAP').remove();
			$('#mostrarCP').remove();
			ws.iniciarPartida(nick,numero);
			//Controlar la entrada
			//mostrar Esperando rival
		});
	}
	this.mostrarListarJugadores=function(lista){
		$('#mostrarLJ').remove();
		var cadena='<div id="mostrarLJ">';
		
		cadena =cadena+ '<div class="list-group">';
		cadena=cadena +'<label for ="jugadores">Jugadores:</label>';
		
		for(var i=0 ; i<lista.length;i++){
			cadena =cadena+ '<a href="#" value="'+lista[i].participante+'" class="list-group-item">'+lista[i].participante+' nick: '+lista[i].nick+'</a>';
		}
		cadena =cadena+ '</div>';
		cadena =cadena+ '</div>';
		$('#listarJugadores').append(cadena);
		
	}
	this.mostrarUnirAPartida=function(lista){
		$('#mostrarUAP').remove();
		var cadena='<div id="mostrarUAP">';
		
		cadena =cadena+ '<div class="list-group">';
		cadena=cadena +'<label for ="partidas">Partidas:</label>';
		
		for(var i=0 ; i<lista.length;i++){
			cadena =cadena+ '<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+' <span class="badge">'+lista[i].huecos+'/'+lista[i].maximo+'</span></a>';
		}
		cadena =cadena+ '</div>';
		cadena=cadena+'<button type="button" id="btnUnirAPartida" class="btn btn-info">Unir Partida</button>';
		
		cadena=cadena +'</div>';
		$('#unirAPartida').append(cadena);
		
		var StoreValue = []; //Declare array
		$(".list-group a").click(function(){
			StoreValue = []; //clear array
			StoreValue.push($(this).attr("value")); // add text to array
		});

		$('#btnUnirAPartida').on('click',function(){
			var nick=$('#nick').val();
			var codigo=StoreValue[0];
			if(nick!=""){

				ws.unirAPartida(nick,codigo);
				ws.listarJugadores(codigo);
			}
			//Controlar la entrada
			//mostrar Esperando rival
		});
	}
}
