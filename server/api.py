from flask import request, jsonify, Blueprint, Response
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import io
import os
from scipy import signal
import wave
import struct

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


@api.route("/butterworth", methods=["POST"])
def butterworth():
    """Pass selected audio through a butterworth filter and return the
       filtered audio.

    Returns:
        array: Filtered Audio
    """
    print("BUTTERWORTH")
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

        sos = signal.butter(
            N=data["order"],
            Wn=data["cutoff_freq"],
            btype=data["type"],
            output=data["output"],
            fs=data["fs"] if data["fs"] is not None else sr
        )

        filtered_signal = signal.sosfilt(sos, y)

        fig, axs = plt.subplots(2, 1)

        librosa.display.waveshow(y, sr=sr, ax=axs[0])
        axs[0].set(title="Initial Signal")
        axs[0].label_outer()

        librosa.display.waveshow(filtered_signal, sr=sr, ax=axs[1])
        axs[1].set(title="Filtered Signal")
        axs[1].label_outer()

        output = io.BytesIO()
        FigureCanvas(fig).print_png(output)
        return Response(output.getvalue(), mimetype='image/png'), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@api.route("/butterworth_audio", methods=["POST"])
def butterworth_audio():
    """Pass selected audio through a butterworth filter and return the
       filtered audio.

    Returns:
        array: Filtered Audio
    """
    print("BUTTERWORTH")
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

        sos = signal.butter(
            N=data["order"],
            Wn=data["cutoff_freq"],
            btype=data["type"],
            output=data["output"],
            fs=data["fs"] if data["fs"] is not None else sr
        )

        filtered_signal = signal.sosfilt(sos, y)

        audio_bytes = io.BytesIO()
        with wave.open(audio_bytes, 'wb') as audio_file:
            audio_file.setnchannels(1)
            audio_file.setsampwidth(2)
            audio_file.setframerate(sr)
            for sample in filtered_signal:
                sample_int = int(sample * 32767)
                packed_sample = struct.pack('<h', sample_int)
                audio_file.writeframes(packed_sample)

        audio_bytes.seek(0)

        return Response(audio_bytes, mimetype="audio/wav"), 200

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
