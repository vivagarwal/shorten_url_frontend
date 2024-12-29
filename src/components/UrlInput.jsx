import { useState, useEffect } from "react";
import axios from "axios";

function UrlInput() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(""); // State for the shortened URL

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

    if (!url) {
      setError("Please enter a URL.");
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
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
            role="alert"
          >
            Shortened URL:{" "}
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {shortenedUrl}
            </a>
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  );
}

export default UrlInput;
