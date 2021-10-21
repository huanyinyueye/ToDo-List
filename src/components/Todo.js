import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, ToggleButton } from "react-bootstrap";
import { BsFillTrashFill,BsFillPencilFill,BsCheckLg,BsSave2Fill,BsFillSlashCircleFill, BsSlashCircleFill } from "react-icons/bs";

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

  //const sortedvalues = values.sort(function(a,b){ return b.id-a.id});
  console.log("main render");
  //const [checked, setChecked] = useState(false);
  const editingTemplate = (
    <Container>  
      <Form className="stack-small" onSubmit={handleSubmit}>
        <Form.Group className="mb-3">   
          <Form.Label htmlFor={props.id}>
            <h4>Edit name of "<strong>{props.name}</strong>"</h4>
          </Form.Label>
          <Form.Control
            id={props.id}
            className="todo-text"
            type="text"
            value={newName}
            onChange={handleChange}
            ref={editFieldRef}
            placeholder="Enter new name of this task"
          />
        </Form.Group>
        <Button variant="btn btn-outline-info" size="md" type="submit">
          <BsSave2Fill></BsSave2Fill>
          <span className="visually-hidden"> new name for {props.name}</span>
        </Button>{' '}
        <Button variant="outline-danger" size="md" type="button" onClick={() => setEditing(false)}>
          <BsSlashCircleFill></BsSlashCircleFill>
          <span className="visually-hidden"> renaming {props.name}</span>
        </Button>{' '}
      </Form>
    </Container>
  );
  
  const viewTemplate = (
    <Container>
      <Row className="stack-small">
        <Col xs={2} md="auto" >
          <ToggleButton
            className="mb-2"
            id={props.id}
            var ls = {localStorage.getItem(props.id)}
            type="checkbox"
            variant="outline-light"
            checked={props.completed}
            size="md"
            value="1"
            onChange={() => {props.toggleTaskCompleted(props.id)}}
          >
            <BsCheckLg></BsCheckLg>
          </ToggleButton>
        </Col>
        <Col xs={6} md={10} className="todo-label" htmlFor={props.id}>
          <h3><strong>{props.name}</strong></h3>
        </Col>
        <Col xs="auto" md="auto" class="d-flex flex-column-reverse">
          <Button variant="outline-info" size="md" type="button" onClick={() => setEditing(true)} ref={editButtonRef}>
            <BsFillPencilFill></BsFillPencilFill><span className="visually-hidden">{props.name}</span>
          </Button>{' '}

          <Button variant="outline-danger" size="md" type="button" onClick={() => props.deleteTask(props.id)}>
             <BsFillTrashFill></BsFillTrashFill><span className="visually-hidden">{props.name}</span>
          </Button>{' '}
        </Col>
      </Row>
    </Container>
  );

  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}