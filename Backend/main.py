from fastapi import FastAPI, UploadFile, File, Form
import numpy as np
import joblib
import json
import shutil
import os
import torch

from tensorflow.keras.models import load_model
from transformers import BertTokenizer, BertModel

from Backend.audio_features import extract_mfcc

app = FastAPI()

# ---------------- LOAD MODELS ----------------

MODEL_PATH = "Backend/models/final_model.keras"
ENCODER_PATH = "Backend/models/label_encoder-2.pkl"
CONFIG_PATH = "Backend/models/audio_config.json"

# Keras model
model = load_model(MODEL_PATH)

# Label encoder
label_encoder = joblib.load(ENCODER_PATH)

# Audio config
with open(CONFIG_PATH, "r") as f:
    audio_config = json.load(f)

# BERT (from HuggingFace)
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertModel.from_pretrained("bert-base-uncased")
bert_model.eval()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
bert_model.to(device)

# ---------------- BERT EMBEDDING ----------------

def get_bert_embedding(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    ).to(device)

    with torch.no_grad():
        outputs = bert_model(**inputs)

    return outputs.last_hidden_state[:, 0, :].cpu().numpy().squeeze()


# ---------------- API ----------------

@app.post("/predict")
async def predict(file: UploadFile = File(...), text: str = Form(...)):

    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # AUDIO
        audio_feat = extract_mfcc(
            temp_path,
            n_mfcc=audio_config["n_mfcc"],
            sr=audio_config["sr"]
        )

        # TEXT
        text_feat = get_bert_embedding(text)

        # COMBINE
        features = np.concatenate([text_feat, audio_feat]).reshape(1, -1)

        # PREDICT
        pred = model.predict(features)
        label = label_encoder.inverse_transform([np.argmax(pred)])[0]

        return {
            "prediction": label
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)