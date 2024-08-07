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

  // Function to get date one week ago
  function getDefaultDateFrom() {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().slice(0, 10);
  }

  // Function to get today's date
  function getDefaultDateTo() {
    return new Date().toISOString().slice(0, 10);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("access_token");
    if (tokenFromUrl) {
      setAccessToken(tokenFromUrl);
      urlParams.delete("access_token");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchAds = async () => {
    const response = await fetch(`/api/ads?accessToken=${accessToken}&keyword=${keyword}&pageId=${pageId}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    if (response.ok) {
      const data = await response.json();
      //setAds(data.slice(0, 2)); // Or setAds(data); to display all
      setAds(data);
    } else {
      console.error("Failed to fetch ads");
    }
  };

  const startOAuth = () => {
    window.location.href = "/api/facebook/auth";
  };

  // Placeholder bank data - replace with real names and IDs
  const banks = [
    { name: "BPER Banca", id: "1657214567845698" },
    { name: "Credem Banca", id: "103968169809912" },
    { name: "Intesa Sanpaolo", id: "209014105776443" },
    { name: "BCC Credito Cooperativo", id: "1389519327952496" },
    { name: "Findomestic", id: "104257068550" },
  ];

  const handleBankClick = async (pageId) => {
    const response = await fetch(`/api/ads?accessToken=${accessToken}&pageId=${pageId}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
    if (response.ok) {
      const data = await response.json();
      //setAds(data.slice(0, 2)); // Or setAds(data); to display all
      setAds(data);
    } else {
      console.error("Failed to fetch ads");
    }
  };

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
        <button className="bg-blue-500 text-white p-2 rounded px-4 w-64" onClick={fetchAds}>
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
          <button key={bank.id} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => handleBankClick(bank.id)}>
            {bank.name}
          </button>
        ))}
      </div>

      <div className="mt-6">{ads.length ? ads.map((ad, index) => <AdComponent key={index} ad={ad} />) : <p>No ads found.</p>}</div>
    </div>
  );
};

export default AdsFetcher;
