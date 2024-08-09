"use client";

import { useState, useEffect } from "react";
import AdComponent from "./AdComponent";

const AdsFetcher = () => {
  const [accessToken, setAccessToken] = useState("");
  const [keyword, setKeyword] = useState("");
  const [pageId, setPageId] = useState("");
  const [dateFrom, setDateFrom] = useState(getDefaultDateFrom());
  const [dateTo, setDateTo] = useState(getDefaultDateTo());
  const [ads, setAds] = useState([]);
  const [readyAdsCount, setReadyAdsCount] = useState(0);
  const [retrievedAdsCount, setRetrievedAdsCount] = useState(0);

  function getDefaultDateFrom() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().slice(0, 10);
  }

  function getDefaultDateTo() {
    return new Date().toISOString().slice(0, 10);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("access_token");
    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
    }
  }, []);

  const handleAdReady = () => {
    setReadyAdsCount((prevCount) => prevCount + 1);
  };

  const fetchAdsFromApi = async (searchParams = "") => {
    setAds([]);
    setReadyAdsCount(0); // Reset the counter when fetching new ads
    setRetrievedAdsCount(0); // Reset the counter when fetching new ads
    const url = `/api/ads?accessToken=${accessToken}${searchParams}`;
    const response = await fetch(url);

    if (response.ok) {
      const adsData = await response.json();
      setRetrievedAdsCount(adsData.length); // Reset the counter when fetching new ads

      const updatedAds = await Promise.all(
        adsData.map(async (ad) => {
          if (!ad.ad_snapshot_url) return;

          const mediaResponse = await fetch(`/api/fetch-images?url=${encodeURIComponent(ad.ad_snapshot_url)}`);
          const mediaData = await mediaResponse.json();

          const updatedAd = { ...ad, images: mediaData.images, videos: mediaData.videos };

          // Save the ad
          const saveAdResponse = await fetch("/api/save-ads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAd),
          });

          if (saveAdResponse.ok) {
            setReadyAdsCount((prevCount) => prevCount + 1);
          } else {
            console.error("Failed to save ad:", updatedAd.id);
          }

          return updatedAd;
        })
      );

      setAds(updatedAds); // Still limiting to 1 for now
    } else {
      console.error("Failed to fetch ads");
    }
  };

  const fetchByKeyword = async () => {
    const params = new URLSearchParams({
      keyword: keyword,
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
    fetchAdsFromApi(`&${params.toString()}`);
  };

  const startOAuth = () => {
    window.location.href = "/api/facebook/auth";
  };

  const fetchByPageId = async (pageId) => {
    const params = new URLSearchParams({
      pageId: pageId,
      dateFrom: dateFrom,
      dateTo: dateTo,
    });
    fetchAdsFromApi(`&${params.toString()}`);
  };

  // Placeholder bank data - replace with real names and IDs
  const banks = [
    { name: "BPER Banca", id: "1657214567845698" },
    { name: "Credem Banca", id: "103968169809912" },
    { name: "Intesa Sanpaolo", id: "209014105776443" },
    { name: "BCC Credito Cooperativo", id: "1389519327952496" },
    { name: "Findomestic", id: "104257068550" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5">
      <h1 className="text-2xl font-light mb-4">Cerbero's Social Tool 👹</h1>

      <div className="mb-4 flex items-center">
        <input type="text" className="w-full flex-grow p-2 border border-gray-300 rounded mr-2" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
        <button className="bg-blue-500 text-white p-2 rounded px-4 w-64" onClick={startOAuth}>
          Refresh Token
        </button>
      </div>

      <div className="mb-4 flex items-center">
        <input type="text" className="w-full flex-grow p-2 border border-gray-300 rounded mr-2" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button className="bg-blue-500 text-white p-2 rounded px-4 w-64" onClick={fetchByKeyword}>
          Keyword Search
        </button>
      </div>

      <div className="mb-4 flex flex-row">
        <div className="w-1/2">
          <label htmlFor="dateFrom">Date From:</label>
          <input type="date" id="dateFrom" className="ml-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="w-1/2">
          <label htmlFor="dateTo">Date To:</label>
          <input type="date" id="dateTo" className="ml-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <div className="mb-4">
        {banks.map((bank) => (
          <button key={bank.id} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => fetchByPageId(bank.id)}>
            {bank.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {readyAdsCount < retrievedAdsCount && (
          <div className="mb-4">
            <progress className="w-full" max={retrievedAdsCount} value={readyAdsCount}></progress>
            <p className="text-center">
              {readyAdsCount} / {retrievedAdsCount} Ads Downloaded
            </p>
          </div>
        )}

        {ads.map((ad, index) => (
          <AdComponent key={index} ad={ad} />
        ))}
      </div>
    </div>
  );
};

export default AdsFetcher;
