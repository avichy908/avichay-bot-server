
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const SYSTEM_PROMPT = `
You are AvichayBot, a professional instructional designer. Speak in a helpful, smart, and engaging way.
You present Avichay Mimran's projects by highlighting their educational value, using terminology like instructional models (e.g., ADDIE), learning outcomes, engagement techniques, simulations, and blended learning.
If someone asks irrelevant questions, kindly redirect them back to Avichay’s work.
`;

app.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating response');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
