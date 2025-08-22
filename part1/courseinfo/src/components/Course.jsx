const Header = ({ name }) => {
    return <h1>{name}</h1>;
};

const Part = ({ part }) => (
    <p>
        {part.name} {part.exercises}
    </p>
);

const Content = ({ parts }) => {
    return (
        <>
            {parts.map((part) => (
                <Part key={part.id} part={part} />
            ))}
        </>
    );
};

const Total = ({ parts }) => {
    let initial = 0;
    const excercisesArray = parts.map((part) => part.exercises);
    const total = excercisesArray.reduce((acc, curr) => acc + curr, initial);
    return <b>total of {total} exercises</b>;
};

const Course = ({ course }) => {
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
};

export default Course;
