var NameServicio="";
var itemevento=0;
var tiposervicio="";
var datosUsuario="";
var datosPassword="";
var codigoservicio="";
var datosg;
var tiposervice="";
var estado='no';
var nitproveedor="";
var detfechainiserv="";
var detfechafinserv="";
var detcapaserv="";
var capservicio="";
var conteventotal = "";

var isAuth = false;
var seleccionReserva = {};
var fechasReservasValidas = {};
var DataTemp = {};


var siteCustomer = 'http://181.48.24.156:8183/Servicios/api';

window.onhashchange = function () {
    if (isAuth == false) {
        document.location.href = "#inicio";
    }
}

//Definimos que la aplicación no tendrá efectos de transición para que funcione más rapido
$(document).bind("mobileinit", function(){
    $.event.special.swipe.scrollSupressionThreshold = 100;
	$.mobile.defaultPageTransition="none";
	$.mobile.transitionFallbacks='none';
	$.mobile.defaultDialogTransition = 'none';	
});

function ValidarLogin() {
datosUsuario = $("#nombredeusuario").val();
datosPassword = $("#clave").val();	
if(datosUsuario=="" || datosPassword==""){
   alert("Los campos no pueden estar vacios");
   return false;
}

var url=siteCustomer + '/Consumidor/Filter/?usuario='+datosUsuario+'&clave='+datosPassword+'';
$.ajax({ // ajax call starts
    url: url, // JQuery loads serverside.php 
    type: "GET",
    dataType: 'json', // Choosing a JSON datatype
    timeout: 5000,
    crossDomain: true,
    success: function (data) // Variable data contains the data we get from serverside
    {
        //alert('sucess');
                datosg = data;
                if (data.NomConsumidor != null) {

                    $('#coreeventos').empty();
                    $.mobile.changePage("#menu");

                    isAuth = true;          

                }
                else {
                    alert("El usuario o la clave no son validos");
                }
    },
    error: function (data) {
        alert("Los campos no pueden estar en blanco");
    }
});
	    
}


function ListarComidas(data){
    var i = 0;
    $("#coreeventos").empty();

 while (i < data.length) {     

         var datosReserva = {
               NitProveedor: data[i].NitProveedor,
               CedConsumidor: data[i].CedConsumidor,
               CodServicio: data[i].CodServicio,
               CodProducto: data[i].CodProducto
           };

           // '<img src="comida.jpg" style="width:200px;heigth:200px" />' +

           var crearItem = '<li data-section="Widgets" data-filtertext="selectmenus custom native multiple optgroup disabled forms" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li">' +
                '<div class="ui-btn-inner ui-li">' +               
                '<div class="ui-btn-text">' + data[i].DesProducto +
                '<br>' +
                '<button id = "vcedu3"  onclick="ConfirmarReserva(' + "'" + data[i].NitProveedor + "','" + data[i].CedConsumidor + "','" + data[i].CodServicio + "','" + data[i].CodProducto + "','" + data[i].DesProducto + "','" + data[i].ImaProducto + "','" + data[i].CanAsignada + "','" + data[i].ConReservasServicioConsumidor + "'" + ');" class="ui-btn-text">Reserva</button>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '<br>';

           $("#coreeventos").append(crearItem);         
		  
		 i=i+1;
   }
}

