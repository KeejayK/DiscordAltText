import os
from ai import get_text_from_image_azure

def test_get_text_from_image_azure():
    image_url = "/testImage.jpeg"
    get_text_from_image_azure(image_url)

if __name__ == "__main__":
    test_get_text_from_image_azure()