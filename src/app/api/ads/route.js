import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const pageId = searchParams.get("pageId");
  const accessToken = searchParams.get("accessToken");
  const dateFrom = searchParams.get("dateFrom") || "2024-01-01"; // Default start date
  const dateTo = searchParams.get("dateTo");

  const baseUrl = "https://graph.facebook.com/v17.0/ads_archive";
  const params = new URLSearchParams({
    access_token: accessToken,
    ad_reached_countries: "IT",
    languages: "it",
    ad_active_status: "ACTIVE",
    ad_type: "ALL",
    ad_delivery_date_min: dateFrom,
    fields: "ad_creative_bodies,ad_creative_link_captions,ad_creative_link_titles,ad_creative_link_descriptions,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,page_id,page_name,bylines,impressions,spend,ad_creative_link_media,currency,delivery_by_region,demographic_distribution,estimated_audience_size,eu_total_reach,publisher_platforms,target_ages,target_gender,target_locations",
  });

  // Add dateTo if provided
  if (dateTo) {
    params.set("ad_delivery_date_max", dateTo);
  }

  // Conditionally add search_terms or search_page_ids
  if (pageId) {
    params.set("search_page_ids", pageId);
  } else {
    params.set("search_terms", keyword);
  }

  try {
    const response = await fetch(`${baseUrl}?${params}`);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data.data || []);
    } else {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ads" }, { status: 500 });
  }
}
