peticion_todos = new XMLHttpRequest()
peticion_alta = new XMLHttpRequest()
peticion_status = new XMLHttpRequest()

const saldo = {}
let cryptos = ["BTC", "ETH", "USDT", "BNB", "XRP", "ADA", "SOL", "DOT", "MATIC"]


function peticion_todos_handler() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            

            const los_datos = JSON.parse(this.responseText)
            const la_tabla = document.querySelector("#movements_table")
            const movimientos = los_datos.data
            const saldo = document.querySelector("#saldo")

            
            for (let i=0; i<cryptos.length; i++) {
                saldo[cryptos[i]] = 0;
            }

            for (let i=0; i < movimientos.length; i++){
                item = movimientos[i]
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

                la_tabla.appendChild(trow)
                
                
            }
            
        } else {
            alert("Se ha producido un error en la consulta de movimientos")
        }
    }
}

function peticion_alta_handler() {
    if (this.readyState === 4) {
        if (this.status === 201) {
            peticion_todos.open("GET", "/api/v1/movimientos", true)
            peticion_todos.onload = peticion_todos_handler
            peticion_todos.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
            peticion_todos.send()
        } else {
            alert("Se ha producido un error en el alta de movimientos")
        }
    }
}

function altaMovimiento(ev) {
    ev.preventDefault()

    const moneda_from = document.querySelector("#moneda_from").value
    const cantidad_from = document.querySelector("#cantidad_from").value
    const moneda_to = document.querySelector("#moneda_to").value
    const cantidad_to = document.querySelector("#cantidad_to").value

    if (moneda_from != "EUR" && Number(cantidad_from) > saldo[moneda_from]) {
        alert("No tienes saldo suficiente en " + moneda_from + "para continuar esta operacion")
        return
    }

    if (moneda_from === ""){
        alert("No has seleccionado ninguna divisa")
        return
    }

    if (cantidad_from == 0 || cantidad_from ==="") {
        alert("Debes introducir una cantidad distinta de cero")
        return
    }

    if (moneda_to === "") {
        alert("No has seleccionado ninguna divisa")
        return
    }
    if (cantidad_to == 0 || cantidad_to === ""){
        alert("Debes introducir una cantidad distinta de cero")
        return
    }

    
    peticion_alta.open("POST", "/api/v1/alta", true)
    peticion_alta.onload = peticion_alta_handler
    peticion_alta.onerror = function() { alert("No se ha podido completar la petición de movimientos")}
    peticion_alta.setRequestHeader("Content-Type", "application/json")

}

function peticion_status_handler() {

    peticion_status_handler.open("GET", "/api/v1/status", true)
    peticion_status_handler.onload = status_view
    peticion_status_handler.onerror = function() { alert("No se ha podidod completar la peticion de movimientos") }
    peticion_status_handler.send()
}

function status_view() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            const los_datos = JSON.parse(this.responseText)
            const saldo_status = los_datos.data

            document.querySelector("#invesment").innerHTML = saldo_status["invesment"]
            document.querySelector("#recovered").innerHTML = saldo_status["recovered"]
            document.querySelector("#buy_value").innerHTML = saldo_status["buy_value"]
            document.querySelector("#current_value").innerHTML = saldo_status["current_value"]
            document.querySelector("#profit").innerHTML = saldo_status["profit"]
        }
    } 

}


window.onload = function () {
    peticion_todos.open("GET", "/api/v1/movimientos", true)
    peticion_todos.onload = peticion_todos_handler
    peticion_todos.onerror = function() { alert("No se ha podido completar la peticion de movimientos")}
    peticion_todos.send()

    // document.querySelector("#btn_crear").addEventListener("click", 
    //     function(ev) {
    //         ev.preventDefault()
    //         document.querySelector("#movement_detail").classList.remove("inactive")
            
    //     }
    // )

    // document.querySelector("#btn_cerrar").onclick = function(ev) {
    //     ev.preventDefault()
    //     document.querySelector("#movement_detail").classList.add("inactive")
    // }

    // document.querySelector("#btn_aceptar").onclick = altaMovimiento

}