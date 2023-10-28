# Tecnologías utilizadas 

- Base de datos: MySQL
- API: FastAPI (Python)
- FrontEnd: NextJS (JavaScript)

# Instrucciones de ejecución

Para la ejecución hay 2 alternativas:

## 1.- Docker Compose:
 - En la carpeta raíz del proyecto ejecutar:  
 \$ docker compose up --build
 - En localhost:3000 se deberá poder ver la aplicación.
 - En localhost:8000/redoc se puede ver la documentación de la API

## 2.- Instalación normal:
 - Se debe contar con una base de datos de MySQL llamada "readconnect"
 - En la carpeta api crear un archivo .env con las siguientes variables:
    DATABASE_URL=mysql+mysqlconnector://root:<strong>clave</strong>@localhost:3306/readconnect  
    SECRET_KEY=<strong>secret key a elección</strong>  
    ALGORITHM=<strong>algoritmo a elección (sugerencia: HS256)</strong>  
    DATABASE_NAME=readconnect
 -  En carpeta api ejecutar:  
    \$ virtualenv venv
    \$ . /venv/Scripts/activate (Windows)
    \$ pip install -r requirements.txt
    \$ python init_db.py (Para crear tablas con SQLAlchemy)  
    \$ python populate_db.py (Para crear datos de libros)  
    \$ uvicorn app:app  
 -  Con esto la api estará disponible en localhost:8000
 -  En la carpeta front crear un archivo .env con las siguientes variables:  
    NEXT_PUBLIC_API_URL=http://localhost:8000
 -  Ejecutar:
    \$ npm install
    \$ npm run dev
 -  Con esto la aplicación estará disponible en localhost:3000



