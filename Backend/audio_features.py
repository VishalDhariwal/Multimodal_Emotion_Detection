import numpy as np
import librosa
from moviepy.editor import VideoFileClip

def extract_mfcc(video_path, n_mfcc=40, sr=16000):
    try:
        video = VideoFileClip(video_path)

        if video.audio is None:
            return np.zeros(n_mfcc)

        audio_array = video.audio.to_soundarray(fps=sr)
        y = np.mean(audio_array, axis=1)

        if len(y) == 0:
            return np.zeros(n_mfcc)

        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
        mfcc = np.mean(mfcc.T, axis=0)

        video.close()
        return mfcc

    except Exception as e:
        print("Audio error:", e)
        return np.zeros(n_mfcc)