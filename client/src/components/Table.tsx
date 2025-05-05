import React from "react";
import { motion } from "framer-motion";
import "./styles/table.css";

interface Url {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt: string;
  visits: number;
}

interface UrlTableProps {
  urls: Url[];
}

const UrlTable: React.FC<UrlTableProps> = ({ urls }) => {
  const safeUrls = Array.isArray(urls) ? urls : [];
  const API_BASE_URL = "http://localhost:8800/api/url"; // Define base URL for extracting short code

  // Function to extract short code from full URL
  const getShortCode = (fullUrl: string): string => {
    if (typeof fullUrl !== "string") return "Invalid URL";
    return fullUrl.startsWith(API_BASE_URL)
      ? fullUrl.replace(`${API_BASE_URL}/`, "")
      : fullUrl;
  };

  return (
    <div className="table-container">
      <table className="url-table">
        <thead>
          <tr className="table-header">
            <th>Long URL</th>
            <th>Short URL</th>
            <th>Created</th>
            <th>Visits</th>
          </tr>
        </thead>
        <tbody>
          {safeUrls.map((url, index) => (
            <motion.tr
              key={url.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="table-row"
            >
              <td>
                <a href={url.longUrl} target="_blank" className="link-accent">
                  {/* {url.longUrl.length > 50 ? `${url.longUrl.slice(0, 50)}...` : url.longUrl} */}
                  {url.longUrl}
                </a>
              </td>
              <td>
                {/* <a href={url.shortUrl} target="_blank" className="link-secondary">
                  {url.shortUrl}
                </a> */}
                <a
                  href={url.shortUrl}
                  target="_blank"
                  className="link-secondary"
                  rel="noopener noreferrer"
                >
                  {getShortCode(url.shortUrl)}
                </a>
              </td>
              <td>{new Date(url.createdAt).toLocaleDateString()}</td>
              <td>{url.visits}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlTable;