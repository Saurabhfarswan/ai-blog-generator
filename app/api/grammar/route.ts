import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const res = await fetch('https://api.languagetoolplus.com/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        language: 'en-US',
      }),
    });

    // Check if the response is ok (status code 2xx)
    if (!res.ok) {
      const errorText = await res.text(); // Read raw error response
      console.error('Grammar Check API Error Response:', errorText);

      // Handle rate limit or other known issues
      if (res.status === 429) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }

      return NextResponse.json({ error: 'Failed to fetch grammar check results.' }, { status: res.status });
    }

    // Try parsing the JSON response
    try {
      const data = await res.json();
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error('Error parsing response as JSON:', jsonError);
      const errorText = await res.text(); // Get the error text in case it's not valid JSON
      return NextResponse.json({ error: `Unexpected response: ${errorText}` }, { status: 500 });
    }

  } catch (error) {
    console.error('Grammar Check API Error:', error);
    return NextResponse.json({ error: 'Failed to check grammar.' }, { status: 500 });
  }
}
