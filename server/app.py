from flask import Flask
from api import api
from flask_cors import CORS

app = Flask(__name__)

cors = CORS(app, origin=['http://localhost:3000'])

app.register_blueprint(api)


if __name__ == "__main__":
    app.run(debug=True)
