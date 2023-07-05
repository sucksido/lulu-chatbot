const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/search', (req, res) => {
  const { searchString } = req.body;

  // Read the data.json file
  const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

  const queryWords = searchString.toLowerCase().split(" ");
  const matchedResponses = data.intents.filter((intent) => {
    return intent.patterns.some((pattern) => {
      const patternWords = pattern.toLowerCase().split(" ");
      return queryWords.some((word) => patternWords.includes(word));
    });
  });

  if (matchedResponses.length > 0) {
    const responseMessages = matchedResponses.map((response) => response.responses.default);
    res.json({ messages: responseMessages });
  } else {
    res.json({ message: "No matching response found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});