🎭 Multimodal Emotion Detection System
A deep learning-based multimodal emotion recognition system that combines text embeddings (BERT) and audio features (MFCC) to classify emotions from conversational data.
📌 Overview
This project leverages both textual and acoustic modalities to improve emotion classification performance.
Text Modality → BERT embeddings
Audio Modality → MFCC features extracted from video audio
Fusion Strategy → Feature concatenation (early fusion)
Model → Fully connected deep neural network
🧠 Architecture
Input: Combined feature vector (Text + Audio)
Total Feature Size: 808
Text embeddings (BERT)
Audio features (MFCC: 40)
Model Structure
Input (808)
   ↓
Dense (512) + BatchNorm
   ↓
Dense (512, ReLU)
   ↓
Dense (512) + BatchNorm
   ↓
Dense (512, ReLU)
   ↓
Dense (256) + BatchNorm
   ↓
Dense (128, ReLU)
   ↓
Dense (128) + BatchNorm
   ↓
Dense (128, ReLU)
   ↓
Output (7 classes, Softmax)

⚙️ Installation
pip install numpy pandas tensorflow librosa moviepy transformers torch tqdm
📊 Dataset
Dataset used: MELD (Multimodal EmotionLines Dataset)
Modalities:
Text (Utterances)
Audio (Extracted from .mp4 files)
🔊 Audio Feature Extraction
Audio is extracted from video files and converted into MFCC features:
mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
mfcc = np.mean(mfcc.T, axis=0)
Key Steps:
Extract audio from .mp4
Convert to .wav (16kHz)
Compute MFCC
Take mean across time
📝 Text Embeddings
Using BERT (bert-base-uncased):
from transformers import BertTokenizer, BertModel

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')
Output embeddings are precomputed and stored as .npy
🔗 Feature Fusion
X_train_combined = np.concatenate([X_train, train_audio_loaded], axis=1)
X_test_combined  = np.concatenate([X_test, test_audio_loaded], axis=1)
🏋️ Training
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
Callbacks:
EarlyStopping
ReduceLROnPlateau
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
💾 Model Saving
model.save("aud+text_model.keras")
🚀 How to Run
Prepare embeddings:
train_bert.npy
train_audio.npy
test_bert.npy
test_audio.npy
Run training:
python main.py
⚠️ Limitations
Simple feature concatenation (no attention mechanism)
Audio features limited to MFCC (no temporal modeling)
No fine-tuning of BERT
Moderate overfitting observed
🔮 Future Improvements
Use multimodal transformers
Add attention-based fusion
Fine-tune BERT embeddings
Use LSTM/Transformer for audio sequences
Data augmentation for audio
👨‍💻 Author
Vishal Kumar
📜 License
This project is for academic and research purposes.
