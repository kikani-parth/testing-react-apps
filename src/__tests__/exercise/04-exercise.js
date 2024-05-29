// form testing
// http://localhost:3000/login

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../components/login";

test("submitting the form calls onSubmit with username and password", async () => {
  let submittedData;

  function handleSubmit(data) {
    submittedData = data;
  }
  // const handleSubmit = data => (submittedData = data)
  render(<Login onSubmit={handleSubmit} />);

  const username = "paps1234";
  const password = "react1234";

  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const button = screen.getByRole("button", { name: /submit/i });

  await userEvent.type(usernameInput, username);
  await userEvent.type(passwordInput, password);

  await userEvent.click(button);

  // assert that submittedData is correct
  expect(submittedData).toEqual({ username, password });
});

/*
eslint
  no-unused-vars: "off",
*/
