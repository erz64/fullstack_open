const AllCourses = ({courses}) => {
    return (
      courses.map(course => <Course key={course.id} course={course} />)
    )
  }
  const Course = ({ course }) => {
    return (
      <>
        <Header key={course.id} course={course.name} />
        <Content key={course.parts.id} parts={course.parts} />
        <Total sum={CalculateTotal(course.parts)} />
      </>
    )
  }
  const CalculateTotal = (parts) => {
  
    const exercises = parts.map(part => part.exercises)
    const total = exercises.reduce((partialSum, a) => partialSum + a, 0)
    return (total)
  }
  
  
  
  const Header = ({ course }) => <h1>{course}</h1>
  
  const Total = ({ sum }) => <p>Number of exercises {sum}</p>
  
  const Part = ({ part }) =>
    <p>
      {part.name} {part.exercises}
    </p>
  
  const Content = ({ parts }) =>
    <>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </>

export default AllCourses