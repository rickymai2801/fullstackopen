import { useState, useEffect } from 'react';
import './index.css';
import phonebookService from './services/persons';

const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return <div className="message">{message}</div>;
};

const Filter = ({ filter, setFilter }) => {
    return (
        <div>
            filter shown with{' '}
            <input value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
    );
};

const PersonForm = ({
    newName,
    newNumber,
    setNewName,
    setNewNumber,
    addPerson,
}) => {
    return (
        <form>
            <div>
                name:{' '}
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>
            <div>
                number:{' '}
                <input
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                />
            </div>
            <div>
                <button type="submit" onClick={addPerson}>
                    add
                </button>
            </div>
        </form>
    );
};

const Persons = ({ filteredList, deletePerson }) => {
    return (
        <ul>
            {filteredList.map((p) => {
                return (
                    <li key={p.id}>
                        {p.name} {p.number}
                        <button onClick={() => deletePerson(p.id, p.name)}>
                            delete
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};
const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        phonebookService.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    const addPerson = (event) => {
        event.preventDefault();
        const result = persons.find((p) => p.name === newName);
        if (result) {
            if (
                window.confirm(
                    `${newName} is already added to phonebook, replace the old number with a new one?`
                )
            ) {
                const updatePerson = { ...result, number: newNumber };
                phonebookService
                    .update(result.id, updatePerson)
                    .then((updated) => {
                        setPersons(
                            persons.map((p) =>
                                p.id === result.id ? updated : p
                            )
                        );
                        setMessage(`Changed number for ${updatePerson.name}`);
                    })
                    .catch((error) => {
                        if (error.response?.status === 404) {
                            setPersons(
                                persons.filter((p) => p.id !== result.id)
                            );
                            setMessage(
                                `Information of ${updatePerson.name} has already removed from server`
                            );
                        }
                    });
            }
        } else {
            const newPerson = {
                name: newName,
                number: newNumber,
                id: `${persons.length + 1}`,
            };
            phonebookService.create(newPerson).then((returnedPerson) => {
                setPersons(persons.concat(returnedPerson));
            });
            setMessage(`Added ${newPerson.name}`);
        }
        setTimeout(() => {
            setMessage(null);
        }, 5000);
        setNewName('');
        setNewNumber('');
    };

    const deletePerson = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            phonebookService.remove(id).then(() => {
                setPersons(persons.filter((p) => p.id !== id));
            });
        }
    };

    const filteredList =
        filter === ''
            ? persons
            : persons.filter((p) =>
                  p.name.toLowerCase().includes(filter.toLowerCase())
              );

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} />
            <Filter filter={filter} setFilter={setFilter} />
            <h3>add a new</h3>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                setNewName={setNewName}
                setNewNumber={setNewNumber}
                addPerson={addPerson}
            />
            <h3>Numbers</h3>
            <Persons filteredList={filteredList} deletePerson={deletePerson} />
        </div>
    );
};

export default App;
