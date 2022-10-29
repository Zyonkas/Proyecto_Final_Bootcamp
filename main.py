from flask import Flask

app = Flask(__name__, template_folder="./registros_crypto/templates", static_folder="./registros_crypto/static")

from registros_crypto.routes import *
