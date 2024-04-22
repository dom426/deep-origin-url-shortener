export async function POST(req: Request) {
  const request = await req.json();
  const response = await fetch(
    'http://localhost:3000/api/getShortenedUrlsByAccount',
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
