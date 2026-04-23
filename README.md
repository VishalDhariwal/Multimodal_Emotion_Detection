# 🎭 Multimodal Emotion Detection System

A deep learning-based multimodal emotion recognition system that combines **text embeddings (BERT)** and **audio features (MFCC)** to classify emotions from conversational data.

---

## 📌 Overview
This project leverages both textual and acoustic modalities to improve emotion classification performance beyond single-modality approaches.

- **Text Modality:** BERT embeddings (768-dimensional)
- **Audio Modality:** MFCC features extracted from video audio (40-dimensional)
- **Fusion Strategy:** Feature concatenation (Early Fusion)
- **Model:** Fully connected deep neural network (MLP)

---

## 🧠 Architecture
The model processes a combined feature vector of size **808** (768 from BERT + 40 from MFCC).

### Model Structure:
1.  **Input Layer** (808)
2.  **Dense (512)** + Batch Normalization + ReLU
3.  **Dense (512)** + ReLU
4.  **Dense (512)** + Batch Normalization + ReLU
5.  **Dense (512)** + ReLU
6.  **Dense (256)** + Batch Normalization + ReLU
7.  **Dense (128)** + ReLU
8.  **Dense (128)** + Batch Normalization + ReLU
9.  **Dense (128)** + ReLU
10. **Output Layer** (7 classes, Softmax)

---

## ⚙️ Installation
To set up the environment, install the following dependencies:

```bash
pip install numpy pandas tensorflow librosa moviepy transformers torch tqdm
```
📊 Dataset
The system is trained on the MELD (Multimodal EmotionLines Dataset).

Modalities: Text (Utterances) and Audio (Extracted from .mp4 video clips).

Labels: 7 emotion classes (Neutral, Surprise, Fear, Sadness, Joy, Disgust, Anger).

🔊 Audio Feature Extraction
Audio is extracted from video files and processed into 40-dimensional Mel-frequency cepstral coefficients (MFCC):

Python
import librosa
import numpy as np

# Key Steps:
# 1. Extract audio from .mp4 and convert to .wav (16kHz)
# 2. Compute MFCC
mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
# 3. Take mean across time axis
mfcc = np.mean(mfcc.T, axis=0)
📝 Text Embeddings
Using the pre-trained bert-base-uncased model to extract semantic features:

Python
from transformers import BertTokenizer, BertModel

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
# Output embeddings are precomputed and stored as .npy files
🔗 Feature Fusion
We utilize Early Fusion, where features from both modalities are concatenated before being fed into the classifier:

Python
import numpy as np

X_train_combined = np.concatenate([X_train_text, X_train_audio], axis=1)
X_test_combined  = np.concatenate([X_test_text, X_test_audio], axis=1)
🏋️ Training
The model is optimized using the Adam optimizer and sparse categorical cross-entropy.

Python

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Callbacks: EarlyStopping, ReduceLROnPlateau

history = model.fit(
    X_train_combined, y_train,
    validation_data=(X_test_combined, y_test),
    epochs=50,
    batch_size=32
)
📈 Performance

Metric	Value

Training Accuracy	~60%

Validation Accuracy	~51%

Loss Gap	Indicates mild overfitting

🚀 How to Run
Prepare Embeddings: Ensure you have the following .npy files in your directory:

train_bert.npy, train_audio.npy

test_bert.npy, test_audio.npy

Run Training:

Bash

python main.py

Model Saving: The trained model will be saved as aud+text_model.keras.

⚠️ Limitations

Simple Fusion: Feature concatenation does not capture complex cross-modal correlations (no attention mechanism).

Acoustic Detail: Audio features are averaged across time, losing temporal information.

Static Text: BERT embeddings are precomputed; no end-to-end fine-tuning is performed.

🔮 Future Improvements

- Implement Multimodal Transformers for better inter-modal interaction.

- Add Attention-based Fusion layers.

- Fine-tune BERT weights during training.

- Use LSTM/GRU or Transformer encoders for audio sequence modeling.

- Apply Data Augmentation (pitch shifting, noise injection) for audio.

👨‍💻 Author
Vishal Kumar

📜 License
This project is for academic and research purposes.
