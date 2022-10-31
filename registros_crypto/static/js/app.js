
function all_movements_handler() {
    movements_request = new XMLHttpRequest()
    movements_request.open("GET", "/api/v1/movimientos", true)
    movements_request.onload = all_movements
    movements_request.onerror = function() {
        show_connection_error("Error en la consulta de movimientos")

    }
    movements_request.send()
}
//Muestra todos los movimientos de la lista
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


function alta_handler() {
    alta_request = new XMLHttpRequest()
    alta_request.open("POST", "/api/v1/alta", true)
    alta_request.onerror = function() {
        show_connection_error("No se ha podido completar el alta")
    }
    alta_request.setRequestHeader("Content-type", "application/json")
    alta_request.send()
}

function status_handler() {

    status_request = new XMLHttpRequest()
    status_request.open("GET", "/api/v1/status", true)
    // status_request.onload = view_status
    status_request.onerror = function() {
        show_connection_error("Error en la peticion del estado")
        alert("No se ha podido completar la peticion del estado")
    }
    status_request.send()
}
// function view_status() {
    

//     if (this.readyState == 4 && this.status == 200) {
//         const wallet = JSON.parse(this.responseText)
//         const wallet_status = wallet.value

//         values_color(wallet_status.toFixed(2), "#invested")
//         values_color(wallet_status.toFixed(2), "#recovered")
//         values_color(wallet_status.toFixed(2), "#buy_value")
//         values_color(wallet_status.toFixed(2), "#current_value")
//         values_color(wallet_status.toFixed(2), "#profit")
//     }
//     else {
//         show_connection_error("Error en la consulta de movimientos")
//     }
// }


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
    calculator_request = new XMLHttpRequest()
    const url = '/api/v1/selec/+coin_from+/+coin_to+/+q_from+'
    calculator_request.open("GET", url, true)
    calculator_request.onerror = function(){
        show_connection_error("ERROR en la peticion de cambio")

    }
    calculator_request.send()
}




window.onload = function () {
    all_movements_handler()
    status_handler()
 
   document.getElementById("calculator").onclick = CalculatorExchange
   document.getElementById("form_alta").onclick = alta_handler
    
}

function show_connection_error(message){
    document.querySelector("#message_error").classList.remove("inactive")
    document.querySelector("#message_error").innerHTML = message
}


// Ver estado



// function values_color(value,id){
//     document.querySelector(id).innerHTML = value 
//     if (value>= 0){
//         document.querySelector(id).style.color = "green"          
//     }    
//     else{
//         document.querySelector(id).style.color = "red"
//     }
//  }
