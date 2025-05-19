const { InferenceClient } = require("@huggingface/inference");

const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Initialize the HuggingFace client
    const client = new InferenceClient(process.env.FAL_API_KEY);

    try {
      // Generate the image using FLUX model
      const image = await client.textToImage({
        provider: "fal-ai",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: prompt.trim(),
        parameters: {
          num_inference_steps: 5,
        },
      });

      if (!image) {
        throw new Error("No image generated");
      }

      // Convert blob to base64
      const buffer = await image.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = image.type || "image/jpeg";

      // Return the image data
      res.json({
        image: {
          url: `data:${mimeType};base64,${base64}`,
          mimeType: mimeType,
        },
      });
    } catch (falError) {
      console.error("Image generation error:", falError);
      throw new Error(
        "Failed to generate image: " + (falError.message || "Unknown error")
      );
    }
  } catch (error) {
    console.error("Error generating image:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate image" });
  }
};

module.exports = {
  generateImage,
};
