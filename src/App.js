import './App.css';
import Todo from "./components/Todo";
import React, { useState, useRef, useEffect } from "react";
import MyForm from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";
import { Container, Row, Col } from "react-bootstrap";
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
    var ls = localStorage.getItem(id);

    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {          // if this task has the same ID as the edited task
        localStorage.setItem(id, JSON.stringify({
          name: JSON.parse(ls).name, completed: !task.completed,
          year: JSON.parse(ls).year, month: JSON.parse(ls).month, date: JSON.parse(ls).date,
          hour: JSON.parse(ls).hour, minute: JSON.parse(ls).minute, second: JSON.parse(ls).second
        }));        //Edit item in localstorage       
        return { ...task, completed: !task.completed };         // use object spread to make a new object whose `completed` prop has been inverted
      }
      return task;
    });

    setTasks(updatedTasks);
  }


  function allStorage() {     //get previous item in localstorage
    let values = [];
    const keys = Object.keys(localStorage);
    let i = keys.length;
    var j = 0;


    while (j < i) {
      var ls = localStorage.getItem(keys[j]);
      if (!keys[j].includes("todo")) return;

      values.push({
        id: keys[j], name: JSON.parse(ls).name, completed: JSON.parse(ls).completed,
        year: JSON.parse(ls).year, month: JSON.parse(ls).month, date: JSON.parse(ls).date,
        hour: JSON.parse(ls).hour, minute: JSON.parse(ls).minute, second: JSON.parse(ls).second
      });
      j++;
    }


    return (values);
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
        if (id === task.id) {         // if this task has the same ID as the edited task
          return { ...task, name: newName };
        }
        return task;
      });
      var ls = localStorage.getItem(id);
      localStorage.setItem(id, JSON.stringify({
        name: newName, completed: JSON.parse(ls).completed,
        year: JSON.parse(ls).year, month: JSON.parse(ls).month, date: JSON.parse(ls).date,
        hour: JSON.parse(ls).hour, minute: JSON.parse(ls).minute, second: JSON.parse(ls).second
      }));
      setTasks(editedTaskList);
    }
    else {
      alert("Please input something");                    // Alert when no data has been entered
    }
  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .sort((a, b) => { return a.year < b.year ? 1 : -1 })
    .sort((a, b) => { return a.month < b.month ? 1 : -1 })
    .sort((a, b) => { return a.date < b.date ? 1 : -1 })
    .sort((a, b) => { return a.hour < b.hour ? 1 : -1 })
    .sort((a, b) => { return a.minute < b.minute ? 1 : -1 })
    .sort((a, b) => { return a.second < b.second ? 1 : -1 })
    .sort((a, b) => { return a.completed > b.completed ? 1 : -1 })
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


  const [count, setCount] = useState(0);
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  function addTask(name) {
    var today = new Date(),
      time = today.getFullYear() + ':' + today.getMonth() + ':' + today.getDate() + ':' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    if (name) {
      const newTask = {
        id: "todo-" + nanoid(), name: name, completed: false,
        year: today.getFullYear(), month: today.getUTCMonth(), date: today.getDate(),
        hour: today.getHours(), minute: today.getMinutes(), second: today.getSeconds()
      };
      localStorage.setItem(newTask.id, JSON.stringify({
        name: name, completed: false,
        year: today.getFullYear(), month: today.getUTCMonth(), date: today.getDate(),
        hour: today.getHours(), minute: today.getMinutes(), second: today.getSeconds()
      }))
      setTasks([...tasks, newTask]);
      handleIncrement();
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
      <Container>
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