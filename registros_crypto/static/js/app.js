
function all_movements_handler() {
    movements_request = new XMLHttpRequest()
    movements_request.open("GET", "/api/v1/movimientos", true)
    movements_request.onload = all_movements

    
    movements_request.send()
}

function all_movements() {
    if (this.readyState === 4) {
    
        if (this.status === 200) {
            
            

            const data = JSON.parse(this.responseText)
            const table = document.querySelector("#movements_table")
            const movements = data.data
            const message = document.querySelector("#message_error")
            if (movements.length == 0){
                message.style.display = "block";
                table.style.display = "none";
            }
        
            
                for (let i=0; i < movements.length; i++){
                    item = movements[i]
                    const trow = document.createElement("tr")

                    const tddate = document.createElement("td")
                    tddate.innerHTML = item.date
                    trow.appendChild(tddate)

                    const tdtime = document.createElement("td")
                    tdtime.innerHTML = item.time
                    trow.appendChild(tdtime)
                    
                    const tdmoneda_from = document.createElement("td")
                    tdmoneda_from.innerHTML = item.moneda_from
                    trow.appendChild(tdmoneda_from)
                    
                    const tdcantidad_from = document.createElement("td")
                    tdcantidad_from.innerHTML = item.cantidad_from
                    trow.appendChild(tdcantidad_from)
                    
                    const tdmoneda_to = document.createElement("td")
                    tdmoneda_to.innerHTML = item.moneda_to
                    trow.appendChild(tdmoneda_to)
                    
                    const tdcantidad_to = document.createElement("td")
                    tdcantidad_to.innerHTML = item.cantidad_to
                    trow.appendChild(tdcantidad_to)

                    table.appendChild(trow)
                }    
                
            }
            
    
}
}
    

function refresh(){
    const table = document.querySelector("#movements_table")
    table.innerHTML = ""
    const trow = document.createElement("tr")
    
    const thdate = document.createElement("th")
    const thtime = document.createElement("th")
    const thmoneda_from = document.createElement("th")
    const thcantidad_from = document.createElement("th")
    const thmoneda_to = document.createElement("th")
    const thcantidad_to = document.createElement("th")

    thdate.innerHTML = "Fecha"
    thtime.innerHTML = "Hora"
    thmoneda_from.innerHTML = "From"
    thcantidad_to.innerHTML = "Cantidad"
    thmoneda_to.innerHTML = "To"
    thcantidad_to.innerHTML = "Cantidad"

    trow.appendChild(thdate)
    trow.appendChild(thtime)
    trow.appendChild(thmoneda_from)                 
    trow.appendChild(thcantidad_from)
    trow.appendChild(thmoneda_to)
    trow.appendChild(thcantidad_to)


    table.appendChild(trow)

}


function alta_handler(ev){
    ev.preventDefault();

    let date = new Date().toJSON().slice(0, 10);
    let time = new Date().toJSON().slice(11, 19)

    const select = document.getElementById("cryptos");
    const value_from = select.options[select.selectedIndex].value;

    const cFrom = document.getElementById("cantidad_from").value;

    const select2 = document.getElementById("cryptos2");
    const value_to = select2.options[select2.selectedIndex].value;
    const pv = document.getElementById("pvcrypto").value;

    // Validador para que al hacer las compras y se de alta compruebe que  los datos de pv y total esten vacios, en caso contrario salte un error 
    if(validatorPV()){

   



    alta_request = new XMLHttpRequest()
    alta_request.open("POST", "/api/v1/alta", true)

    alta_request.onreadystatechange = function(){
        ev.preventDefault();  
            if (alta_request.readyState === 4){
            
                if(alta_request.status === 201){
                
                all_movements_handler()
                status_handler()
                 document.getElementById("pvcrypto").value = "";
                document.getElementById("pvcrypto").innerHTML = "";
                document.getElementById("total_crypto").value  = "";
                document.getElementById("total_crypto").innerHTML  = "";
                HideBuy();
                document.getElementById("cryptos").disabled = false;
                document.getElementById("cryptos2").disabled = false;
                document.getElementById("cantidad_from").disabled = false;

                }
            }   
    }

    alta_request.setRequestHeader("Content-type", "application/json")
    alta_request.send(JSON.stringify({
        "date": date,
        "time": time,
        "moneda_from": value_from,
        "cantidad_from": cFrom,
        "moneda_to": value_to,
        "cantidad_to": pv * cFrom,


    }))
    }
    return false;
}

