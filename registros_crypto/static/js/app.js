
function all_movements_handler() {
    movements_request = new XMLHttpRequest()
    movements_request.open("GET", "/api/v1/movimientos", true)
    movements_request.onload = all_movements
    movements_request.onerror = function() {
        show_connection_error("Error en la consulta de movimientos")

    }
    movements_request.send()
}

function all_movements() {
    if (this.readyState === 4) {
    
        if (this.status === 200) {
            
            

            const data = JSON.parse(this.responseText)
            const table = document.querySelector("#movements_table")
            const movements = data.data
            const message = document.querySelector("#message")
            if (movements.length == 0){
                message.style.display = "block";
                table.style.display = "none";
            }
            else {
                refresh()
                table.style.display = "block";
                message.style.display = "none";
            
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
            
        } else {

            show_connection_error("Se ha producido un error en la consulta de movimientos")
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


    if(value_from === "EUR" && value_to === "EUR"){
        pv = 1
    }


    alta_request = new XMLHttpRequest()
    alta_request.open("POST", "/api/v1/alta", true)

    alta_request.onreadystatechange = function(){
        
        if (alta_request.readyState === 4){
            
            if(alta_request.status === 201){
                
                all_movements_handler()
                status_handler()

            }
        }
    }

    alta_request.onerror = function() {
        show_connection_error("No se ha podido completar el alta")
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
    return false;
}

function status_handler() {

    status_request = new XMLHttpRequest()

    status_request.onreadystatechange = function(){
    if (status_request.readyState === 4){
        console.log(status_request.response);
        const data = JSON.parse(status_request.response).data;
        document.getElementById("invested").innerHTML = data.invertido;
        document.getElementById("recovered").innerHTML = data.recuperado;
        document.getElementById("buy_value").innerHTML = data.valor_compra;
        document.getElementById("current_value").innerHTML = data.valor_actual;
        document.getElementById("profit").innerHTML = data.beneficios;
        }
    }
    status_request.open("GET", "/api/v1/status", true)
    status_request.onerror = function() {
        show_connection_error("Error en la peticion del estado")
        alert("No se ha podido completar la peticion del estado")
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
    


function CalculatorExchange(){
    const select = document.getElementById("cryptos");
    const value_from = select.options[select.selectedIndex].value;
    const cFrom = document.getElementById("cantidad_from").value;
    const select2 = document.getElementById("cryptos2");
    const value_to = select2.options[select2.selectedIndex].value;

    calculator_request = new XMLHttpRequest()
    
    calculator_request.onreadystatechange = function(){
    if (calculator_request.readyState === 4 ) {
        console.log(calculator_request.response);
        const data = JSON.parse(calculator_request.response).data;
        document.getElementById("pvcrypto").value = data.pv;
        document.getElementById("pvcrypto").innerHTML = data.pv;
        document.getElementById("total_crypto").value  = data.q;
        document.getElementById("total_crypto").innerHTML  = data.q;

    }
    }

    const url = '/api/v1/selec/'+value_from+'/'+value_to+'/'+cFrom
    calculator_request.open("GET", url, true)
    calculator_request.onerror = function(){
        show_connection_error("ERROR en la peticion de cambio")

    }
    calculator_request.send()
}




window.onload = function () {
    all_movements_handler()
    status_handler()
 
   document.getElementById("calculator").addEventListener("click", CalculatorExchange)

   document.getElementById("myform").addEventListener("submit", alta_handler)
   
}

function show_connection_error(message){
    document.querySelector("#message_error").classList.remove("inactive")
    document.querySelector("#message_error").innerHTML = message
}




