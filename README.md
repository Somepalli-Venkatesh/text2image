# 🎨 Text-to-Image Synthesis with DC-GAN: A Deep Learning Approach ⚡

🖌️ **Transform text prompts into stunning visuals** using a Deep Convolutional GAN (DC-GAN). This full-stack  project combines NLP and generative models for creative image synthesis, complete with user interactions and social features.



## 🚀 Key Features
### 🧑💻 User Experience
- 📱 **Responsive UI**: Works flawlessly on mobile/desktop
- 🔒  Secure login/signup flow
- 🖼️ **Dynamic Gallery**:
  - ⬆️ Upload images (PNG/JPG)
  - ⬇️ Download with 1-click
  - ❤️ Like & 💬 Comment system
  - 🌐 Social sharing (Twitter/Facebook/WhatsApp)

### 🧠 AI & Backend
- 🌀 **DC-GAN Model**: Trained on 60k Cifar-100 dataset samples
- 🔄 **Smart Sorting**:
  - 🕒 Recent | 📅 Oldest | 🏆 Most liked
  - 🔍 Search by tags/descriptions




## 🛠️ Tech Stack
### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&style=for-the-badge)


### Backend
![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&style=for-the-badge)




## 🛠 Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/Somepalli-Venkatesh/text2image
```

2. **Install dependencies for the root**
```bash
npm install
```
3. **Start the frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Set up the backend**
```bash
cd backend
pip install -r requirements.txt
```

5. **Start the backend**
```bash
python app_cim.py
```
## Project Structure
```
text2Image/
├── client/               # React + Vite frontend application
│   ├── public/           # Static assets
│   └── src/              # Components, pages, styles
├── backend/               # Flask backend 
│   ├── static/gallery            
│   ├── app.py        
│   ├── bert.py          
│   ├── cifargenerator.h5          
│   ├── cifardiscriminator.h5     
│   ├── dcgan.py 
│   ├── image_gen.py  
│   └── requirements.txt          
└── README.md             # Project overview and setup
```

## 💾 Dataset

- **Source**: CIFAR-100 (60,000 images, 100 classes)  
- **Preprocessing**:
  - Resize to 64×64  
  - Normalize to [–1, +1]  
  - Text prompts encoded with pre-trained BERT  
- **Augmentation**:
  - Random flips, rotations, color jitter  


## 🎓 Learning Resources

- **GANs in Action** (book) by Jakub Langr & Vladimir Bok  
- **Original DCGAN paper**: “Unsupervised Representation Learning with Deep Convolutional Generative Adversarial Networks” by Radford et al. (2015)  
- **Text-to-Image Survey**: https://arxiv.org/abs/2008.03187  
- **TensorFlow GAN Tutorial**: https://www.tensorflow.org/tutorials/generative/dcgan
  
## 📬 Contact Us

| 👤 Name                | 📧 Email Address                          |
|-----------------------|------------------------------------------|
| **Venkatesh Someplli**      | [venkateshsomepalli0@gmail.com](mailto:venkateshsomepalli0@gmail.com) |
| **Tumati Manohar** | [manohartumati569@gmail.com](mailto:manohartumati569@gmail.com) |
| **Yetukuri Venkata Kusuma**    | [yvenkatakusuma2005@gmail.com](mailto:yvenkatakusuma2005@gmail.com) |
| **Tupakula Keethi**    | [tkeerthi039@gmail.com](mailto:tkeerthi039@gmail.com) |



