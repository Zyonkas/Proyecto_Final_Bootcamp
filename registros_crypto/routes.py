from ctypes.wintypes import HLOCAL
from email.policy import HTTP
import sqlite3
from flask import render_template, request
from main import app
from registros_crypto.models import list_all_movements, insert, check_balance_for_currency, list_all_coins, calculate_result_of_investments
from registros_crypto.coinapi import ModelError, CoinApiStatus


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/v1/movimientos", methods=["GET"])
def lista_movimientos():
    try:
        registros = list_all_movements()

        return {
            "data" : registros, 
            "status" : "success"
        }
    except sqlite3.Error as e:
        return return_json_fail(str(e), 400, "ERROR! En la consulta de los movimientos")

@app.route("/api/v1/alta", methods=["POST"])
def alta():
    
    alta = request.json

    moneda_from = alta["moneda_from"]
    if alta["moneda_from"] != "EUR":

        sufficient_quantity = check_balance_for_currency(moneda_from)
        try:
            quantity_change = float(alta["cantidad_from"])
        except:
            error_msg = "Cantidad incorrecta, solo valores numericos"
            return return_json_fail(error_msg, 400, error_msg)
    
    if alta["moneda_from"] == "EUR" or sufficient_quantity >= quantity_change:
    
        try:
            insert(
                [
                    alta["date"],
                    alta["time"],
                    alta["moneda_from"],
                    alta["cantidad_from"],
                    alta["moneda_to"],
                    alta["cantidad_to"]
                ]
        )

            monedas = list_all_coins()
            return {
                    "status": "success",
                    "monedas": monedas
                }, 201

        except sqlite3.Error as e:
            return return_json_fail(str(e), 400, "ERROR! En la creacion del movimiento")

    else:
        error_msg = "Saldo insuficiente"
        return return_json_fail(error_msg, 400, error_msg)
             

@app.route("/api/v1/status", methods=["GET"])
def status_movements():
    try:
        coinapi_status = CoinApiStatus()
        coinapi_status.retrieve_exchange_to_eur_rates()
        data = calculate_result_of_investments(coinapi_status.exchange_to_eur)

        return {
            "status": "success",
            "data": data
        }

    except ModelError as e:
        print(str(e))
        return return_json_fail(str(e), 400, "ERROR! en la conexión con la API")
    except sqlite3.Error as e:
        print(str(e))
        return return_json_fail(str(e), 400, "ERROR, en la conexión con la Base de Datos")

@app.route("/api/v1/selec_from", methods=["GET"])
def select_from():
    try:
        coins_wallet, all_coins = list_all_coins()
        return {
            "status": "success",
            "data": coins_wallet,
            "todas": all_coins
        }

    except sqlite3.Error as e:
        return return_json_fail(str(e), 400, "ERROR, en la conexión con la Base de Datos")

@app.route("/api/v1/selec/<coin_from>/<coin_to>/<q_from>", methods=["GET"])
def select(coin_from, coin_to, q_from):
    try:
        assert coin_from != coin_to
        assert float(q_from) > 0
        assert q_from != ""
        assert coin_from != ""
        assert coin_to != ""
        quantity_change = float(q_from)
    except AssertionError:
        error_msg = "Datos Incorrectos"
        return return_json_fail(error_msg, 400, error_msg)

    sufficient_quantity = 0
    if coin_from != "EUR":
        sufficient_quantity = check_balance_for_currency(coin_from)

    if coin_from == "EUR" or sufficient_quantity >= quantity_change:
        try:
            c = CoinApiStatus()
            rate, date, time = c.get_exchange_rate(coin_from, coin_to)

            return {
                "data": {
                    "q": rate * quantity_change,
                    "pv": rate,
                    "time": time,
                    "date": date
                },
                "status": "success"
            }

        except ModelError as e:
            return return_json_fail(str(e), 400, "No se ha podido establecer la conexión")

    else:
        error_msg = f"Cantidad insuficiente de {coin_from}, en tu cartera"
        return return_json_fail(error_msg, 400, error_msg)


def return_json_fail(comment, http_error, message):
    return {
               "status": "fail",
               "data": comment,
               "mensaje": message
           }, http_error
           