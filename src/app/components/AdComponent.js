import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";

const renderUniqueItems = (items) => {
  const uniqueItems = [...new Set(items)];
  return uniqueItems.map((item, index) => <div key={index}>{item}</div>);
};

const AdComponent = ({ ad, onReady }) => {
  return (
    <div className="border p-6 rounded-lg shadow mb-6 bg-white">
      <div className="flex flex-wrap mb-4">
        <div className="w-full mb-4 sm:mb-0 flex flex-row">
          <div className="font-light text-black w-1/2">
            <strong>{ad.page_name}</strong> ({ad.page_id})
          </div>
          <div className="font-light text-black w-1/2 text-right">
            <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer" className="text-black-500 underline">
              View Snapshot ({ad.id})
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap mb-4">
        <div className="w-full mb-4 sm:mb-0 flex flex-row">
          <div className="text-sm font-light text-gray-800 w-20">Start Date</div>
          <div className="text-sm mx-4 flex flex-col">{ad.ad_delivery_start_time}</div>
        </div>
        <div className="w-full mb-4 sm:mb-0 flex flex-row">
          <div className="text-sm font-light text-gray-800 w-20">Total Reach</div>
          <div className="text-sm mx-4 flex flex-col">{ad.eu_total_reach}</div>
        </div>
        {ad.publisher_platforms && (
          <div className="w-full mb-4 sm:mb-0 flex flex-row">
            <div className="text-sm font-light text-gray-800 w-20">Platforms</div>
            <div className="text-sm mx-4 flex flex-col">{ad.publisher_platforms.join(", ")}</div>
          </div>
        )}
        {ad.target_ages && (
          <div className=" flex flex-row align-center items-center w-full">
            <div className="text-sm font-light text-gray-800 w-20">Demography</div>
            <div className="text-sm mx-4 flex flex-col">
              {ad.target_ages.join(", ")} ({ad.target_gender})
            </div>
          </div>
        )}
        {ad.target_locations && (
          <div className="w-full mb-4 sm:mb-0 flex flex-row">
            <div className="text-sm font-light text-gray-800 w-20 flex-shrink-0">Locations</div>
            <div className="text-sm mx-4 flex flex-wrap">
              {ad.target_locations.map((location, index) => (
                <span key={index}>
                  {location.name}
                  {location.excluded && <span className="text-red-500"> (Excluded)</span>}
                  {" // "}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mb-4">
        {ad.ad_creative_bodies && (
          <div className=" flex flex-row align-center items-center w-full">
            <div className="text-sm font-light text-gray-800 w-20 flex-shrink-0">Bodies</div>
            <div className="text-sm mx-4 flex flex-col">{renderUniqueItems(ad.ad_creative_bodies)}</div>
          </div>
        )}
        {ad.ad_creative_link_titles && (
          <div className=" flex flex-row align-center items-center w-full">
            <div className="text-sm font-light text-gray-800 w-20">Titles</div>
            <div className="text-sm mx-4 flex flex-col">{renderUniqueItems(ad.ad_creative_link_titles)}</div>
          </div>
        )}
        {ad.ad_creative_link_descriptions && (
          <div className=" flex flex-row align-center items-center w-full">
            <div className="text-sm font-light text-gray-800 w-20">Descriptions</div>
            <div className="text-sm mx-4 flex flex-col">{renderUniqueItems(ad.ad_creative_link_descriptions)}</div>
          </div>
        )}
        {ad.ad_creative_link_captions && (
          <div className=" flex flex-row align-center items-center w-full">
            <div className="text-sm font-light text-gray-800 w-20">Captions</div>
            <div className="text-sm mx-4 flex flex-col">{renderUniqueItems(ad.ad_creative_link_captions)}</div>
          </div>
        )}
      </div>

      {ad.images.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-light text-gray-800 w-20">Images</div>
          <div className="flex flex-wrap">
            {ad.images.map((src, index) => (
              <a
                key={index}
                href={src} // Link directly to the image source
                target="_blank" // Open in a new tab
                rel="noopener noreferrer" // Good practice for security
                className="w-1/3 p-2" // 1/3 width, padding for spacing
              >
                <div className="relative pb-full">
                  <img src={src} alt={`Ad image ${index + 1}`} className="rounded" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      {ad.videos.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-light text-gray-800 w-20">Videos</div>
          <div className="flex flex-wrap">
            {ad.videos.map((src, index) => (
              <video key={index} src={src} controls className="rounded border p-2 m-1" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdComponent;
