function clienteRest(){
	
	this.crearPartida=function(nick,num,callback){
		$.getJSON("/crearPartida/"+nick+"/"+num,function(data){    
    		console.log(data);
    		callback(data);
		});
	}
	this.unirAPartida=function(nick,codigo){
		$.getJSON("/unirAPartida/"+nick+"/"+codigo,function(data){    
    		console.log(data);
		});
	}
	this.listarPartidas=function(){
		$.getJSON("/listarPartidas",function(data){    
    		console.log(data);
		});
	}

}

function pruebas(){
	var codigo=undefined;
	rest.crearPartida("pepe",3,function(data){
		codigo=data.codigo;		
	});
	rest.crearPartida("pepe",4,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
	});
	rest.crearPartida("pepe",5,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
	});
	
	rest.crearPartida("pepe",6,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanito",codigo);
	});
	
	rest.crearPartida("pepe",7,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanito",codigo);
		rest.unirAPartida("juanillo",codigo);
	});
	
	rest.crearPartida("pepe",8,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanito",codigo);
		rest.unirAPartida("juanillo",codigo);
		rest.unirAPartida("juan antonio",codigo);
	});
	
	rest.crearPartida("pepe",9,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanito",codigo);
		rest.unirAPartida("juanillo",codigo);
		rest.unirAPartida("juan antonio",codigo);
		rest.unirAPartida("juan jose",codigo);
		
	});
	rest.crearPartida("pepe",10,function(data){
		codigo=data.codigo;
		rest.unirAPartida("juan",codigo);
		rest.unirAPartida("juani",codigo);
		rest.unirAPartida("juana",codigo);
		rest.unirAPartida("juanma",codigo);
		rest.unirAPartida("juanito",codigo);
		rest.unirAPartida("juanillo",codigo);
		rest.unirAPartida("juan antonio",codigo);
		rest.unirAPartida("juan jose",codigo);
		rest.unirAPartida("juan luis",codigo);
		
	});
	
	rest.crearPartida("pepe",11,function(data){
		codigo=data.codigo;		
	});
	

}
