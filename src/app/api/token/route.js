import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const grantType = "client_credentials";

  const url = `https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=${grantType}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ access_token: data.access_token });
    } else {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh access token" }, { status: 500 });
  }
}
