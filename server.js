const express = require('express');
const hbs = require('hbs');
const path = require('path');
const fs = require('fs');
const app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data/problems.json', 'utf8'));

    res.render('index.hbs', {
        problems: JSON.stringify(data, null, 2)
            .replace(/</g, '\\u003c')
    });
});

app.get('/add', (req, res) => {
    const data = JSON.parse(fs.readFileSync('data/problems.json', 'utf8'));
    res.render('add.hbs', {problems: data.problems});
})

app.post('/add/submit', (req, res) => {
    const { source, timeLimit, problem, answer } = req.body;
    console.log(`Registering ${source}...`);

    if (!source || !timeLimit || !problem || !answer) {
    console.error("At least one required field is missing! ", { source, timeLimit, problem, answer });
    return res.status(400).send("At least one required field is missing!")
    }

    try {
      const problems = JSON.parse(fs.readFileSync('data/problems.json', 'utf8'));
      problems["problems"].push( { source, timeLimit, problem, answer } );
      fs.writeFileSync('data/problems.json', JSON.stringify(problems, null, 2));
      res.redirect('/add');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering the problem!');
    }
});

app.listen(3000, () => {
    console.log("Server is running: http://localhost:3000/")
})