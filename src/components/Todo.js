import React, { useEffect, useRef, useState } from "react";

import { Form, Button} from "react-bootstrap";


function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);
  function handleChange(e) {
    setNewName(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }

  useEffect(() => {
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    }
    if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
  }, [wasEditing, isEditing]);
  
  console.log("main render");

  const editingTemplate = (
    <Form className="stack-small" onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor={props.id}>
          New name for {props.name}
        </Form.Label>
        <Form.Control
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
          placeholder="Enter the task you want to modify"
        />
      </Form.Group>
        <Button
          variant="danger"
          size="sm"
          type="button"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </Button>{' '}
        <Button 
          variant="primary" 
          size="sm"
          type="submit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </Button>{' '}
    </Form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
        <Button
          variant="outline-primary"
          size="sm"
          type="button"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </Button>{" "}
        <Button
          variant="outline-danger"
          size="sm"
          type="button"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </Button>
    </div>
  );


  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}