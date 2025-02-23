def generate_image(text):
    if "object" not in text.lower():  # Check if the text is generic
        return "default_image.jpg", "Please provide objects in the text."
    
    # Otherwise, generate image using DCGAN
    noise = tf.random.normal([1, 100])
    text_features = encode_text(text)
    combined_input = tf.concat([noise, text_features], axis=-1)
    generated_image = generator(combined_input, training=False)
    return generated_image, None