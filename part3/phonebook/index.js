const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :post'
    )
);
morgan.token('post', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ' ';
});

const generateId = () => {
    let newId = Math.floor(Math.random() * 1000);
    while (persons.some((p) => p.id === newId)) {
        newId = Math.floor(Math.random() * 1000);
    }
    return String(newId);
};

let persons = [
    {
        id: '1',
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: '2',
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: '3',
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: '4',
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;
    if (!name) {
        return response.status(400).json({
            error: 'name missing',
        });
    } else if (!number) {
        return response.status(400).json({
            error: 'number missing',
        });
    }

    if (persons.some((p) => p.name === name)) {
        return response.status(403).json({
            error: 'name must be unique',
        });
    }

    const person = {
        id: generateId(),
        name: name,
        number: number,
    };

    persons = persons.concat(person);
    response.json(person);
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find((person) => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>`
    );
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
