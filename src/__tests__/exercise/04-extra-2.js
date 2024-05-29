// form testing
// http://localhost:3000/login

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../components/login";
import faker from "faker";

function buildLoginForm() {
  const username = faker.internet.userName();
  const password = faker.internet.password();

  return { username, password };
}

test("submitting the form calls onSubmit with username and password", async () => {
  const handleSubmit = jest.fn();

  render(<Login onSubmit={handleSubmit} />);

  const { username, password } = buildLoginForm();

  const usernameInput = screen.getByLabelText(/username/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const button = screen.getByRole("button", { name: /submit/i });

  await userEvent.type(usernameInput, username);
  await userEvent.type(passwordInput, password);

  await userEvent.click(button);

  expect(handleSubmit).toHaveBeenCalledWith({ username, password });
});

/*
eslint
  no-unused-vars: "off",
*/
