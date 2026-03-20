# 🩺 Diabetes Prediction System

Un système complet de prédiction du risque diabétique chez la femme, du modèle Machine Learning jusqu'à l'interface utilisateur.

---

## 📌 Description

Ce projet est une application fullstack basée sur le **Supervised Learning**. Il prédit si une femme est à risque de diabète en analysant 8 paramètres biologiques, en utilisant un modèle **SVM (Support Vector Machine)** entraîné sur le dataset *Pima Indians Diabetes*.

---

## 🧠 Modèle ML

| Paramètre | Détail |
|---|---|
| Algorithme | Support Vector Machine (SVM) |
| Type | Classification binaire supervisée |
| Dataset | Pima Indians Diabetes (768 patientes) |
| Précision (train) | 76.7% |
| Précision (test) | 76.0% |

### Features utilisées
- Grossesses
- Glycémie (mg/dL)
- Pression artérielle (mm Hg)
- Épaisseur cutanée (mm)
- Insuline (μU/mL)
- IMC (kg/m²)
- Fonction Pedigree Diabète
- Âge

---

## ⚙️ Stack technique

**Backend**
- Python 3
- scikit-learn (SVM, StandardScaler)
- Flask + Flask-CORS
- Pickle (sérialisation du modèle)

**Frontend**
- React + Vite
- Tailwind CSS

---

## 🗂️ Structure du projet

```
diabets_prediction/
│
├── diabetes.csv                 # Dataset
├── diabets_prediction.ipynb     # Notebook d'entraînement
├── app.py                       # API Flask
├── model.pkl                    # Modèle SVM sérialisé
├── scaler.pkl                   # Scaler sérialisé
│
└── frontend/
    └── src/
        └── DiabetesPrediction.jsx
```

---

## 🚀 Lancer le projet

### 1. Cloner le repo
```bash
git clone https://github.com/Oussamma642/diabets_prediction.git
cd diabets_prediction
```

### 2. Entraîner le modèle et sauvegarder
Exécuter toutes les cellules du notebook `diabets_prediction.ipynb`, puis la cellule de sauvegarde :
```python
import pickle
with open("model.pkl", "wb") as f:
    pickle.dump(classifier, f)
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
```

### 3. Lancer le backend Flask
```bash
pip install flask flask-cors scikit-learn numpy
python app.py
```
> Le serveur tourne sur `http://localhost:5000`

### 4. Lancer le frontend React
```bash
cd frontend
npm install
npm run dev
```
> L'interface est accessible sur `http://localhost:5173`

---

## 📡 API Endpoint

| Méthode | Route | Description |
|---|---|---|
| POST | `/predict` | Retourne la prédiction |
| GET | `/health` | Vérifie que le serveur tourne |

**Exemple de requête POST `/predict` :**
```json
{
  "pregnancies": 2,
  "glucose": 120,
  "bloodPressure": 72,
  "skinThickness": 23,
  "insulin": 85,
  "bmi": 28.5,
  "dpf": 0.527,
  "age": 34
}
```

**Réponse :**
```json
{
  "result": "healthy",
  "status": "ok"
}
```

---

## ⚠️ Avertissement

Cet outil est développé à des fins **éducatives** uniquement. Il ne remplace en aucun cas un diagnostic médical professionnel. Consultez toujours un professionnel de santé qualifié.

---

## 👤 Auteur

**Oussama** — [GitHub](https://github.com/Oussamma642)
