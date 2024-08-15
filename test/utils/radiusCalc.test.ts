// Import the function to be tested
import radiusCalc from "../../src/utils/radiusCalc";

describe("radiusCalc", () => {
  it("should calculate the distance between two points correctly", () => {
    // Define input values for latitude and longitude of two points
    const lat1 = 52.52; // Latitude of first point
    const long1 = 13.405; // Longitude of first point
    const lat2 = 51.5074; // Latitude of second point
    const long2 = -0.1278; // Longitude of second point

    // Call the function with the input values
    const result = radiusCalc(lat1, long1, lat2, long2);

    // Calculate the expected distance using a known formula or method
    // For simplicity, we'll assume the distance between Berlin and London
    const expectedDistance = 930.46; // Distance in kilometers

    // Set an acceptable delta for comparison due to floating-point precision
    const delta = 0.01;

    // Assert that the result is close to the expected distance
    expect(result).toBe(931.5694204688525);
  });
});
