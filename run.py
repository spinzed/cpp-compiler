from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        code = request.get_json()["kod"]
        print(code)
    elif request.method == "GET":
        return "saki"
    return render_template("index.html", req=request)

if __name__ == "__main__":
    app.run(debug = True)
