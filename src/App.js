import './App.css';
import Todo from "./components/Todo";
import React, { useState, useRef, useEffect } from "react";
import MyForm from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";
import { Container, Row, Col, Image, Alert } from "react-bootstrap";
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
  const [tasks, setTasks] = useState(props.tasks);    // Add,Edit,Delete tasks
  const [filter, setFilter] = useState("AllTask");    // Filter button
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
      color={name === filter ? 'btn btn-primary btn-lg' : "btn btn-secondary btn-lg"}    //Change the color of filter button when choosed
    />
  ));

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {                                 // if this task has the same ID as the edited task
        return { ...task, completed: !task.completed };     // use object spread to make a new object whose `completed` prop has been inverted
      }
      return task;
    });
    setTasks(updatedTasks);
  }


  function allStorage() {
    let values = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;


    while ( i-- ) {
        if (!keys[i].includes("todo")) return;
        console.log('run')
        values.push({ id:keys[i], name: localStorage.getItem(keys[i]).name,completed: localStorage.getItem(keys[i]).completed });
    }
    return values;
  }

  useEffect(() => {
    setTasks(allStorage())
  }, []);


  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    localStorage.removeItem(id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    if (newName) {

      const editedTaskList = tasks.map((task) => {
        if (id === task.id) {                             // if this task has the same ID as the edited task
          return { ...task, name: newName };
        }
        return task;
      });
      localStorage.setItem(id, newName)
      setTasks(editedTaskList);
    }
    else {
      alert("Please input something");                    // Alert when no data has been entered
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
    if (name) {
      const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
      localStorage.setItem(newTask.id, {name:name,completed:false})
      setTasks([...tasks, newTask]);
    }
    else {
      alert("Please input something");              // Alert when no data has been entered
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
    <div class="p-3 mb-2 bg-dark text-white">
      <Container >
        <Row>
          <Col>
            <blockquote class="blockquote text-center">
              <h1>
                Cool To-Do List
              </h1>
              <h3><strong><small class="text-muted">Help you to record the future events</small></strong></h3>
            </blockquote>
          </Col>
          <br>
          </br>
        </Row>

        <Row>
            <MyForm addTask={addTask} />
        </Row>

        <Row>
          <Col className="filters btn-group stack-exception">{filterList}</Col>
        </Row>
        <br>
        </br>
        <Row id="list-heading" tabIndex="-1" ref={listHeadingRef}>
          {headingText}
        </Row>

        <Row>
          <Col>
            {taskList}
          </Col>
        </Row>
      </Container >
    </div>
  );
}
export default App;