function ListarEventos(data){
    var i = 0;
	 while (i < data.Derechos.length){
		 NameServicio=data.Derechos[i].DesServicio;
		 codigoservicio=data.Derechos[i].CodServicio;
		 nitproveedor=data.Derechos[i].NitProveedor;
	
		 tiposervicio="c";
		  if(NameServicio=="Restaurante"){
		     tiposervicio="r";
		  }
		  if (NameServicio !== null) {
			  $("#coreeventos").append('<li data-section="Widgets" data-filtertext="selectmenus custom native multiple optgroup disabled forms" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><button id = "vcedu"  onclick="opcionservicio('+"'"+codigoservicio+"'"+',tiposervicio,'+"'"+nitproveedor+"'"+');" class="ui-btn-text">'+NameServicio+'</button></div></div></li><br>');     
		  }
		 i=i+1;
   }
}
function opcionservicio(cdv,tip,nitpro,cap){   
     cdv.replace(' ','');
	 tiposervice=cdv;
	 nitproveedor=nitpro;
	 capservicio=cap;
     cargarcontador(cdv,tip);
     $.mobile.changePage("#menucontrolscan");	 
}
function detalleservicio(fechainicio,fechafin,capacidad){
	 $("#detalle1").text('Fecha de inicio del servicio: '+fechainicio+'');
	 $("#detalle2").text('Fecha de finalización del servicio: '+fechafin+'');
	 $("#detalle3").text('Capacidad: '+capacidad+'');
	 $.mobile.changePage("#detalle");
}
function cargarcontador(cdv,tip) {
var url= siteCustomer + '/Proveedor/Filter/?id='+datosUsuario+'sx&clave='+datosPassword+'';	
	$.ajax({ // ajax call starts
          url: url, // JQuery loads serverside.php 
		  type:"GET",
          dataType: 'json', // Choosing a JSON datatype
          timeout: 5000,	
          crossDomain: true,		  
          success: function(data) // Variable data contains the data we get from serverside
          {   
		      //$('#datoscontador').empty();
			  $('.cont').empty();
              Mostrarcontador(data,cdv);		
          },
		  error: function(data){
		       alert("Error en la conexión");
		  }
      });
}
//Muestra el contador de inicio
function Mostrarcontador(datam,codiserv){
	var i=0;
	var total=0;
	while (i < datam.Servicios.length){
		  if (datam.Servicios[i].CodServicio == codiserv) {
		     total=(datam.Servicios[i].ConEntradas-datam.Servicios[i].ConSalidas);
			 //$("#datoscontador").append('<ul><li><a href="">Entradas: '+datam.Servicios[i].ConEntradas+'</a></li><li><a href="">Salidas: '+datam.Servicios[i].ConSalidas+'</a></li><li><a href="">Total evento: '+total+'</a></li></ul>');
	          $("#datoscontador1").text('Entradas: '+datam.Servicios[i].ConEntradas+'');
			  $("#datoscontador2").text('Salidas: '+datam.Servicios[i].ConSalidas+'');
			  $("#datoscontador3").text('Total evento: '+total+'');
	          $("#datconuno1").text('Entradas: '+datam.Servicios[i].ConEntradas+'');
	          $("#datconuno2").text('Salidas: '+datam.Servicios[i].ConSalidas+'');
	          $("#datconuno3").text('Total evento: '+total+''); 
              $("#contegresar1").text('Entradas: '+datam.Servicios[i].ConEntradas+'');
	          $("#contegresar2").text('Salidas: '+datam.Servicios[i].ConSalidas+'');
	          $("#contegresar3").text('Total evento: '+total+''); 	 
		  }
		 i=i+1;
    }           			  			  				
}
function validarqr(codigoqr) {
var fecha = new Date();
var fechaactual=(fecha.getMonth()+1)+'/'+fecha.getDate()+'/'+fecha.getFullYear()+' '+fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
var datosent=
{
   "NitProveedor":nitproveedor,
   "CedConsumidor":codigoqr,
   "CodServicio":tiposervice,
   "FecEntrada":fechaactual,
   "TipRegistro":"E",
   "Message":null,
   "ConRegistro":1,
   "CodProducto":""
}
//Se define la url del servicio
var url=siteCustomer + '/Registro/Add';	
	$.ajax({ // ajax call starts
          url: url, // JQuery loads serverside
		  type:"POST",
		  headers: { 
				 Accept : "text/plain; charset=utf-8",
				"Content-Type": "text/plain; charset=utf-8"
          },
          dataType: "json",
		  async: false,
          crossDomain: true,
          data: JSON.stringify(datosent),		  
          success: function(data) // Variable data contains the data we get from serverside
          {   
		      conteventotal=(data.ConEntradasServicio-data.ConSalidasServicio);
			  if(conteventotal<0){
			     conteventotal=0;
			  }
				  $('.cont').empty();
				  updatecounter(data.ConEntradasServicio,data.ConSalidasServicio);	
				  estado='si';
			  
			  if(conteventotal>capservicio){
			     capacidadevento(capservicio);
			  }
          },
		  error: function(data){
			   estado='no';
		  }
      });
	  return estado;
}
//Se actualiza el contador cuando existe una accion del lector qr, validar celdula y usuario anonimo
function updatecounter(entrada,salida){
       var numpersonevento=(entrada-salida);
	   if(numpersonevento<0){
	      numpersonevento=0;
	   }
	   $("#datoscontador1").text('Entradas: '+entrada+'');
	   $("#datoscontador2").text('Salidas: '+salida+'');
	   $("#datoscontador3").text('Total evento: '+numpersonevento+''); 
       $("#datconuno1").text('Entradas: '+entrada+'');
	   $("#datconuno2").text('Salidas: '+salida+'');
	   $("#datconuno3").text('Total evento: '+numpersonevento+''); 	
	   $("#contegresar1").text('Entradas: '+entrada+'');
	   $("#contegresar2").text('Salidas: '+salida+'');
	   $("#contegresar3").text('Total evento: '+numpersonevento+''); 	
}
function validarcedula(){
    var cedula=document.getElementById("numcedula").value;
	var fecha = new Date();
    var fechaactual=(fecha.getMonth()+1)+'/'+fecha.getDate()+'/'+fecha.getFullYear()+' '+fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
	//Se arma el objeto con los parametros a enviar
	var datosentc=
	{
	   "NitProveedor":nitproveedor,
	   "CedConsumidor":cedula,
	   "CodServicio":tiposervice,
	   "FecEntrada":fechaactual,
	   "TipRegistro":"E",
	   "Message":null,
	   "ConRegistro":1,
	   "CodProducto":""
	}
   var url=siteCustomer + '/Registro/Add';	  
   $.ajax({ // ajax call starts
          url: url, // JQuery loads serverside
		  type:"POST",
		  headers: { 
				 Accept : "text/plain; charset=utf-8",
				"Content-Type": "text/plain; charset=utf-8"
          },
          dataType: "json",
		  async: false,
          crossDomain: true,
          data: JSON.stringify(datosentc),			  
          success: function(data) // Variable data contains the data we get from serverside
          {   
		      conteventotal=(data.ConEntradasServicio-data.ConSalidasServicio);
			  if(conteventotal<0){
			      conteventotal=0;
			  }
				  $('.cont').empty();
				  updatecounter(data.ConEntradasServicio,data.ConSalidasServicio);
				  estado='si';
				  alert("La cédula es valida");
			  
			  if(conteventotal>capservicio){
			      capacidadevento(capservicio);
			  }			  
          },
		  error: function(data){
			  alert("La cédula "+cedula+" no es valida");
		  }
      });
}
function validaranonimo(){
    var fecha = new Date();
    var fechaactual=(fecha.getMonth()+1)+'/'+fecha.getDate()+'/'+fecha.getFullYear()+' '+fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
    var datosenta=
	{
	   "NitProveedor":nitproveedor,
	   "CedConsumidor":0,
	   "CodServicio":tiposervice,
	   "FecEntrada":fechaactual,
	   "TipRegistro":"E",
	   "Message":null,
	   "ConRegistro":1,
	   "CodProducto":""
	}
   var url=siteCustomer + '/Registro/Add';	
   $.ajax({ // ajax call starts
          url: url, // JQuery loads serverside
		  type:"POST",
		  headers: { 
				 Accept : "text/plain; charset=utf-8",
				"Content-Type": "text/plain; charset=utf-8"
          },
          dataType: "json",
		  async: false,
          crossDomain: true,
          data: JSON.stringify(datosenta),			  
          success: function(data) // Variable data contains the data we get from serverside
          {   
		      conteventotal=(data.ConEntradasServicio-data.ConSalidasServicio);
			  if(conteventotal<0){
			      conteventotal=0;
			  }
				  $('.cont').empty();
				  updatecounter(data.ConEntradasServicio,data.ConSalidasServicio);
				  alert("Usuario anónimo contado");
			  
			  if(conteventotal>capservicio){
			      capacidadevento(capservicio);
			  }	
          },
		  error: function(data){
		       alert("Error de conexión al servidor");
		  }
      });
}
function egresarusuarios(){
    var fecha = new Date();
    var fechaactual=(fecha.getMonth()+1)+'/'+fecha.getDate()+'/'+fecha.getFullYear()+' '+fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds();
    var datosenta=
	{
	   "NitProveedor":nitproveedor,
	   "CedConsumidor":0,
	   "CodServicio":tiposervice,
	   "FecEntrada":fechaactual,
	   "TipRegistro":"S",
	   "Message":null,
	   "ConRegistro":1,
	   "CodProducto":""
	}
   var url=siteCustomer + '/Registro/Add';	
   $.ajax({ // ajax call starts
          url: url, // JQuery loads serverside
		  type:"POST",
		  headers: { 
				 Accept : "text/plain; charset=utf-8",
				"Content-Type": "text/plain; charset=utf-8"
          },
          dataType: "json",
		  async: false,
          crossDomain: true,
          data: JSON.stringify(datosenta),			  
          success: function(data) // Variable data contains the data we get from serverside
          {   
		      conteventotal=(data.ConEntradasServicio-data.ConSalidasServicio);
			  if(conteventotal<0){
			      conteventotal=0;
			  }
				  $('.cont').empty();
				  updatecounter(data.ConEntradasServicio,data.ConSalidasServicio);
				  alert("Usuario descontado");
			  
			  if(conteventotal>capservicio){
			      capacidadevento(capservicio);
			  }	
          },
		  error: function(data){
		       alert("Error de conexión al servidor");
		  }
      });
}
function capacidadevento(capev){
    alert("Se llegó al límite de la capacidad del servicio de "+capev);    
}
//Se define la función del botón cerrar sesión
function closeapp(){
    document.getElementById("nombredeusuario").value="";
	document.getElementById("clave").value="";
	$.mobile.changePage("#inicio");

	isAuth = false;
	$.mobile.changePage("#inicio"); 
}

