import { useState } from 'react';

const Button = ({ onClick, text }) => {
    return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{text === 'positive' ? `${value} %` : `${value}`}</td>
        </tr>
    );
};

const Statistics = ({ good, neutral, bad }) => {
    const all = good + neutral + bad;
    if (all) {
        return (
            <table>
                <tbody>
                    <StatisticLine text="good" value={good} />
                    <StatisticLine text="neutral" value={neutral} />
                    <StatisticLine text="bad" value={bad} />
                    <StatisticLine text="all" value={good + neutral + bad} />
                    <StatisticLine
                        text="average"
                        value={(good + 0 * neutral - bad) / all}
                    />
                    <StatisticLine text="positive" value={(good / all) * 100} />
                </tbody>
            </table>
        );
    }
    return <p>No feedback given</p>;
};

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const all = good + neutral + bad;

    const handleGoodClick = () => {
        setGood(good + 1);
    };

    const handleNeutralClick = () => {
        setNeutral(neutral + 1);
    };

    const handleBadClick = () => {
        setBad(bad + 1);
    };

    return (
        <div>
            <h1>give feedback</h1>
            <Button onClick={handleGoodClick} text="good" />
            <Button onClick={handleNeutralClick} text="neutral" />
            <Button onClick={handleBadClick} text="bad" />
            <h1>statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
