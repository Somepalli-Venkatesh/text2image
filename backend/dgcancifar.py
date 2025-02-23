# import tensorflow as tf
# from tensorflow.keras import layers
# import matplotlib.pyplot as plt
# import numpy as np
# import os

# # Define the Generator
# def build_generator(latent_dim):
#     model = tf.keras.Sequential([
#         layers.Dense(8 * 8 * 256, use_bias=False, input_shape=(latent_dim,)),
#         layers.BatchNormalization(),
#         layers.LeakyReLU(),
#         layers.Reshape((8, 8, 256)),
#         layers.Conv2DTranspose(128, (5, 5), strides=(2, 2), padding='same', use_bias=False),
#         layers.BatchNormalization(),
#         layers.LeakyReLU(),
#         layers.Conv2DTranspose(64, (5, 5), strides=(2, 2), padding='same', use_bias=False),
#         layers.BatchNormalization(),
#         layers.LeakyReLU(),
#         layers.Conv2DTranspose(3, (5, 5), strides=(1, 1), padding='same', use_bias=False, activation='tanh')
#     ])
#     return model

# # Define the Discriminator
# def build_discriminator():
#     model = tf.keras.Sequential([
#         layers.Conv2D(64, (5, 5), strides=(2, 2), padding='same', input_shape=(32, 32, 3)),
#         layers.LeakyReLU(),
#         layers.Dropout(0.3),
#         layers.Conv2D(128, (5, 5), strides=(2, 2), padding='same'),
#         layers.LeakyReLU(),
#         layers.Dropout(0.3),
#         layers.Flatten(),
#         layers.Dense(1, activation='sigmoid')
#     ])
#     return model

# # Function to preprocess CIFAR-10 dataset
# def preprocess_cifar10():
#     (train_images, _), (_, _) = tf.keras.datasets.cifar10.load_data()
#     train_images = train_images.astype('float32')
#     train_images = (train_images - 127.5) / 127.5  # Normalize to [-1, 1]
#     train_dataset = tf.data.Dataset.from_tensor_slices(train_images).shuffle(50000).batch(64)
#     return train_dataset

# # Function to generate and save images
# def generate_and_save_images(model, epoch, latent_dim, num_examples=16):
#     noise = tf.random.normal([num_examples, latent_dim])
#     generated_images = model(noise, training=False)
#     generated_images = (generated_images + 1) / 2.0  # Rescale to [0, 1]

#     plt.figure(figsize=(4, 4))
#     for i in range(num_examples):
#         plt.subplot(4, 4, i + 1)
#         plt.imshow(generated_images[i])
#         plt.axis('off')
#     plt.savefig(f"generated_image_epoch_{epoch}.png")
#     plt.show()

# # Save the trained generator and discriminator models
# def save_models(generator, discriminator, output_dir="saved_models"):
#     os.makedirs(output_dir, exist_ok=True)
#     generator.save(os.path.join(output_dir, "cifargenerator.h5"))
#     discriminator.save(os.path.join(output_dir, "cifardiscriminator.h5"))
#     print(f"Models saved to {output_dir}")

# # Define a custom training step
# @tf.function
# def train_step(generator, discriminator, images, latent_dim, generator_optimizer, discriminator_optimizer):
#     noise = tf.random.normal([images.shape[0], latent_dim])

#     with tf.GradientTape() as disc_tape, tf.GradientTape() as gen_tape:
#         fake_images = generator(noise, training=True)
#         real_output = discriminator(images, training=True)
#         fake_output = discriminator(fake_images, training=True)

#         d_loss_real = tf.keras.losses.binary_crossentropy(tf.ones_like(real_output), real_output)
#         d_loss_fake = tf.keras.losses.binary_crossentropy(tf.zeros_like(fake_output), fake_output)
#         d_loss = d_loss_real + d_loss_fake

#         g_loss = tf.keras.losses.binary_crossentropy(tf.ones_like(fake_output), fake_output)

#     gradients_of_discriminator = disc_tape.gradient(d_loss, discriminator.trainable_variables)
#     gradients_of_generator = gen_tape.gradient(g_loss, generator.trainable_variables)

#     discriminator_optimizer.apply_gradients(zip(gradients_of_discriminator, discriminator.trainable_variables))
#     generator_optimizer.apply_gradients(zip(gradients_of_generator, generator.trainable_variables))

#     return d_loss, g_loss

