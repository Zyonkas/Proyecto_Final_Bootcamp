peticion_todos = new XMLHttpRequest()
peticion_alta = new XMLHttpRequest()
peticion_status = new XMLHttpRequest()
peticion_selec_from = new XMLHttpRequest()
peticion_selec_coin = new XMLHttpRequest()



function all_movements_handler() {
    document.querySelector("#message_error").classList.add("inactive")
    peticion_todos.open("GET", "/api/v1/movimientos", true)
    peticion_todos.onload = all_movements
    peticion_todos.onerror = function() {
        show_connection_error("Error en la consulta de movimientos")

    }
    peticion_todos.send()
}

function peticion_alta_handler(mov) {
    document.querySelector("#message_errror").classList.add("inactive")
    peticion_alta.open("POST", "/api/v1/alta", true)
    peticion_alta.onload = peticion_alta_new
    peticion_alta.onerror = function() {
        show_connection_error("No se ha podido completar el alta")
    }
    peticion_alta.setRequestHeader("Content-type", "application/json")
    const data_json = JSON.stringify(mov)
    peticion_alta.send(data_json)
}

function peticion_status_handler() {

    document.querySelector("#message_error").classList.add("inactive")
    peticion_status.open("GET", "/api/v1/status", true)
    peticion_status.onload = view_status
    peticion_status.onerror = function() {
        show_connection_error("Error en la peticion del estado")
        alert("No se ha podido completar la peticion del estado")
    }
    peticion_status.send()
}




window.onload = function () {
    peticion_todos.open("GET", "/api/v1/movimientos", true)
    peticion_todos.onload = all_movements
    peticion_todos.onerror = function() {
        show_connection_error("Error en la consulta de movimientos")
    }
    peticion_todos.send()
    peticion_status_handler()

    document.querySelector("btn_business").onclick = show_alta
    document.querySelector("#calculate").onclick = coins
    document.querySelector("#btn_aceptar").onclick = new_movement
    document.querySelector("#btn_actualizar").onclick = peticion_status_handler
    
    const input = document.querySelector('#quantity_from')
    input.addEventListener('change', status_operations)
    document.querySelector('#selec_from').addEventListener('change', status_operations)
    document.querySelector('#selec_to').addEventListener('change', status_operations)
}