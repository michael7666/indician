import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import UrlTable from "../components/Table";
import Pagination from "../components/Pagination";
import "./url.css";
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
  const [decodedUrl, setDecodedUrl] = useState<DecodeUrlResponse | null>(null);
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState<"decode" | "stats" | null>(null);
  const urlsPerPage = 5;

  // Simple URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Extract short code from full URL
  const getShortCode = (fullUrl: string): string => {
    if (typeof fullUrl !== "string") return "";
    return fullUrl.startsWith(API_BASE_URL)
      ? fullUrl.replace(`${API_BASE_URL}/`, "")
      : fullUrl;
  };

  // Fetch all URLs on mount
  useEffect(() => {
    const fetchUrls = async () => {
      setIsLoading(true);
      try {
        const fetchedUrls = await getAllUrls();
        console.log("Fetched URLs:", fetchedUrls); // Debug
        const validatedUrls = fetchedUrls.filter(
          (url) =>
            typeof url.shortUrl === "string" &&
            url.shortUrl.startsWith(API_BASE_URL)
        );
        setUrls(validatedUrls);
        setFilteredUrls(validatedUrls);
      } catch (err) {
        setError("Failed to fetch URLs");
        console.error("Fetch error:", err); // Debug
      } finally {
        setIsLoading(false);
      }
    };
    fetchUrls();
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    const searchTerm = value.toLowerCase();
    const filtered = urls.filter((url) => {
      const longUrlMatch =
        typeof url.longUrl === "string" &&
        url.longUrl.toLowerCase().includes(searchTerm);
      const shortCode = getShortCode(url.shortUrl);
      const shortUrlMatch =
        typeof shortCode === "string" &&
        shortCode.toLowerCase().includes(searchTerm);
      return longUrlMatch || shortUrlMatch;
    });
    console.log("Search term:", searchTerm, "Filtered URLs:", filtered); // Debug
    setFilteredUrls(filtered);
    setCurrentPage(1);
  };

  // Create URL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      setError("Please enter a URL");
      return;
    }
    if (!isValidUrl(longUrl)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    setIsLoading(true);
    try {
      const response = await shortenUrl({ longUrl });
      const newUrl: Url = {
        id: response.shortUrl,
        longUrl,
        shortUrl: `${API_BASE_URL}/${response.shortUrl}`,
        createdAt: new Date().toISOString(),
        visits: 0,
      };
      console.log("New URL:", newUrl); // Debug
      const updatedUrls = [newUrl, ...urls];
      console.log("Updated URLs:", updatedUrls); // Debug
      setUrls(updatedUrls);
      setFilteredUrls(updatedUrls);
      setLongUrl("");
      setShowForm(false);
      setError("");
      setCurrentPage(1);
    } catch (err) {
      setError((err as Error).message || "Failed to create URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Decode URL
  const handleDecode = async (shortCode: string) => {
    if (!shortCode) {
      setError("Invalid short URL code");
      return;
    }
    setIsLoading(true);
    try {
      const response = await decodeUrl(shortCode);
      setDecodedUrl(response);
      setStats(null); // Clear stats to show only decode result
      setShowModal("decode");
      setError("");
    } catch (err) {
      setError((err as Error).message || "Failed to decode URL");
    } finally {
      setIsLoading(false);
    }
  };

  // Get Stats
  const handleStats = async (shortCode: string) => {
    if (!shortCode) {
      setError("Invalid short URL code");
      return;
    }
    setIsLoading(true);
    try {
      const response = await getUrlStats(shortCode);
      setStats(response);
      setDecodedUrl(null); // Clear decode result to show only stats
      setShowModal("stats");
      setError("");
    } catch (err) {
      setError((err as Error).message || "Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil((filteredUrls?.length || 0) / urlsPerPage);
  const paginatedUrls =
    filteredUrls?.slice(
      (currentPage - 1) * urlsPerPage,
      currentPage * urlsPerPage
    ) || [];

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
            placeholder="Search by long URL or short code"
            className="search-input"
          />
        </div>
      </nav>

      {/* Main Content */}
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
        <div className="table-section">
          <div className="create-button-wrapper">
            <Button onClick={() => setShowForm(true)} className="create-button">
              Create New URL
            </Button>
          </div>

          {/* URL Table */}
          {isLoading ? (
            <Loading />
          ) : !filteredUrls || filteredUrls.length === 0 ? (
            <p className="no-urls">No URLs found.</p>
          ) : (
            <>
              <UrlTable
                urls={paginatedUrls}
                onDecode={handleDecode}
                onStats={handleStats}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>
                  {showModal === "decode" ? "Decoded URL" : "URL Statistics"}
                </h3>
                {showModal === "decode" && decodedUrl && (
                  <p>
                    Long URL:{" "}
                    <a href={decodedUrl.longUrl}>{decodedUrl.longUrl}</a>
                  </p>
                )}
                {showModal === "stats" && stats && (
                  <>
                    <p>Short URL: {stats.shortUrl}</p>
                    <p>Long URL: {stats.longUrl}</p>
                    <p>Clicks: {stats.clickCount}</p>
                  </>
                )}
                <button onClick={() => setShowModal(null)}>Close</button>
              </div>
            </div>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default UrlPage;
