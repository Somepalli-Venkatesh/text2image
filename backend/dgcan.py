import tensorflow as tf
from tensorflow.keras import layers
import matplotlib.pyplot as plt
import numpy as np

# Define the Generator
def build_generator(latent_dim):
    model = tf.keras.Sequential([
        layers.Dense(7 * 7 * 256, use_bias=False, input_shape=(latent_dim,)),
        layers.BatchNormalization(),
        layers.LeakyReLU(),
        layers.Reshape((7, 7, 256)),
        layers.Conv2DTranspose(128, (5, 5), strides=(1, 1), padding='same', use_bias=False),
        layers.BatchNormalization(),
        layers.LeakyReLU(),
        layers.Conv2DTranspose(64, (5, 5), strides=(2, 2), padding='same', use_bias=False),
        layers.BatchNormalization(),
        layers.LeakyReLU(),
        layers.Conv2DTranspose(1, (5, 5), strides=(2, 2), padding='same', use_bias=False, activation='tanh')
    ])
    return model

# Define the Discriminator
def build_discriminator(image_shape):
    model = tf.keras.Sequential([
        layers.Conv2D(64, (5, 5), strides=(2, 2), padding='same', input_shape=image_shape),
        layers.LeakyReLU(),
        layers.Dropout(0.3),
        layers.Conv2D(128, (5, 5), strides=(2, 2), padding='same'),
        layers.LeakyReLU(),
        layers.Dropout(0.3),
        layers.Flatten(),
        layers.Dense(1, activation='sigmoid')
    ])
    return model

# Function to generate and save images
def generate_and_save_images(model, epoch, latent_dim, num_examples=16):
    noise = tf.random.normal([num_examples, latent_dim])
    generated_images = model(noise, training=False)
    generated_images = (generated_images + 1) / 2.0  # Rescale to [0, 1]

    plt.figure(figsize=(4, 4))
    for i in range(num_examples):
        plt.subplot(4, 4, i + 1)
        plt.imshow(generated_images[i, :, :, 0], cmap='gray')
        plt.axis('off')
    plt.savefig(f"generated_image_epoch_{epoch}.png")
    plt.show()

# Define a custom training step
@tf.function
def train_step(generator, discriminator, images, latent_dim, generator_optimizer, discriminator_optimizer):
    noise = tf.random.normal([images.shape[0], latent_dim])

    with tf.GradientTape() as disc_tape, tf.GradientTape() as gen_tape:
        fake_images = generator(noise, training=True)
        real_output = discriminator(images, training=True)
        fake_output = discriminator(fake_images, training=True)

        d_loss_real = tf.keras.losses.binary_crossentropy(tf.ones_like(real_output), real_output)
        d_loss_fake = tf.keras.losses.binary_crossentropy(tf.zeros_like(fake_output), fake_output)
        d_loss = d_loss_real + d_loss_fake

        g_loss = tf.keras.losses.binary_crossentropy(tf.ones_like(fake_output), fake_output)

    gradients_of_discriminator = disc_tape.gradient(d_loss, discriminator.trainable_variables)
    gradients_of_generator = gen_tape.gradient(g_loss, generator.trainable_variables)

    discriminator_optimizer.apply_gradients(zip(gradients_of_discriminator, discriminator.trainable_variables))
    generator_optimizer.apply_gradients(zip(gradients_of_generator, generator.trainable_variables))

    return d_loss, g_loss

# Training function
def train_gan(generator, discriminator, dataset, epochs, latent_dim, generator_optimizer, discriminator_optimizer):
    for epoch in range(epochs):
        print(f"Epoch {epoch + 1}/{epochs}")
        for images in dataset:
            d_loss, g_loss = train_step(generator, discriminator, images, latent_dim, generator_optimizer, discriminator_optimizer)

        print(f"Discriminator Loss: {tf.reduce_mean(d_loss)}, Generator Loss: {tf.reduce_mean(g_loss)}")

        if (epoch + 1) % 10 == 0:
            generate_and_save_images(generator, epoch + 1, latent_dim)
    print("Saving models...")
    generator.save("generator_model.h5")
    discriminator.save("discriminator_model.h5")
    print("Models saved successfully!")

# Main script
if __name__ == "__main__":
    latent_dim = 100
    image_shape = (28, 28, 1)
    batch_size = 64
    epochs = 50

    # Load and preprocess MNIST dataset
    (train_images, _), (_, _) = tf.keras.datasets.mnist.load_data()
    train_images = train_images.reshape(train_images.shape[0], 28, 28, 1).astype('float32')
    train_images = (train_images - 127.5) / 127.5  # Normalize to [-1, 1]
    train_dataset = tf.data.Dataset.from_tensor_slices(train_images).shuffle(60000).batch(batch_size)

    # Build and compile models
    generator = build_generator(latent_dim)
    discriminator = build_discriminator(image_shape)

    generator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)
    discriminator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)

    # Train the GAN
    train_gan(generator, discriminator, train_dataset, epochs, latent_dim, generator_optimizer, discriminator_optimizer)