function ConfirmarReserva(NitProveedor, CedConsumidor, CodServicio, CodProducto, Producto, Img, CanAsignada, ConReservasServicioConsumidor) {

    if (ConReservasServicioConsumidor == CanAsignada) {
        alert('La reserva ya ha sido asignada');
        return false;
    }

    seleccionReserva = {
        NitProveedor: NitProveedor,
        CedConsumidor: CedConsumidor,
        CodServicio: CodServicio,
        CodProducto: CodProducto,
        Producto: Producto,
        Img: Img
    };

    $("#DesProducto").text(Producto);
    
	$.mobile.changePage("#confirmarReserva");
}

function Servicios() {
    var numRows = 0;
    $("#serviciosDisponiblesList").empty();

    while (numRows < datosg.Derechos.length) {

        if (datosg.Derechos[numRows].IndAlerta == 1) {

            var crearItem = '<li data-section="Widgets" data-filtertext="selectmenus custom native multiple optgroup disabled forms" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="false" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li">' +
                '<div class="ui-btn-inner ui-li">' +
                '<div class="ui-btn-text">' + datosg.Derechos[numRows].DesServicio +
                '<button id = "vcedu"  onclick="verMenus(' + "'" + 
                 datosg.Derechos[numRows].CedConsumidor + "','" +
                 datosg.Derechos[numRows].CodServicio + "','" +
                 datosg.Derechos[numRows].RanFinDisConsumo + "','" +
                 datosg.Derechos[numRows].RanFinDisServicio + "','" +
                 datosg.Derechos[numRows].RanIniDisConsumo + "','" +
                 datosg.Derechos[numRows].RanIniDisServicio + "','" +
                 datosg.Derechos[numRows].CanAsignada + "'" +
                 ');" class="ui-btn-text">Reservar</button>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '<br>';

            $("#serviciosDisponiblesList").append(crearItem);
        }  

        numRows  += 1;
    }

    $.mobile.changePage("#ServiciosDisponibles");
}


