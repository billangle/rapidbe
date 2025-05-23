const httpResponse = (
    statusCode,
    body,
  ) => ({
    body,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
    },
    statusCode,
  });

  exports.handler = async (event, context, call)  => {
  try {
    return httpResponse(200, JSON.stringify('OK'));
  } catch (error) {
    console.error(error);

    return httpResponse(400, JSON.stringify({ message: error.message }));
  }
};