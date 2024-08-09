import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import fs from "fs/promises"; // Use fs/promises for easier async/await

async function extractImageUrls(htmlContent) {
  try {
    const imageUrls = [];
    const regex = /"original_image_url":\s*"([^"]+)"/g; // Corrected regex
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      imageUrls.push(match[1].replace(/\\/g, ""));
    }
    return [...new Set(imageUrls)];
  } catch (error) {
    console.error("Error extracting image URLs:", error);
    return [];
  }
}

async function extractVideoUrls(htmlContent) {
  try {
    const videoUrls = [];
    const regex = /"video_sd_url":\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      videoUrls.push(match[1].replace(/\\/g, ""));
    }
    return [...new Set(videoUrls)];
  } catch (error) {
    console.error("Error extracting video URLs:", error);
    return [];
  }
}

async function extractHtmls(htmlContent) {
  try {
    const videoUrls = [];
    const regex = /"__html":\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      videoUrls.push(match[1].replace(/\\/g, ""));
    }
    return [...new Set(videoUrls)];
  } catch (error) {
    console.error("Error extracting video URLs:", error);
    return [];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const adUrl = searchParams.get("url");

  if (!adUrl) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  const encodedUrl = encodeURIComponent(adUrl);
  const scrapflyApiKey = process.env.SCRAPFLY_API_KEY;
  const scrapflyUrl = `https://api.scrapfly.io/scrape?retry=false&tags=player%2Cproject%3Adefault&timeout=30000&asp=true&key=${scrapflyApiKey}&url=${encodedUrl}`;

  try {
    const response = await fetch(scrapflyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML content from Scrapfly: ${response.statusText}`);
    }

    const data = await response.json();
    const htmlContent = data.result.content;

    const images = await extractImageUrls(htmlContent);
    const videos = await extractVideoUrls(htmlContent);
    const htmls = await extractVideoUrls(htmlContent);

    return NextResponse.json({ images, videos });
  } catch (error) {
    console.error("Error fetching HTML from Scrapfly:", error);
    return NextResponse.json({ error: "Failed to fetch HTML content" }, { status: 500 });
  }
}
