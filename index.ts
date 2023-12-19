require('dotenv').config()
const express = require("express");
const OpenAI = require("openai");
const app = express();
const port = 3001;
const cors = require('cors')
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function pokeMaker(pokemonType){
    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant designed to output JSON. Include, name (string), level (string) Basic or Mega , healthPoints (int), attackName1 (string), attackDamage1 (int), attackName2 (string), attackDamage2 (int), description (1 sentence string), backstory (short 2 sentences string), imageGen (detailed description to generate image string) accentColor (list of rgb values), textColor (list of rgb values), type (string) either bug dark dragon electric fairy fighting fire flying ghost grass ground ice normal poison psychic rock steel water",
          },
          { role: "user", content: "Generate a uniqe pokemon card themed from "+ pokemonType },
        ],
        model: "gpt-3.5-turbo-1106",
        response_format: { type: "json_object" },
    });
    let output = JSON.parse(completion.choices[0].message.content)
    return output;
}

async function pokeImage(imagePrompt){
    const image = await openai.images.generate({
        prompt: imagePrompt + " NO TEXT, cartoon",
        model: "dall-e-3"
    });
    return image["data"][0]["url"];
}

app.get("/pokemonInfo", async function (req, res) {
    try{
        const out = await pokeMaker(req.query.type);
        res.send(out);
    } catch (err) {
        console.log(err);
    }
});

app.get("/pokemonImage", async function (req, res) {
    try{
        const out = await pokeImage(req.query.prompt);
        res.send(out);
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});
