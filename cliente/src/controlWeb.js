function ControlWeb($){
	this.mostrarCrearPartida=function(){
		var cadena='<div id="mostrarCP">';
		cadena =cadena+ '<div class="form-group">';
		cadena=cadena +'<label for ="nick">Nick:</label>';
		cadena=cadena +'<input type="text" class="form-control" id="nick">';
		cadena=cadena +'</div>';
		cadena =cadena+'<div class="form-group">';
		cadena=cadena +'<label for ="numero">Numero:</label>';
		cadena=cadena +'<input type="text" class="form-control" id="numero">';
		cadena=cadena +'</div>';
		cadena=cadena+'<button type="button" id="btnCrearPartida" class="btn btn-primary">Crear Partida</button>';
		cadena=cadena +'</div>';
		$('#crearPartida').append(cadena);
		$('#btnCrearPartida').on('click',function(){
			var nick=$('#nick').val();
			var numero=$('#numero').val();
			$("#mostrarCP").remove();
			ws.crearPartida(nick,numero);
			//Controlar la entrada
			//mostrar Esperando rival
		});
	}
	
	this.mostrarEsperandoRival=function(){
		$('#mostrarER').remove();
		$('#mostrarUAP').remove();
		$('#mostrarCP').remove();
		var cadena='<div id="mostrarER">';
		cadena=cadena+'<img src="cliente/img/cuadro.gif">';
		cadena=cadena +'</div>';
		$('#esperando').append(cadena);
	}
	this.mostrarUnirAPartida=function(lista){
		$('#mostrarUAP').remove();
		var cadena='<div id="mostrarUAP">';
		cadena =cadena+ '<div class="list-group">';
		
		for(var i=0 ; i<lista.length;i++){
			cadena =cadena+ '<a href="#" value="'+lista[i].codigo+'" class="list-group-item">'+lista[i].codigo+'huecos:'+lista[i].huecos+'</a>';
		}
		cadena =cadena+ '</div>';
		cadena=cadena+'<button type="button" id="btnUnirAPartida" class="btn btn-primary">Unir Partida</button>';
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
			$("#mostrarUAP").remove();
			ws.unirAPartida(nick,codigo);
			//Controlar la entrada
			//mostrar Esperando rival
		});
	}
}