function verMenus(CedConsumidor, CodServicio, RanFinDisConsumo, RanFinDisServicio, RanIniDisConsumo, RanIniDisServicio, CanAsignada) {

    //Se válida la fecha
    var fechaSistema = new Date();
    var fechaActual = fechaSistema.getFullYear() + '' + ("0" + (fechaSistema.getMonth() + 1)).slice(-2) + '' + fechaSistema.getDate();

    var fechaIni = ExtraerFecha(RanFinDisServicio);
    var fechaFin = ExtraerFecha(RanFinDisServicio);

    var isValid = ComparFechasVersion2(fechaActual, fechaIni, fechaFin);

    if (!isValid) {
        alert('La reserva solo se puede realizar entre el ' + getDateString(RanFinDisServicio) + ' y el' + getDateString(RanIniDisServicio));
        return false;
    }   

    fechasReservasValidas = {
        RanFinDisConsumo: RanFinDisConsumo,
        RanIniDisConsumo: RanIniDisConsumo
    };

    var url = siteCustomer + '/Producto/Filter/?nit=' + datosg.NitProveedor + '&codServicio=' + CodServicio + '&cedConsumidor=' + CedConsumidor;
    $.ajax({ // ajax call starts
        url: url, // JQuery loads serverside.php 
        type: "GET",
        dataType: 'json', // Choosing a JSON datatype
        timeout: 5000,
        crossDomain: true,
        success: function (data) // Variable data contains the data we get from serverside
        {
            //DataTemp = data;
            ListarComidas(data);
        },
        error: function (data) {
            alert("Error en la conexión");
        }
    });
    
    $.mobile.changePage("#home");
}

