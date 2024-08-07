import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
    }

    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

    const tokenUrl = `https://graph.facebook.com/v11.0/oauth/access_token?client_id=${appId}&redirect_uri=${redirectUri}&client_secret=${appSecret}&code=${code}`;

    const tokenResponse = await fetch(tokenUrl);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      const errorJson = JSON.parse(errorText);
      return NextResponse.json({ error: errorJson }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("access_token", accessToken);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Error fetching the access token:", error);
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 });
  }
}
