import './App.css';
import Todo from "./components/Todo";
import React, { useState, useRef, useEffect } from "react";
import MyForm from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";
import { Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FILTER_MAP = {
  AllTask: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("AllTask");
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
      color={name === filter?'btn btn-primary':"outline-primary"}
    />
  ));

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    if (newName){
    
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
           
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
      
    });
    setTasks(editedTaskList);
  }
  else{
    alert("Please input something");
  }
}

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  function addTask(name) {
    if(name){
      const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
      setTasks([...tasks, newTask]);
    }
    else{
      alert("Please input something");
    }
    
  }

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <Container>
      <Card  className="col-md-5 mx-auto">
        <Card.Body>
          <Card.Title>Cool TODO-List</Card.Title>
          <MyForm addTask={addTask} />
          <div className="filters btn-group stack-exception">{filterList}</div>
          <Card.Title id="list-heading" tabIndex="-1" ref={listHeadingRef}>
            {headingText}
          </Card.Title>
          <ul
            role="list"
            aria-labelledby="list-heading"
          >
            {taskList}
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default App;
