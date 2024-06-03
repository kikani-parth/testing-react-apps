// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import Location from "../../examples/location";

beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  };
});

// allows you to create a promise that you can resolve/reject on demand.
function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test("displays the users current location", async () => {
  const fakePosition = { coords: { latitude: 25, longitude: 30 } };

  // create a deferred promise
  const { promise, resolve, reject } = deferred();

  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    (callback) => {
      promise.then(() => callback(fakePosition));
    }
  );

  render(<Location />);

  // verify the loading spinner is showing up
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

  await act(async () => {
    // resolve the deferred promise
    resolve();

    // wait for the promise to resolve
    await promise;
  });

  // verify the loading spinner is no longer in the document
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument();

  // verify the latitude and longitude appear correctly
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`
  );
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.longitude}`
  );
});

/*
eslint
  no-unused-vars: "off",
*/
