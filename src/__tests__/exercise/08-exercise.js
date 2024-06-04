// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useCounter from "../../components/use-counter";

function Counter() {
  const { count, increment, decrement } = useCounter();
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

test("exposes the count and increment/decrement functions", async () => {
  // render the component
  render(<Counter />);

  // get the elements using screen
  const message = screen.getByText(/current count: 0/i);
  const incrementBtn = screen.getByRole("button", { name: /increment/i });
  const decrementBtn = screen.getByRole("button", { name: /decrement/i });

  // assert on the initial state of the hook
  expect(message).toHaveTextContent("Current count: 0");

  // interact with the UI using userEvent and assert on the changes in the UI
  await userEvent.click(incrementBtn);
  expect(message).toHaveTextContent("Current count: 1");

  await userEvent.click(decrementBtn);
  expect(message).toHaveTextContent("Current count: 0");
});

/* eslint no-unused-vars:0 */
