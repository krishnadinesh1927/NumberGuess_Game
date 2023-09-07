from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/guess": {"origins": "http://localhost:3000"}})

@app.route("/guess", methods=["POST"])
def guess_number():
    Random_Number = random.randrange(1, 10)
    guess_number = request.json.get("guess")
    result = {}

    if guess_number == Random_Number:
        result["message"] = "Congratulations!! You guessed the correct number."
        result["number"] = Random_Number
    else:
        result["message"] = "Oops... Try again."

    print("Result:", result)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
