# Aplicación Web para la simulación de un exchange simple de cryptomonedas 
   - **Con la aplicacion podras hacer conversiones de cryptomonedas a fiat o viceversa, con precios a tiempo real**.
   - **Las cryptomonedas disponibles en la aplicacion son las siguientes : BTC, ETH, BNB, XRP, ADA, DOT, MATIC y SOL**.
   - **La moneda fiat de intercambio en esta aplicacion es el EUR**.
### 1-Creacion de entorno virtual
   - Es recomendable crear un entorno virtual para que el proceso de instalacion y ejecucion de la aplicacion.
### 2- Intalacion de las dependencias del programa
   -  Para que no haya con las versiones que usamos es recomendable instalar las mismas dependencias que estan en el fichero _"requirements.txt"_
   - Usamos el siguiente comando:
    'pip install -r requirements.txt'

### 3- Creacion de la BD para guardar los movimientos. Usando el fichero _"/data/create.sql"._
   - **IMPORTANTE CREAR LA BD EN EL DIRECTORIO DE /DATA**
   - Desde el terminal usa los siguientes comandos:
    `sqlite3 Nombre_BD.db`
    `.read data/create.sql`
    `.q`
     - Tambien es posible crearlo usando un gestor de BD , que en nuestro caso es el DB Browser SQLite
    Para ello ejecutas la query de SQL que hay dentro del fichero data/create.sql.

### 4-Obtener una apikey de coinapi.io
   - Entras en la pagina de coinapi.io y solicita una apikey gratis que te da un max de 100 consultas diarias.
### 5- Modifica el fichero config_template.py
   - En ORIGIN_DATA cambias el nombre de la namedb.db al nombre de tu BD.
   - En APIKEY la apikey solicitada en coinapi.io
   - Por ultimo renombrar el fichero a "config.py"

### 6- Modifica el fichero .env_template
   - En este caso se pone en TRUE el FLASK_DEBUG
   - Y renombrar el fichero a ".env"    

### 7- Acceso a la aplicacion web
   - Primero tienes que activar el entorno virtual si aun no lo hiciste, y luego escribe:
    `flask run`
   - Luego de que tengas la aplicacion activa, entra en el navegador y escribe:
    `htttp://"La IP de tu servidor flask ": " El puerto de acceso"`.