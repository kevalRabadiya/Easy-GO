async function sendRequestToDriver(
  drivername: object,
  userLocation: object
): Promise<{ drivername: object; userLocation: object }> {
  //logic to send request
  return { drivername, userLocation };
}

export { sendRequestToDriver };
