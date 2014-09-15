function scanQR(){
var scanner = cordova.require("cordova/plugin/BarcodeScanner");
var resulval;
var resulret;
scanner.scan(
    function (result) 
	{
	  resulval=validarqr(result.text);
	  if(resulval=="si"){
	    resulret="Usuario valido";
	  }
	  if(resulval=="no"){
	    resulret="Usuario no valido";
	  }	
	  document.getElementById("cedula").value=result.text;
	  document.getElementById("resultado").value=resulret;
    }, 
        function (error) 
	    {
            alert("Scanning failed: " + error);
        }
    );
};