function status_handler() {

    status_request = new XMLHttpRequest()

    status_request.onreadystatechange = function(){
    if (status_request.readyState === 4){
    
        const data = JSON.parse(status_request.response).data;
        document.getElementById("invested").innerHTML = data.invertido;
        document.getElementById("recovered").innerHTML = data.recuperado;
        document.getElementById("buy_value").innerHTML = data.valor_compra;
        document.getElementById("current_value").innerHTML = data.valor_actual;
        document.getElementById("profit").innerHTML = data.beneficios;
        }
        if (status_request.status >= 400){
            alert("ERROR en la peticion")
        }
    }
    status_request.open("GET", "/api/v1/status", true)
    status_request.onerror = function() {
       
        show_connection_error("Error en la peticion del estado")
        
    }
    status_request.send()
}


function selec_from() {
    selec_request = new XMLHttpRequest()
    
    const url = '/api/v1/selec_from'

    selec_request.open("GET", url, true)
    selec_request.onerror = function() {
       
        show_connection_error("ERROR en la consulta de datos")
    }
    selec_request.send()
    
}
    


function CalculatorExchange(ev){
    ev.preventDefault() 
    const select = document.getElementById("cryptos");
    const value_from = select.options[select.selectedIndex].value;
    const cFrom = document.getElementById("cantidad_from").value;
    const select2 = document.getElementById("cryptos2");
    const value_to = select2.options[select2.selectedIndex].value;

    // Validador de monedas iguales para que no llame al servidor al intentar hacer el calculo si es el caso, en caso contrario salte un error controlado
    if (validatorCalculator()){

    

    calculator_request = new XMLHttpRequest()
    
    calculator_request.onreadystatechange = function(){

        if (calculator_request.readyState === 4 && calculator_request.status === 200 ) {
            
            const data = JSON.parse(calculator_request.response).data;
            document.getElementById("pvcrypto").value = data.pv;
            document.getElementById("pvcrypto").innerHTML = data.pv;
            document.getElementById("total_crypto").value  = data.q;
            document.getElementById("total_crypto").innerHTML  = data.q;
            ShowBuy();
            document.getElementById("cryptos").disabled = true;
            document.getElementById("cryptos2").disabled = true;
            document.getElementById("cantidad_from").disabled = true;
            }
            if(calculator_request.status !== 200 && calculator_request.readyState === 4){
                const msg = JSON.parse(calculator_request.response).mensaje;
                document.getElementById("pvcrypto").value = "";
                document.getElementById("pvcrypto").innerHTML = "";
                document.getElementById("total_crypto").value  = "";
                document.getElementById("total_crypto").innerHTML  = "";
                HideBuy();
                alert("Error!" + msg)

            }
          
    }
          

    const url = '/api/v1/selec/'+value_from+'/'+value_to+'/'+cFrom
    calculator_request.open("GET", url, true)
    calculator_request.send()
    }
}

// Validador para que monedas iguales
function validatorCalculator(){
    const select = document.getElementById("cryptos");
    const value_from = select.options[select.selectedIndex].value;
    const select2 = document.getElementById("cryptos2");
    const value_to = select2.options[select2.selectedIndex].value;
    const result = true;

    
    if (value_from === value_to){
        alert("Seleccione dos monedas diferentes");
        result = false;
    }
    
    return result;
    
}

// Validador para que el pv y el total 
function validatorPV(){
    const pv = document.getElementById("pvcrypto").value;
    const q = document.getElementById("total_crypto").value;
    const result = true;

    if(pv === "" || pv === undefined){
        alert("Precio venta invalido")
        result = false
    }

    if(q === "" || q === undefined){
        alert("Total incorrecto")
        result = false
    }
    return result

}

function ShowBuy(){
    document.getElementById("btn_buy").style.display = "block";    
}

function HideBuy(){
    document.getElementById("btn_buy").style.display = "none"
}


window.onload = function () {
    all_movements_handler()
    status_handler()

    
   document.getElementById("calculator").addEventListener("click", CalculatorExchange)
   document.getElementById("myform").addEventListener("submit", alta_handler)
  
}
