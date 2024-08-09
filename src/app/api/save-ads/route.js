import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const extractFilenameFromUrl = (url) => {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  } catch (error) {
    console.warn("Invalid URL:", url);
    return "unknown-file";
  }
};

export async function POST(request) {
  try {
    const ad = await request.json();

    const advertiserDir = path.join(process.cwd(), "public", "ads", ad.page_id);
    const imagesDir = path.join(advertiserDir, "images");
    const videosDir = path.join(advertiserDir, "videos");

    if (!fs.existsSync(advertiserDir)) {
      fs.mkdirSync(advertiserDir, { recursive: true });
    }

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    // 2. Download and Save Images
    if (ad.images && ad.images.length > 0) {
      for (let i = 0; i < ad.images.length; i++) {
        const imageFilename = extractFilenameFromUrl(ad.images[i]);
        const imagePath = path.join(imagesDir, imageFilename);

        const imageResponse = await fetch(ad.images[i]);
        const imageBuffer = await imageResponse.arrayBuffer();
        fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
      }
    }

    // 3. Download and Save Videos
    if (ad.videos && ad.videos.length > 0) {
      for (let i = 0; i < ad.videos.length; i++) {
        const videoFilename = extractFilenameFromUrl(ad.videos[i]);
        const videoPath = path.join(videosDir, videoFilename);

        const videoResponse = await fetch(ad.videos[i]);

        if (!videoResponse.ok) {
          console.error(`Error downloading video ${videoFilename}: ${videoResponse.statusText}`);
          continue;
        }

        const videoBuffer = await videoResponse.arrayBuffer();
        fs.writeFileSync(videoPath, Buffer.from(videoBuffer));
      }
    }

    // 4. Save JSON
    const adJsonPath = path.join(advertiserDir, `${ad.id}.json`);
    fs.writeFileSync(adJsonPath, JSON.stringify(ad, null, 2));

    return NextResponse.json({ message: "Ad saved successfully!" });
  } catch (error) {
    console.error("Error saving ad:", error);
    return NextResponse.json({ error: "Failed to save ad" }, { status: 500 });
  }
}