function GuardarReserva() {

    // Validar Fecha Reserva Ingresada
    var fechaReserva = $("#date3").val();
    //var horaReserva = $("#horaReserva").val();

    if (fechaReserva == "" ) {
        alert('La fecha y hora de la reserva no esta seleccionado');
        return false;
    };

    var fechaReservaTemp = new Date(fechaReserva);
    
    // Validar Rango de Fecha Reservada
    var fechaReserva = fechaReservaTemp.getFullYear() + '' + ("0" + (fechaReservaTemp.getMonth() + 1)).slice(-2) + '' + ("0" + (fechaReservaTemp.getDate() )).slice(-2);

    var fechaIni = ExtraerFecha(fechasReservasValidas.RanIniDisConsumo);
    var fechaFin = ExtraerFecha(fechasReservasValidas.RanFinDisConsumo);

    var isValid = ComparFechasVersion2(fechaReserva, fechaIni, fechaFin);

    if (!isValid) {
        alert('El menú solo se puede reservar entre el ' + getDateString(fechasReservasValidas.RanIniDisConsumo) + ' y el ' + getDateString(fechasReservasValidas.RanFinDisConsumo));
        return false;
    }

    // Validar Rango de Hora Reserva
    var horaReservaTemp = ExtraerHora(fechaReservaTemp);
    var horaIni = ExtraerHora(fechasReservasValidas.RanIniDisConsumo);
    var horaFin = ExtraerHora(fechasReservasValidas.RanFinDisConsumo);

    var isValid = ComparFechasVersion2(horaReservaTemp, horaIni, horaFin);

    if (!isValid) {
        alert('El menú solo se puede reservar entre las horas: ' + getHourString(fechasReservasValidas.RanIniDisConsumo) + ' y ' + getHourString(fechasReservasValidas.RanFinDisConsumo));
        return false;
    }

    var confirmarfechaReserva = (fechaReservaTemp.getMonth() + 1) + '/' + fechaReservaTemp.getDate() + '/' + fechaReservaTemp.getFullYear() + ' ' + horaReserva + ':00';

    var datosReserva = {
        "NitProveedor": seleccionReserva.NitProveedor,
        "CedConsumidor": seleccionReserva.CedConsumidor,
        "CodServicio": seleccionReserva.CodServicio,
        "CodProducto": seleccionReserva.CodProducto,
        "FecReserva": confirmarfechaReserva,
        "NumReservas": 1,
        "Message": null}

    var url = siteCustomer + '/Reserva/Add';
    $.ajax({ // ajax call starts
        url: url, // JQuery loads serverside
        type: "POST",
        headers: {
            Accept: "text/plain; charset=utf-8",
            "Content-Type": "text/plain; charset=utf-8"
        },
        dataType: "json",
        async: false,
        crossDomain: true,
        data: JSON.stringify(datosReserva),
        success: function (data) // Variable data contains the data we get from serverside
        {
            alert('La reserva se realizo con éxito');
        },
        error: function (data) {
            alert("Error de conexión al servidor");
        }
    });
}


