export async function POST(req: Request) {
  const request = await req.json();
  const response = await fetch(
    process.env.URL_SHORTENER_SERVER_HOST
      ? process.env.URL_SHORTENER_SERVER_HOST
      : 'http://localhost:3000' + '/api/createAccount',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );
  const data = await response.json();
  return Response.json(data);
}
