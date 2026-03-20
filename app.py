

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)  # Autorise React (port 5173) à appeler Flask (port 5000)

# Charger le modèle et le scaler au démarrage
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Récupérer les 8 valeurs dans le bon ordre
        features = [
            float(data["pregnancies"]),
            float(data["glucose"]),
            float(data["bloodPressure"]),
            float(data["skinThickness"]),
            float(data["insulin"]),
            float(data["bmi"]),
            float(data["dpf"]),
            float(data["age"]),
        ]

        # Standardiser et prédire
        input_array = np.array(features).reshape(1, -1)
        input_scaled = scaler.transform(input_array)
        prediction = model.predict(input_scaled)

        result = "diabetic" if prediction[0] == 1 else "healthy"
        return jsonify({"result": result, "status": "ok"})

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "SVM Diabetes"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)