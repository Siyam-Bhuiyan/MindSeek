import React, { useState } from "react";
import axios from "axios";
import { Send, Loader2 } from "lucide-react";
import "./TextToImage.css";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/image/generate",
        { prompt: prompt.trim() }
      );

      if (response.data && response.data.image) {
        setGeneratedImage(response.data.image);
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateImage();
  };

  return (
    <div className="text-to-image-container">
      <div className="text-to-image-header">
        <h1 className="text-to-image-title">Text to Image Generator</h1>
        <p className="text-to-image-subtitle">
          Transform your ideas into stunning images using AI
        </p>
      </div>

      <div className="text-to-image-content">
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="input-container">
            <textarea
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={3}
            />
            <button
              type="submit"
              className="generate-btn"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>

        <div className="result-container">
          {error && <div className="error-message">{error}</div>}

          {isLoading && (
            <div className="loading-container">
              <Loader2 className="animate-spin" size={32} />
              <p>Creating your masterpiece...</p>
            </div>
          )}

          {generatedImage && !isLoading && (
            <div className="image-container">
              <img
                src={generatedImage.url}
                alt="Generated artwork"
                className="generated-image"
              />
              <div className="image-actions">
                <a
                  href={generatedImage.url}
                  download="generated-image.png"
                  className="download-btn"
                >
                  Download Image
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
