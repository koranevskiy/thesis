# import pyperclip
import base64
import io
import uuid
from flask import Flask, request, jsonify
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import torch
from ultralytics import YOLO

app = Flask(__name__)
model = YOLO('yolov8n.pt')  # Замените на путь к вашей модели YOLOv8

def draw_boxes_and_labels(image, detections):
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(20)  # Измените путь к шрифту и размер по вашему усмотрению

    for detection in detections:
        box = detection['box']
        label = f"ID: {detection['id']} - {detection['label']} ({detection['confidence']:.2f})"
        draw.rectangle(box, outline="red", width=2)
        draw.text((box[0], box[1] - 30), label, fill="black", font=font, stroke_width=1)  #  выше надписи

    return image

@app.route('/process-image', methods=['POST'])
def process_image():
    data = request.get_json()
    image_base64 = data['image']
    image_uuid = data['uuid']

    # Удаляем префикс 'data:image/jpeg;base64,' если он есть
    if image_base64.startswith('data:image/jpeg;base64,'):
        image_base64 = image_base64.replace('data:image/jpeg;base64,', '')

    # Декодируем изображение из base64
    image_data = base64.b64decode(image_base64)
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    np_image = np.array(image)

    # Выполняем детекцию объектов с помощью YOLOv8
    results = model(np_image)
    detections = []

    object_id = 1  # Начальное значение для числовых ID

    for result in results:
        for box in result.boxes:
            xmin, ymin, xmax, ymax = box.xyxy[0].cpu().numpy().tolist()
            label = result.names[int(box.cls)]
            confidence = float(box.conf[0].cpu().numpy())  # Коэффициент уверенности
            detections.append({
                'id': object_id,
                'box': [xmin, ymin, xmax, ymax],
                'label': label,
                'confidence': confidence
            })
            object_id += 1  # Увеличиваем ID для следующего объекта

    # Наносим квадраты и метки на изображение
    annotated_image = draw_boxes_and_labels(image, detections)

    # Генерируем текст о событиях на изображении
    events = [f"{det['label']} (ID: {det['id']})" for det in detections]
    event_text = "Detected objects: " + ", ".join(events)

    # Кодируем обработанное изображение в base64
    buffered = io.BytesIO()
    annotated_image.save(buffered, format="JPEG")
    annotated_image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    # pyperclip.copy('data:image/jpeg;base64,' + annotated_image_base64)
    for detection in detections:
        detection.pop('box', None)
    response = {
        'uuid': image_uuid,
        'annotated_image': annotated_image_base64,
        'event_text': event_text,
        'detections': detections  # Возвращаем детекции с ID и confidence
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)






