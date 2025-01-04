import express from "express";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();
app.use(express.json());

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Route to handle image generation
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Generate image using OpenAI API
    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    // Extract base64 image data
    const imageBase64 = aiResponse.data.data[0].b64_json;

    // Respond with the generated image
    res.status(200).json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      message: error?.response?.data?.error?.message || "Something went wrong",
    });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from OpenAI Image Generator!" });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
