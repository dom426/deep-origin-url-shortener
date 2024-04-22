export async function POST(req: Request) {
  const request = await req.json();
  const response = await fetch(
    process.env.API_HOST ?? 'http://localhost:3000' + '/api/login',
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
