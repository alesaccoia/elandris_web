import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;
  const state = "someRandomString"; // You should replace it with a proper state mechanism for security

  const url = new URL("https://www.facebook.com/v11.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "ads_read"); // Add any other scopes you need
  url.searchParams.set("response_type", "code");

  return NextResponse.redirect(url.toString());
}
