from textblob import TextBlob

def analyze_sentiment(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity

    if sentiment > 0:
        return "+"
    elif sentiment < 0:
        return "-"
    else:
        return "0"
    # return sentiment

# Exemple d'utilisation
text = "hello world"
sentiment = analyze_sentiment(text)
print(f"Le sentiment associé au texte est : {sentiment}")
