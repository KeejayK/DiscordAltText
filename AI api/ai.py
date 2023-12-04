import os
import requests
import azure.ai.vision as sdk

from dotenv import load_dotenv
from openai import AsyncOpenAI


load_dotenv()

open_ai_token = os.getenv("OPENAI_TOKEN")
client = AsyncOpenAI(api_key=open_ai_token)

# note: it seems like openAI doesn't give out free credits anymore
# https://platform.openai.com/docs/api-reference/chat/create?lang=python
async def get_text_from_image_openai(image_url):
    response = await client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "What's in this image?"},
                    {
                        "type": "image_url",
                        "image_url": image_url,
                    },
                ],
            }
        ],
        max_tokens=300,
    )
    print(response.choices[0])

# azure
# taken from https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library-40?tabs=visual-studio%2Cwindows&pivots=programming-language-python
service_options = sdk.VisionServiceOptions(os.getenv("VISION_ENDPOINT"),
                                           os.getenv("VISION_KEY"))

async def get_text_from_image_azure(image_url):
    vision_source = sdk.VisionSource(url=image_url)
    analysis_options = sdk.ImageAnalysisOptions()

    analysis_options.features = (
        sdk.ImageAnalysisFeature.CAPTION |
        sdk.ImageAnalysisFeature.DENSE_CAPTIONS |
        sdk.ImageAnalysisFeature.TEXT
    )

    analysis_options.language = "en"
    analysis_options.gender_neutral_caption = True
    image_analyzer = sdk.ImageAnalyzer(service_options, vision_source, analysis_options)
    result = image_analyzer.analyze()

    if result.reason == sdk.ImageAnalysisResultReason.ANALYZED:
        if result.caption is not None:
            print(" Caption:")
            print("   '{}', Confidence {:.4f}".format(result.caption.content, result.caption.confidence))
            return result.caption.content
        if result.dense_captions is not None:
            print(" Dense Captions:")
            for caption in result.dense_captions:
                print("   '{}', {}, Confidence: {:.4f}".format(caption.content, caption.bounding_box, caption.confidence))
        if result.text is not None:
            print(" Text:")
            for line in result.text.lines:
                points_string = "{" + ", ".join([str(int(point)) for point in line.bounding_polygon]) + "}"
                print("   Line: '{}', Bounding polygon {}".format(line.content, points_string))
                for word in line.words:
                    points_string = "{" + ", ".join([str(int(point)) for point in word.bounding_polygon]) + "}"
                    print("     Word: '{}', Bounding polygon {}, Confidence {:.4f}"
                        .format(word.content, points_string, word.confidence))
        else:
            error_details = sdk.ImageAnalysisErrorDetails.from_result(result)
            print(" Analysis failed.")
            print("   Error reason: {}".format(error_details.reason))
            print("   Error code: {}".format(error_details.error_code))
            print("   Error message: {}".format(error_details.message))


