import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaEllipsisV } from "react-icons/fa";
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
  onDecode: (shortCode: string) => void; // Callback for Decode action
  onStats: (shortCode: string) => void; // Callback for Stats action
}

const UrlTable: React.FC<UrlTableProps> = ({ urls, onDecode, onStats }) => {
  const safeUrls = Array.isArray(urls) ? urls : [];
  const API_BASE_URL = "http://localhost:8800/api/url";

  // State to manage dropdown visibility for each row
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to extract short code from full URL
  const getShortCode = (fullUrl: string): string => {
    if (typeof fullUrl !== "string") return "Invalid URL";
    return fullUrl.startsWith(API_BASE_URL)
      ? fullUrl.replace(`${API_BASE_URL}/`, "")
      : fullUrl;
  };

  // Toggle dropdown for a specific row
  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="table-container">
      <table className="url-table">
        <thead>
          <tr className="table-header">
            <th>Long URL</th>
            <th>Short URL</th>
            <th>Created</th>
            <th>Visits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {safeUrls.map((url, index) => {
            // Define shortCode for this row
            const shortCode = getShortCode(url.shortUrl);
            return (
              <motion.tr
                key={url.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="table-row"
              >
                <td>
                  <a
                    href={url.longUrl || "#"}
                    target="_blank"
                    className="link-accent"
                    rel="noopener noreferrer"
                  >
                    {typeof url.longUrl === "string" && url.longUrl.length > 50
                      ? `${url.longUrl.slice(0, 50)}...`
                      : url.longUrl || "Invalid URL"}
                  </a>
                </td>
                <td>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    className="link-secondary"
                    rel="noopener noreferrer"
                  >
                    {shortCode}
                  </a>
                </td>
                <td>
                  {url.createdAt
                    ? new Date(url.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{url.visits ?? 0}</td>
                <td className="actions-cell">
                  <div className="actions-container" ref={dropdownRef}>
                    <button
                      className="actions-toggle"
                      onClick={() => toggleDropdown(url.id)}
                    >
                      <FaEllipsisV />
                    </button>
                    {openDropdownId === url.id && (
                      <motion.div
                        className="actions-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <button
                          className="action-button"
                          onClick={() => {
                            onDecode(shortCode); // Use shortCode from this row
                            setOpenDropdownId(null);
                          }}
                        >
                          Decode
                        </button>
                        <button
                          className="action-button"
                          onClick={() => {
                            onStats(shortCode); // Use shortCode from this row
                            setOpenDropdownId(null);
                          }}
                        >
                          Stats
                        </button>
                      </motion.div>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UrlTable;