# # Training function with model saving
# def train_gan(generator, discriminator, dataset, epochs, latent_dim, g_optimizer, d_optimizer, save_path="saved_models"):
#     for epoch in range(epochs):
#         print(f"Epoch {epoch + 1}/{epochs}")
#         for images in dataset:
#             d_loss, g_loss = train_step(generator, discriminator, images, latent_dim, g_optimizer, d_optimizer)

#         print(f"Discriminator Loss: {tf.reduce_mean(d_loss):.4f}, Generator Loss: {tf.reduce_mean(g_loss):.4f}")

#         if (epoch + 1) % 10 == 0:
#             generate_and_save_images(generator, epoch + 1, latent_dim)

#     save_models(generator, discriminator, save_path)

# # Main script
# if __name__ == "__main__":
#     latent_dim = 100
#     epochs = 50
#     save_path = "saved_models"

#     train_dataset = preprocess_cifar10()

#     generator = build_generator(latent_dim)
#     discriminator = build_discriminator()

#     generator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)
#     discriminator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)

#     train_gan(generator, discriminator, train_dataset, epochs, latent_dim, generator_optimizer, discriminator_optimizer, save_path)


import tensorflow as tf
from tensorflow.keras import layers
import matplotlib.pyplot as plt
import numpy as np
import os
from tqdm import tqdm
import time

# Define the Generator
def build_generator(latent_dim):
    model = tf.keras.Sequential([
        layers.Dense(8 * 8 * 256, use_bias=False, input_shape=(latent_dim,)),
        layers.BatchNormalization(),
        layers.LeakyReLU(),
        layers.Reshape((8, 8, 256)),
        layers.Conv2DTranspose(128, (5, 5), strides=(2, 2), padding='same', use_bias=False),
        layers.BatchNormalization(),
        layers.LeakyReLU(),
        layers.Conv2DTranspose(64, (5, 5), strides=(2, 2), padding='same', use_bias=False),
        layers.BatchNormalization(),
        layers.LeakyReLU(),
        layers.Conv2DTranspose(3, (5, 5), strides=(1, 1), padding='same', use_bias=False, activation='tanh')
    ])
    return model

# Define the Discriminator
def build_discriminator():
    model = tf.keras.Sequential([
        layers.Conv2D(64, (5, 5), strides=(2, 2), padding='same', input_shape=(32, 32, 3)),
        layers.LeakyReLU(),
        layers.Dropout(0.3),
        layers.Conv2D(128, (5, 5), strides=(2, 2), padding='same'),
        layers.LeakyReLU(),
        layers.Dropout(0.3),
        layers.Flatten(),
        layers.Dense(1, activation='sigmoid')
    ])
    return model

def preprocess_cifar10():
    (train_images, _), (_, _) = tf.keras.datasets.cifar10.load_data()
    train_images = train_images.astype('float32')
    train_images = (train_images - 127.5) / 127.5  # Normalize to [-1, 1]
    train_dataset = tf.data.Dataset.from_tensor_slices(train_images).shuffle(50000).batch(64)
    return train_dataset

def generate_and_save_images(model, epoch, latent_dim, num_examples=16):
    noise = tf.random.normal([num_examples, latent_dim])
    generated_images = model(noise, training=False)
    generated_images = (generated_images + 1) / 2.0  # Rescale to [0, 1]

    plt.figure(figsize=(4, 4))
    for i in range(num_examples):
        plt.subplot(4, 4, i + 1)
        plt.imshow(generated_images[i])
        plt.axis('off')
    
    # Create directory if it doesn't exist
    os.makedirs('generated_images', exist_ok=True)
    plt.savefig(f"generated_images/epoch_{epoch}.png")
    plt.close()

def save_models(generator, discriminator, output_dir="saved_models"):
    os.makedirs(output_dir, exist_ok=True)
    generator.save(os.path.join(output_dir, "cifar_generator.h5"))
    discriminator.save(os.path.join(output_dir, "cifar_discriminator.h5"))
    print(f"Models saved to {output_dir}")

class GANMetrics:
    def __init__(self):
        self.d_accuracy_real = tf.keras.metrics.BinaryAccuracy()
        self.d_accuracy_fake = tf.keras.metrics.BinaryAccuracy()
        
    def reset_states(self):
        self.d_accuracy_real.reset_states()
        self.d_accuracy_fake.reset_states()
        
    @property
    def discriminator_accuracy(self):
        return (self.d_accuracy_real.result() + self.d_accuracy_fake.result()) / 2

def calculate_accuracy(real_output, fake_output):
    real_accuracy = tf.reduce_mean(tf.cast(real_output > 0.5, tf.float32))
    fake_accuracy = tf.reduce_mean(tf.cast(fake_output < 0.5, tf.float32))
    return (real_accuracy + fake_accuracy) / 2

