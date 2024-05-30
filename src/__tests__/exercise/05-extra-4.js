// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { build, fake } from "@jackfranklin/test-data-bot";
import { setupServer } from "msw/node";
import Login from "../../components/login-submission";
import { handlers } from "test/server-handlers.js";
import { rest } from "msw";

const buildLoginForm = build({
  fields: {
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

const server = setupServer(...handlers);

// before all the tests, start the server with `server.listen()`
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

// after all the tests, stop the server with `server.close()`
afterAll(() => server.close());

test(`logging in displays the user's username`, async () => {
  render(<Login />);
  const { username, password } = buildLoginForm();

  await userEvent.type(screen.getByLabelText(/username/i), username);
  await userEvent.type(screen.getByLabelText(/password/i), password);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByText(username)).toBeInTheDocument();
});

test(`omitting the password results in an error`, async () => {
  render(<Login />);

  // Not going to fill in the password
  const { username } = buildLoginForm();

  await userEvent.type(screen.getByLabelText(/username/i), username);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
    `"password required"`
  );
});

test(`unkown server error displays the error message`, async () => {
  const testErrorMessage = "Something went wrong";

  server.use(
    rest.post(
      "https://auth-provider.example.com/api/login",
      async (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: testErrorMessage }));
      }
    )
  );

  render(<Login />);

  await userEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));

  expect(screen.getByRole("alert")).toHaveTextContent(testErrorMessage);
});
