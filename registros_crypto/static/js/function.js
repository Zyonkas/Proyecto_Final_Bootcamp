
//movimientos
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
                clear_tab()
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

//alta
function peticion_alta_new() {
    if (this.readyState === 4) {
        if (this.status === 201) {

            

            all_movements()
            peticion_status_handler()
            form_close()
            
            
        } else {
            show_connection_error("Se ha producido un error en el alta de movimientos")
            //alert("Se ha producido un error en el alta de movimientos")
        }
    }
}

function form_close(){
    clean_calc(["#crypto","#total_crypto","#text_time","#text_date"])  
    document.querySelector("#quantity_from").value = ""
    document.querySelector("#text_time").classList.remove("inactive")


    const btn_alta = document.querySelector("#btn_form_alta")
    if (btn_alta.innerHTML =='+'){
        btn_alta.innerHTML = '-' 
        document.querySelector("#form_alta").classList.remove("inactive")
        document.querySelector("#btn_aceptar").disabled=true   
        document.querySelector("#calculate").classList.remove("inactive")  
        document.querySelector("#quantity_from").focus();
        
    }
    
    else{
        btn_alta.innerHTML ='+'    
        document.querySelector("#form_alta").classList.add("inactive")
        document.querySelector("#btn_aceptar").disabled=false
        
        document.querySelector("#calculate").classList.add("inactive") 
    }

}

function show_alta() {


    clean_calc(["#crypto","#total_crypto","#text_time","#text_date"])  
    document.querySelector("#quantity_from").value = ""
    document.querySelector("#text_time").classList.remove("inactive")


    const btn_alta = document.querySelector("#form_new")
    if (btn_alta.innerHTML =='+'){
        btn_alta.innerHTML = '-' 
        document.querySelector("#form_alta").classList.remove("inactive")

        all_movements()

        document.querySelector("#btn_aceptar").disabled=true   
        document.querySelector("#calculate").classList.remove("inactive")  
        document.querySelector("#quantity_from").focus();
        
    }
    else{
        btn_alta.innerHTML ='+'    
        document.querySelector("#form_alta").classList.add("inactive")
        document.querySelector("#btn_aceptar").disabled=false
        
        document.querySelector("#calculate").classList.add("inactive") 
    }
    
}

function new_movement(ev) {
    ev.preventDefault()


    const date = document.querySelector("#text_date").innerText 
    const time = document.querySelector("#text_time").innerText 
    const moneda_from = document.querySelector("#selec_from").value

    const cantidad_from = document.querySelector("#quantity_from").value

    const moneda_to = document.querySelector("#selec_to").value
    const cantidad_to = document.querySelector("#crypto_total").innerText 

     

    status_operations()
    
    peticion_alta_handler({date:date, time:time, moneda_from:moneda_from, cantidad_from:cantidad_from, moneda_to:moneda_to, cantidad_to:cantidad_to})
    desmarcar_aceptar()
    
    
}



// estado

function coins(ev) {
    ev.preventDefault()


    document.querySelector("#text_error").classList.add("inactive")
    clean_calc(["#crypto","#total_crypo","#text_time","#text_date"])
    fin=true

    selec_from = document.querySelector("#selec_from").value
    selec_to   = document.querySelector("#selec_to").value
    quantity   = document.querySelector("#quantity_from").value

    if (selec_from === selec_to){       
        error_aceptar("Las monedas tiene que ser diferentes")
        return        
    }
    if (!quantity ||quantity <= 0){
        error_aceptar("La cantidad tiene que ser superior a 0")      
        return        
    }
    
    selec_from_coins(selec_from,selec_to,quantity)
    
}

function search_coins() {
    document.querySelector("#message_error").classList.add("inactive")
    const url = '/api/v1/selec_from'

    peticion_selec_from.open("GET", url, true)
    peticion_selec_from.onreadystagechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            const coins_wallet = JSON.parse(this.responseText)
            const available_coins = coins_wallet.data
            const all_coins = coins_wallet.all

            document.querySelector("#selec_from").innerHTML = ""
            const selec_from = document.querySelector("#selec_from")
            coins_combination(selec_from, available_coins)
            document.querySelector("#selec_to").innerHTML = ""
            const selec_to  = document.querySelector("#selec_to")
            coins_combination(selec_to, all_coins)


        }

    }
    peticion_selec_from.send()
}