@tf.function
def train_step(generator, discriminator, images, latent_dim, generator_optimizer, discriminator_optimizer):
    batch_size = tf.shape(images)[0]
    noise = tf.random.normal([batch_size, latent_dim])

    with tf.GradientTape() as disc_tape, tf.GradientTape() as gen_tape:
        # Generate fake images
        fake_images = generator(noise, training=True)
        
        # Get discriminator outputs
        real_output = discriminator(images, training=True)
        fake_output = discriminator(fake_images, training=True)
        
        # Calculate losses
        d_loss_real = tf.reduce_mean(tf.keras.losses.binary_crossentropy(tf.ones_like(real_output), real_output))
        d_loss_fake = tf.reduce_mean(tf.keras.losses.binary_crossentropy(tf.zeros_like(fake_output), fake_output))
        d_loss = d_loss_real + d_loss_fake
        
        g_loss = tf.reduce_mean(tf.keras.losses.binary_crossentropy(tf.ones_like(fake_output), fake_output))
        
        # Calculate accuracy
        accuracy = calculate_accuracy(real_output, fake_output)

    # Calculate and apply gradients
    d_gradients = disc_tape.gradient(d_loss, discriminator.trainable_variables)
    g_gradients = gen_tape.gradient(g_loss, generator.trainable_variables)
    
    discriminator_optimizer.apply_gradients(zip(d_gradients, discriminator.trainable_variables))
    generator_optimizer.apply_gradients(zip(g_gradients, generator.trainable_variables))
    
    return d_loss, g_loss, accuracy

def train_gan(generator, discriminator, dataset, epochs, latent_dim, g_optimizer, d_optimizer, save_path="saved_models"):
    metrics = GANMetrics()
    
    # Create directories for logs
    os.makedirs('logs', exist_ok=True)
    log_file = open('logs/training_log.txt', 'w')
    
    for epoch in range(epochs):
        start_time = time.time()
        
        # Initialize metrics for this epoch
        d_losses = []
        g_losses = []
        accuracies = []
        
        # Create progress bar for this epoch
        with tqdm(dataset, desc=f'Epoch {epoch+1}/{epochs}', unit='batch') as pbar:
            for batch in pbar:
                d_loss, g_loss, accuracy = train_step(
                    generator, discriminator, batch, latent_dim,
                    g_optimizer, d_optimizer
                )
                
                # Store metrics
                d_losses.append(float(d_loss))
                g_losses.append(float(g_loss))
                accuracies.append(float(accuracy))
                
                # Update progress bar
                pbar.set_postfix({
                    'D_loss': f'{np.mean(d_losses):.4f}',
                    'G_loss': f'{np.mean(g_losses):.4f}',
                    'Acc': f'{np.mean(accuracies):.2%}'
                })
        
        # End of epoch statistics
        epoch_time = time.time() - start_time
        epoch_stats = (
            f'\nEpoch {epoch+1} Statistics:\n'
            f'Discriminator Loss: {np.mean(d_losses):.4f}\n'
            f'Generator Loss: {np.mean(g_losses):.4f}\n'
            f'Discriminator Accuracy: {np.mean(accuracies):.2%}\n'
            f'Time taken: {epoch_time:.2f} seconds\n'
            f'----------------------------------------\n'
        )
        
        # Print and log statistics
        print(epoch_stats)
        log_file.write(epoch_stats)
        log_file.flush()
        
        # Generate and save sample images every 5 epochs
        if (epoch + 1) % 5 == 0:
            generate_and_save_images(generator, epoch + 1, latent_dim)
            save_models(generator, discriminator, save_path)
    
    log_file.close()

if __name__ == "__main__":
    # Set random seeds for reproducibility
    tf.random.set_seed(42)
    np.random.seed(42)
    
    # Training parameters
    latent_dim = 100
    epochs =5
    batch_size = 64
    save_path = "saved_models"

    # Create necessary directories
    os.makedirs(save_path, exist_ok=True)
    os.makedirs('generated_images', exist_ok=True)
    os.makedirs('logs', exist_ok=True)

    print("Loading and preprocessing dataset...")
    train_dataset = preprocess_cifar10()

    print("Building models...")
    generator = build_generator(latent_dim)
    discriminator = build_discriminator()

    # Initialize optimizers
    generator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)
    discriminator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5)

    print("Starting training...")
    train_gan(generator, discriminator, train_dataset, epochs, latent_dim, 
             generator_optimizer, discriminator_optimizer, save_path)
    
    print("Training completed!")