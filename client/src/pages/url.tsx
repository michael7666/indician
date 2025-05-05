import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import UrlTable from "../components/Table";
import Pagination from "../components/Pagination";
import "./url.css";
import { div } from "framer-motion/client";
import {
  shortenUrl,
  getAllUrls,
  decodeUrl,
  getUrlStats,
  API_BASE_URL,
} from "../services/api";
import { Url, UrlStats, DecodeUrlResponse } from "../types/url";

const UrlPage: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [filteredUrls, setFilteredUrls] = useState<Url[]>([]);
  const [search, setSearch] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const urlsPerPage = 5;
  const [decodeInput, setDecodeInput] = useState("");
  const [statsInput, setStatsInput] = useState("");
  const [decodedUrl, setDecodedUrl] = useState<DecodeUrlResponse | null>(null);
  const [stats, setStats] = useState<UrlStats | null>(null);

  const handleSearch = (value: string) => {
    console.log("Search input:", value);
    setSearch(value);
    if (value.length >= 3) {
      const filtered = urls.filter((url) => {
        const matches = url.longUrl.toLowerCase().includes(value.toLowerCase());
        console.log(`URL: ${url.longUrl}, Matches: ${matches}`);
        return matches;
      });
      console.log("Filtered URLs:", filtered);
      setFilteredUrls(filtered);
    } else {
      console.log("Resetting to all URLs:", urls);
      setFilteredUrls(urls);
    }
    setCurrentPage(1);
  };

  // Fetch all URLs on mount
  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);
      try {
        const fetchedUrls = await getAllUrls();
        setUrls(fetchedUrls);
        setFilteredUrls(fetchedUrls);
      } catch (err) {
        setError("Failed to fetch URLs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUrls();
  }, []);

  // Create URL functionality
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      setError("Please enter a valid URL");
      return;
    }
    setIsLoading(true);
    try {
      const response = await shortenUrl({ longUrl });
      const newUrl: Url = {
        id: response.shortUrl, // Use shortUrl as ID (or fetch new URL data)
        longUrl,
        shortUrl: `${API_BASE_URL}/${response.shortUrl}`,
        createdAt: new Date().toISOString(),
        visits: 0,
      };
      const updatedUrls = [newUrl, ...urls];
      setUrls(updatedUrls);
      setFilteredUrls(updatedUrls);
      setLongUrl("");
      setShowForm(false);
      setError("");
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "Failed to create URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Decode URL
  const handleDecode = async () => {
    if (!decodeInput) {
      setError("Please enter a short URL code");
      return;
    }
    setIsLoading(true);
    try {
      const response = await decodeUrl(decodeInput);
      setDecodedUrl(response);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to decode URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Get Stats
  const handleStats = async () => {
    if (!statsInput) {
      setError("Please enter a short URL code");
      return;
    }
    setIsLoading(true);
    try {
      const response = await getUrlStats(statsInput);
      setStats(response);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUrls.length / urlsPerPage);
  const paginatedUrls = filteredUrls?.slice(
    (currentPage - 1) * urlsPerPage,
    currentPage * urlsPerPage
  );

  return (
    <div className="url-page">
      {/* Navbar */}
      <nav className="navbar">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="navbar-title"
        >
          URL Shortener
        </motion.h1>
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search URLs (min 3 characters)"
            className="search-input"
          />
        </div>
      </nav>

      {/* Main Content */}
      {/* <div className="container"> */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="form-container"
        >
          <h2 className="form-title">Create Short URL</h2>
          <form onSubmit={handleSubmit}>
            <Input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter long URL"
              className="form-input"
            />
            {error && <p className="form-error">{error}</p>}
            <div className="form-buttons">
              <Button disabled={isLoading}>
                {isLoading ? "Creating..." : "Create URL"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setLongUrl("");
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      ) : (
        // <div className="wide-container">
        <div className="table-section">
          <div className="short">
            {/* Decode URL Section */}
            <div className="decode-section">
              <h2>Decode Short URL</h2>
              <div>
                <Input
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  placeholder="Enter short URL code (e.g., abc1234)"
                  className="form-input"
                />
              </div>
              <div>
                <Button onClick={handleDecode} disabled={isLoading}>
                  {isLoading ? "Decoding..." : "Decode"}
                </Button>
              </div>
              {decodedUrl && (
                <p>
                  Long URL:{" "}
                  <a href={decodedUrl.longUrl}>{decodedUrl.longUrl}</a>
                </p>
              )}
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <h2>View URL Statistics</h2>
              <div>
                <Input
                  value={statsInput}
                  onChange={(e) => setStatsInput(e.target.value)}
                  placeholder="Enter short URL code (e.g., abc1234)"
                  className="form-input"
                />
              </div>
              <div>
                <Button onClick={handleStats} disabled={isLoading}>
                  {isLoading ? "Fetching..." : "Get Stats"}
                </Button>
              </div>
              {stats && (
                <div className="stats">
                  <p>Short URL: {stats.shortUrl}</p>
                  <p>Long URL: {stats.longUrl}</p>
                  <p>Clicks: {stats.clickCount}</p>
                </div>
              )}
            </div>
          </div>

          <div className="create-button-wrapper">
            <Button onClick={() => setShowForm(true)} className="create-button">
              Create New URL
            </Button>
          </div>

          {isLoading ? (
            <Loading />
          ) : filteredUrls.length === 0 ? (
            <p className="no-urls">No URLs found.</p>
          ) : (
            <>
              <UrlTable urls={paginatedUrls} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
          {error && (
            <p className="" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </div>
        // </div>
      )}
      {/* </div> */}
    </div>
  );
};

export default UrlPage;