function view_status() {
    clean_calc(["#invested", "#recovered", "#buy_value", "#current_value"], 0)

    if (this.readyState == 4 && this.status == 200) {
        const wallet = JSON.parse(this.responseText)
        const wallet_status = wallet.data

        values_types(wallet_status.invested.toFixed(2), "#invested")
        values_types(wallet_status.recovered.toFixed(2), "#recovered")
        values_types(wallet_status.buy_value.toFixed(2), "#buy_value")
        values_types(wallet_status.actual_value.toFixed(2), "#current_value")
        values_types(wallet_status.profit.toFixed(2), "#profit")
    }
    else {
        show_connection_error("Error en la consulta de movimientos")
    }
}


function status_operations(){
    const moneda_from = document.querySelector("#selec_from").value
    const cantidad_from = document.querySelector("#quantity_from").value
    const moneda_to = document.querySelector("#selec_to").value
    const cantidad_to = document.querySelector("#total_crypto").innerText 

     

    if (moneda_from === moneda_to){
        error_aceptar("Las monedas tiene que ser diferentes")       
        return        
    }
    if (!cantidad_from ||cantidad_from == 0){
        error_aceptar("La cantidad tiene que ser superior a 0")
        return        
    }

    if (!cantidad_to ||cantidad_to == 0){
        error_aceptar("Necesario calcular la tasa, clik en la calculadora")      
        return        
    }
    if(cantidad_from_calculada !=cantidad_from){
        error_aceptar("Necesario calcular la tasa. Valor de 'Q', incorrecto")        
        return     
    }

    if(selec_to_calculada != moneda_to){
        error_aceptar("Necesario calcular la tasa. Moneda 'to' diferente al calculo")      
        return     
    }
    if(selec_from_calculada != moneda_from){
        error_aceptar("Necesario calcular la tasa. Moneda 'from' diferente al calculo")      
        return 
    }


}

function error_aceptar(coment){
    
    document.querySelector("#text_error").classList.remove("inactive")
    document.querySelector("#text_error").innerHTML = coment
    desmarcar_aceptar()       
}


function desmarcar_aceptar(){
    
    cantidad_from_calculada = 0 
    selec_to_calculada = ""
    selec_from_calculada=""
    
    clean_calc(["#crypto","#total_crypto","#text_time","#text_date","#minutes","#seconds"]) 

    fin=true
    
    document.querySelector("#btn_aceptar").disabled=true
    document.querySelector("#calculate").classList.remove("inactive")
    document.querySelector("#quantity_from").focus();

}


function coins_combination(selec,coins){
    for (let i=0; i < coins.length; i++) {
        item = coins[i]

        let opt = document.createElement('option')
        opt.value = item
        opt.innerHTML = item
        selec.appendChild(opt)
            
    }

}

function values_types(value,id){
    document.querySelector(id).innerHTML = value 
    if (value>= 0){
        document.querySelector(id).style.color = "green"          
    }    
    else{
        document.querySelector(id).style.color = "red"
    }
 }


function clean_calc(list_id,value=""){    
    for (let i=0; i < list_id.length; i++) {
        document.querySelector(list_id[i]).innerHTML = value   
    }
}

function selec_from_coins(selec_from, selec_to, quantity) {
    document.querySelector("#message_error").classList.add("inactive")
    const url = '/api/v1/selec/'+selec_from+'/'+selec_to+'/'+quantity
    peticion_selec_from_coin.open("GET", url, true)
    peticion_selec_from_coin.onreadystagechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const coins_wallet = JSON.parse(this.responseText)
            const coin_price = coins_wallet.data

            document.querySelector("#total_crypto").innerHTML = coin_price.q.toFixed(8)
            document.querySelector("#crypto").innerHTML = coin_price.q.toFixed(8)

            document.querySelector("#text_time").innerHTML = coin_price.time
            document.querySelector("#text_time").classList.remove("inactive")
            document.querySelector("#text_date").innerHTML = precio_moneda.date
            document.querySelector("#text_date").classList.remove("inactive")
            document.querySelector("#calculate").classList.add("inactive")

            cantidad_from_calculada = quantity
            selec_from_calculada = selec_from
            selec_to_calculada = selec_to
            fin=true

        }
        else {
            if (this.status == 400) {
                const coins_wallet = JSON.parse(this.responseText)
                const status = coins_wallet.status
                if(status == "fail") {
                    document.querySelector("#text_error").classList.remove("inactive")
                    document.querySelector("#text_errrr").innerHTML = coins_wallet.message
                }
            }
        }
    }
    peticion_selec_from_coin.send()

}
function show_connection_error(message){
    document.querySelector("#message_error").classList.remove("inactive")
    document.querySelector("#message_error").innerHTML = message
}
