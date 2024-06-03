// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import { useCurrentPosition } from "react-use-geolocation";
import Location from "../../examples/location";

jest.mock("react-use-geolocation");

test("displays the users current location", async () => {
  const fakePosition = { coords: { latitude: 25, longitude: 30 } };

  let setReturnValue;
  function useMockCurrentPosition() {
    const state = React.useState([]);
    setReturnValue = state[1];
    return state[0];
  }

  useCurrentPosition.mockImplementation(useMockCurrentPosition);

  render(<Location />);

  // verify the loading spinner is showing up
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

  act(() => {
    setReturnValue([fakePosition]);
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
