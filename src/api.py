from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Hello, World!"

@app.route('/analyze-sentiment', methods=['POST'])
def perform_sentiment_analysis():
    data = request.get_json()
    text = data['text']
    result = analyze_sentiment(text)

    # Ajoutez le texte du poste et le résultat de l'analyse de sentiment dans la collection de posts
    new_post = {
        'text': text,
        'sentiment': result
    }
    # Faites quelque chose pour ajouter new_post à votre collection de posts (par exemple, une opération de base de données pour insérer un nouvel enregistrement)

    return jsonify(new_post)

def analyze_sentiment(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity

    if sentiment > 0:
        return "+"
    elif sentiment < 0:
        return "-"
    else:
        return "0"

if __name__ == '__main__':
    app.run()
