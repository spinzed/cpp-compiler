from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def index():
    if request.method == "POST":
        code = request.get_json()["kod"]
        with open("compile.cpp", "w") as f:
            f.write(code)
        if os.system("g++ compile.cpp -o program.exe 2> error.txt"):
            print("error")
            with open("error.txt", "r+") as f:
                error = ""
                lines = f.readlines()
                for i, j in enumerate(lines):
                    if i == 0:
                        error += "error"
                    error += "\n"
                    error += j
            return error  
        else:
            print("success")
            os.system("program.exe > result.txt")
            output = ""
            with open("result.txt", "r+") as f:
                lines = f.readlines()
                for i, j in enumerate(lines):
                    if i == 0:
                        output += "success"
                    output += "\n"
                    output += j
            return output
    return render_template("index.html", req=request)

if __name__ == "__main__":
    app.run(debug = True)
