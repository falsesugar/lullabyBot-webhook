const {dialogflow} = require('actions-on-google');
const functions = require('firebase-functions');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const app = dialogflow({debug: true});

app.intent('Default Welcome Intent', (conv) => {
  conv.ask("Hi! I'm your lullaby bot");
  // Complete your fulfillment logic and
  // send a response when the function is done executing
});

app.intent("get_lullaby", (conv) => {
    conv.ask("Tell me how you're feeling, and I will choose the best lullaby for you")
});

app.intent("mood", (conv, params) => {
    let mood = conv.query;
    let moodSentiment = sentiment.analyze(mood);
    let song = "";

    if (moodSentiment.score < 1.5) {
        song = `Rock-a-bye baby, on the tree tops,
        When the wind blows, the cradle will rock,
        When the bough breaks, the cradle will fall,
        And down will come baby, cradle and all`;
    } else if (moodSentiment.score >= 1.5 && moodSentiment.score < 3) {
        song = `Twinkle, twinkle, little star,
        How I wonder what you are.
        Up above the world so high,
        Like a diamond in the sky.
        When the blazing sun is gone,
        When he nothing shines upon,
        Then you show your little light,
        Twinkle, twinkle, all the night.`
    } else {
        song = `Old MacDonald had a farm
        Ee i ee i o
        And on his farm he had some cows
        Ee i ee i oh
        With a moo-moo here
        And a moo-moo there
        Here a moo, there a moo
        Everywhere a moo-moo
        Old MacDonald had a farm
        Ee i ee i o`
    }

    conv.ask(song);

});

exports.lullabyBot = functions.https.onRequest(app);
