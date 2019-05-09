from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        code = request.get_json()["kod"]
        print(code)
        with open("compile.cpp", "w") as f:
            f.write(code)
        os.system("g++ compile.cpp -o program.exe && program.exe > result.txt")
        string = ""
        with open("result.txt", "r+") as f:
            lines = f.readlines()
            print(lines)
            for i, j in enumerate(lines):
                if i != 0:
                    string += "\n"
                string += j
        return string
    return render_template("index.html", req=request)

if __name__ == "__main__":
    app.run(debug = True)
