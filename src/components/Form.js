import React, { useState } from "react";
import { Form, Button, Stack } from "react-bootstrap";

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
    <Form onSubmit={handleSubmit}>
      <Stack direction="horizontal" gap={3}>
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
        </Stack>
        <div className="d-grid gap-2">
          <Button type="submit" variant="outline-success" size="sm">
            Add   
          </Button>
        </div>
      
    </Form>

  );
}

export default MyForm;