function ExtraerHora(horaconver) {

    var horavl = horaconver.getHours() + horaconver.getMinutes() + "00";
    //sacar hora
//    var dathoras = horaconver.split(":");
//    var segini = dathoras[2];
//    var minini = dathoras[1];
//    var hini = dathoras[0].substring(13, 11);
//    var horavl = hini + minini + segini;
    
    return horavl;
}
function ExtraerFecha(fechacover) {
    //sacar fecha
    var fechaci = fechacover.split("-");
    var diaini = fechaci[2].substring(0, 2);
    diaini = diaini.replace("T", "");
    var mesini = fechaci[1];
    var yearini = fechaci[0];
    var fechaval = yearini + mesini + diaini;
    return fechaval;
}
function ComparFechas(dato1, dato2) {
    var resultadocom;
    if (dato1 > dato2) {
        resultadocom = 1;
    }
    if (dato1 <= dato2) {
        resultadocom = 2;
    }
    return resultadocom;
}

function ComparFechasVersion2(fechaActual, fechaIni, fechaFin) {

    var isValid = false;

    if (fechaActual >= fechaIni && fechaActual <= fechaFin) {
        isValid = true;
    }

    return isValid;
}

function ExtraerHoraVersion2(horaconver) {
    //sacar hora
    var dathoras = horaconver.getMinutes;
    var hora = dathoras[0];
    var min = dathoras[1];

    var horavl = hora + min + "00";
   
    return horavl;
}

function getDateString(date) {

    var fechaTemp = date.split("T");    
    return fechaTemp[0];
}

function getHourString(date) {

    var fechaTemp = date.split("T");
    return fechaTemp[1];
}

function generarQR() {

    var QRImage = "data:image/png;base64," + datosg.CodQR

    $("#QRImage").attr("src", QRImage);

    $.mobile.changePage("#mostrarQR");
}


function Historico() { 

    var url = siteCustomer + '/Reserva/FilterH/?nit=999999999&codServicio=SRV002&cedConsumidor=713999';
    $.ajax({ // ajax call starts
        url: url, // JQuery loads serverside.php 
        type: "GET",
        dataType: 'json', // Choosing a JSON datatype
        timeout: 5000,
        crossDomain: true,
        success: function (data) // Variable data contains the data we get from serverside
        {        
            ListarHistorico(data);
        },
        error: function (data) {
            alert("Error en la conexión");
        }
    });

    $.mobile.changePage("#historico");
}

function ListarHistorico(dataHistorico) {

    var numRows = 0;
    $("#verHistorico").empty();

    var crearItem = '<tr>' +
            '<th>Fecha</th>' +
            '<th>Hora</th>' +
            '<th>Descripción</th>' +           
            '</tr>';

    $("#verHistorico").append(crearItem);      

    while (numRows < dataHistorico.length) {

        var crearItem = '<tr>' +
            '<th>' + getDateString(dataHistorico[numRows].FecReserva) + '</th>' +
            '<th>' + getHourString(dataHistorico[numRows].FecReserva) + '</th>' +
            '<th>' + dataHistorico[numRows].DesProducto + '</th>' +            
            '</tr>';

            numRows += 1;

            $("#verHistorico").append(crearItem);      
     };
    }

