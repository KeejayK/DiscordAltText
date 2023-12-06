const openaiApiCall = (imageUrl) => {
    const openAiToken = process.env.OPENAI_TOKEN;
    const promptText = `You are a bot for a Discord server. This implies that some images are memes and some are not. 
                        You are to generate a caption for the image. The caption should be a complete sentence and concise. 
                        The caption should be no more than 50 words. 
                        Use Plain Language. Use simple words. 
                        Avoid jargon, technical terms, and abbreviations. 
                        Include information about the location if it is relevant. 
                        Be gender-neutral.`;
  
    const data = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            { type: "image_url", image_url: imageUrl }
          ]
        }
      ],
      max_tokens: 300
    };
  
    const curlCommand = `curl https://api.openai.com/v1/chat/completions \\
      -H "Content-Type: application/json" \\
      -H "Authorization: Bearer ${openAiToken}" \\
      -d '${JSON.stringify(data)}'`;
  
    return curlCommand; // Change this to return the response (response.choices[0].message.content)
};

const azureVisionApiCall = (imageUrl) => {
    const subscriptionKey = process.env.VISION_KEY;
    const endpoint = process.env.VISION_ENDPOINT;

    const data = { url: imageUrl };

    const curlCommand = `curl -H "Ocp-Apim-Subscription-Key: ${subscriptionKey}" -H "Content-Type: application/json" \\
        "${endpoint}/computervision/imageanalysis:analyze?features=caption,read&model-version=latest&language=en&api-version=2023-10-01" \\
        -d '${JSON.stringify(data)}'`;

    return curlCommand; // Change this to return the response (response.description.captions[0].text)
};

// Usage example
const imageUrl = "https://your-image-url.com"; // Replace with your image URL
console.log(openaiApiCall(imageUrl));
console.log(azureVisionApiCall(imageUrl));

