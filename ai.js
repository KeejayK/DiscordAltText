const OpenAI = require("openai");
const {
    ComputerVisionClient,
} = require("@azure/cognitiveservices-computervision");
const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN });

const openaiApiCall = async (imageUrl) => {
    const promptText = `You are a bot for a Discord server. This implies that some images are memes and some are not. 
                        You are to generate a caption for the image. The caption should be a complete sentence and concise. 
                        The caption should be no more than 50 words. 
                        Use Plain Language. Use simple words. 
                        Avoid jargon, technical terms, and abbreviations. 
                        Include information about the location if it is relevant. 
                        Be gender-neutral.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: promptText },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ],
    });
    return(response.choices[0]['message']['content']);



};

const azureVisionApiCall = async (imageUrl) => {
    const computerVisionKey = process.env.VISION_KEY;
    const computerVisionEndPoint = process.env.VISION_ENDPOINT;
    const cognitiveServiceCredentials = new CognitiveServicesCredentials(
        computerVisionKey
    );
    const client = new ComputerVisionClient(
        cognitiveServiceCredentials,
        computerVisionEndPoint
    );

    const url = imageUrl;
    const options = {
        maxCandidates: 10,
        language: "en",
    };
    let response = await client.describeImage(url, options)
    if (response['captions'][0]['text']) {
        return(response['captions'][0]['text'])
    }
    return (response)
};

module.exports = {
  openaiApiCall,
  azureVisionApiCall,
};

// openaiApiCall('https://cdn.discordapp.com/attachments/1178516600824012834/1182830895414132897/cat.jpg?ex=6586201d&is=6573ab1d&hm=e34ea6b025e504813a38f5013f0531eaccfbc2c5fe699caadbc2d57f8fa2a19e&')
// azureVisionApiCall('https://cdn.discordapp.com/attachments/1178516600824012834/1182830895414132897/cat.jpg?ex=6586201d&is=6573ab1d&hm=e34ea6b025e504813a38f5013f0531eaccfbc2c5fe699caadbc2d57f8fa2a19e&')
