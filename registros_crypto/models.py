import sqlite3
from config import ORIGIN_DATA, CRYPTOS


LIST_ALL_MOVEMENTS = "SELECT id, date, time, moneda_from, cantidad_from, moneda_to, cantidad_to FROM movements ORDER BY date, time;"
LIST_ALL_COINS = "SELECT moneda_from, cantidad_from, moneda_to, cantidad_to FROM movements;"
GET_QUANTITY_FOR_COIN = "SELECT cantidad_from, cantidad_to FROM movements WHERE moneda_from = ?"
INSERT_MOVEMENT = "INSERT INTO movements (date, time, moneda_from, cantidad_from, moneda_to, cantidad_to) values (?, ?, ?, ?, ?, ?);" 


def list_all_movements():
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    list = cur.execute(LIST_ALL_MOVEMENTS)
    columns = cur.description
    resultado = []

    for movement in list:
        id, date, time, moneda_from, cantidad_from, moneda_to, cantidad_to = [movement[i] for i in range(len(columns))]

        cantidad_from = round(cantidad_from, 2 if moneda_from == "EUR" else 8)
        cantidad_to = round(cantidad_to, 2 if moneda_to == "EUR" else 8)

        resultado.append({
            "id": id,
            "date": date,
            "time": time,
            "moneda_from": moneda_from,
            "cantidad_from": cantidad_from,
            "moneda_to": moneda_to,
            "cantidad_to": cantidad_to
        })

    return resultado

def list_all_coins():
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    list_coins = cur.execute(LIST_ALL_COINS)

    sell_coins = create_empty_coin_dict(CRYPTOS)
    buy_coins = create_empty_coin_dict(CRYPTOS)
    
    for row in list_coins:
        sell_coins[row[0]] += row[1]
        buy_coins[row[2]] += row[3]

    coins_wallet = ["EUR"]

    for coin in sell_coins:
        if coin != "EUR":
            if buy_coins[coin] > sell_coins[coin]:
                coins_wallet.append(coin)

    return coins_wallet, CRYPTOS

def check_balance_for_currency(coin_from):
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    balance = cur.execute(GET_QUANTITY_FOR_COIN, (coin_from))

    total_sell = 0
    total_buy = 0

    for q in balance:
        total_sell += q[0]
        total_buy += q[1]

    total_coin = total_buy - total_sell
    return total_coin    

def calculate_result_of_investments(exchange_to_eur):
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    list_coins = cur.execute(LIST_ALL_COINS)

    sell_coins = create_empty_coin_dict(CRYPTOS)
    buy_coins = create_empty_coin_dict(CRYPTOS)
    
    for row in list_coins:
        sell_coins[row[0]] += row[1]
        buy_coins[row[2]] += row[3]

    total_sell = 0
    total_buy = 0
    invested = 0
    recovered = 0

    for coin in sell_coins:
        if coin != "EUR":
            total_sell += exchange_to_eur[coin] * sell_coins[coin]
            total_buy += exchange_to_eur[coin] * buy_coins[coin]
        else:
            invested += sell_coins[coin]
            recovered += buy_coins[coin]

    buy_value = invested - recovered        
    current_value = total_buy - total_sell
    result = round(current_value, 2) - round(buy_value, 8)

    total = {
        "invertido": round(invested, 2),
        "recuperado": round(recovered, 2),
        "valor_compra": round(buy_value, 8),
        "valor_actual": round(current_value, 2),
        "resultado": round(result, 2)
    }

    return total


def insert(registro):
    conn = sqlite3.connect(ORIGIN_DATA)
    cur = conn.cursor()

    cur.execute(INSERT_MOVEMENT, registro)
    conn.commit()
    conn.close()


def create_empty_coin_dict(coins):
    return dict((x, 0.0) for x in coins)
 