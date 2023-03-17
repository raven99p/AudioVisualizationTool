from flask import Flask, request, jsonify, Blueprint, Response
from flask import current_app as app
from flask_cors import CORS, cross_origin
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import io
import os

api = Blueprint('api', __name__)

@api.route("/mel_spectrogram", methods=["POST"])
def melspectrogram():
    
    try:
        data = request.get_json()
        print(data)
    except Exception as e:
        print('Data not in json form')
        return jsonify({"error": str(e)}), 400
    
    try:
        
        audio_directory = data["audio_path"]
        audio = data["audio"]
        path = os.path.join(audio_directory, audio)
        y, sr = librosa.load(path)
        S = librosa.feature.melspectrogram(y=y, 
                                        sr=sr, 
                                        n_fft=data["n_fft"], 
                                        hop_length=data["hop_length"],
                                        win_length=data["win_length"],
                                        window=data["window"],
                                        center=data["center"],
                                        pad_mode=data["pad_mode"],
                                        power=data["power"]
                                        )
        fig, ax = plt.subplots()
        S_dB = librosa.power_to_db(S, ref=np.max)
        img = librosa.display.specshow(S_dB, x_axis='time',
                                y_axis='mel', sr=sr,
                                fmax=8000, ax=ax)
        fig.colorbar(img, ax=ax, format='%+2.0f dB')

        ax.set(title='Mel-frequency spectrogram')
        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        return Response(output.getvalue(), mimetype='image/png'), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@api.route("/available_audio", methods=["POST"])
def get_available_audio():
    
    try:
        data = request.get_json()
        print(data)
    except Exception as e:
        print('Data not in json form')
        return jsonify({"error": str(e)}), 400
    
    try:
        available_files = os.listdir(data["audio_path"])
        return jsonify(available_files), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400