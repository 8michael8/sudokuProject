#To create the server: python -m venv <path>
#To activate the server: .\<end\name>\Scripts\activate
#To Run server: python server.py

from flask import Flask

app = Flask(__name__)

# Members API Route

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}


if __name__ == "__main__":
    app.run(debug=True)