from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        print(request.get_json()["kod"])
    else:
        pass
    return render_template("index.html", req=request)

if __name__ == "__main__":
    app.run(debug = True)