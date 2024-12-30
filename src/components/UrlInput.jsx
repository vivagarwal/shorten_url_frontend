import { useState, useEffect } from "react";
import axios from "axios";

function UrlInput() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(""); // State for the shortened URL
  const [loading, setLoading] = useState(false); // State for the loading indicator
  const [copied, setCopied] = useState(false); // State to show if the URL has been copied

  const baseUrl = import.meta.env.VITE_BASE_URL; // Access base URL from environment variable

  // Reset form values on component mount
  useEffect(() => {
    setUrl("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error message
    setError("");
    setShortenedUrl(""); // Clear the previous shortened URL
    setCopied(false); // Reset the copied state
    setLoading(true); // Show the loading indicator

    if (!url) {
      setError("Please enter a URL.");
      setLoading(false); // Stop loading
      return;
    }

    axios
      .post(`${baseUrl}/generate`, { url }) // Send the object directly without JSON.stringify
      .then((response) => {
        const result = response.data; // Use `data` instead of `json`
        console.log(result);
        if (result.message === "URL shortID created!") {
          const generatedUrl = `${baseUrl}/fetch/${result.id}`;
          setShortenedUrl(generatedUrl); // Set the shortened URL
          setUrl(""); // Reset the input field
        } else {
          console.log("Shorten failed or unexpected response");
          setError(result.message); // Display server message as error
        }
      })
      .catch((err) => {
        console.log(err);

        // Handle different error scenarios
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message); // Set the error message from server
        } else if (err.request) {
          setError("Network Error: Please try again later");
        } else {
          setError("An unexpected error occurred");
        }
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-green-600 min-h-screen w-screen overflow-hidden">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-2">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          URL SHORTENER
        </h2>

        {/* Display the error message if it exists */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Display the shortened URL if it exists */}
        {shortenedUrl && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 flex items-center justify-between"
            role="alert"
          >
            <span>
              Shortened URL:{" "}
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {shortenedUrl}
              </a>
            </span>
            <button
              onClick={handleCopy}
              className="ml-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 16h8m-8-4h8m-6 8h8M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Show copied confirmation */}
        {copied && (
          <div className="text-green-600 text-center mb-4">
            URL copied to clipboard!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative mb-4">
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700"
            >
              URL
            </label>
            <div className="relative">
              {/* Input field with icon */}
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-5 w-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 010 5.656m-3.656-5.656a4 4 0 010 5.656m5.656-7.778a6 6 0 000 8.486m-8.486 0a6 6 0 000-8.486"
                  />
                </svg>
              </span>
              <input
                type="text"
                id="url"
                placeholder="Enter URL"
                autoComplete="off"
                name="url"
                className="w-full pl-10 pr-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full text-white py-2 rounded-lg transition duration-300 transform focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UrlInput;
