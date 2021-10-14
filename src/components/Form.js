import React, { useState } from "react";
import { Container, Form, Button, Stack, Row, Col } from "react-bootstrap";

function MyForm(props) {
  const [name, setName] = useState("");

  function handleChange(e) {
    setName(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    props.addTask(name);
    setName("");
  }
  return (
    <Container>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              id="new-todo-input"
              className="input input__lg"
              name="text"
              autoComplete="off"
              value={name}
              placeholder=" What needs to be done?"
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Button type="submit" variant="outline-success" size="sm">
              Add
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <br>
            </br>
          </Col>
        </Row>


      </Form>
    </Container >

  );
}

export default MyForm;
