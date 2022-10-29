import requests
from config import APIKEY, CRYPTOS

class ModelError(Exception):
    pass

class CoinApiStatus:
    def __init__(self):
        self.exchange_to_eur = {}

    def retrieve_exchange_to_eur_rates(self):
        try:
            r = requests.get(f"https://rest.coinapi.io/v1/exchangerate/EUR?apikey={APIKEY}")
        except requests.ConnectionError:
            raise ModelError("Failed to establish a new connection")

        resultado = r.json()

        if r.status_code == 200:

            coinapi_rates = [rate for rate in resultado["rates"] if rate["asset_id_quote"] in CRYPTOS]
            for currency_rate in coinapi_rates:
                self.exchange_to_eur[currency_rate["asset_id_quote"]] = 1 / currency_rate["rate"]
            else:
                raise ModelError(f"{r.status_code}: {resultado['error']}")     
    

    def get_exchange_rate(self, coin_from, coin_to):
        try:
            r = requests.get(f"https://rest.coinapi.io/v1/exchangerate/{coin_from}/{coin_to}?apikey={APIKEY}")
        except requests.ConnectionError:
            raise ModelError("Failed to establish a new connection")

        resultado = r.json()

        if r.status_code == 200:
            return resultado["rate"], resultado["time"][0:10], resultado["time"][11:19]
        else:
            raise ModelError(f"{r.status_code}: {resultado['error']}")