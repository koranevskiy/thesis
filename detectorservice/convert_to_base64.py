import base64
import pyperclip

# Прочитайте изображение и закодируйте его в base64
with open("bus.jpg", "rb") as image_file:
    base64_string = base64.b64encode(image_file.read()).decode('utf-8')

# Сохраните строку base64 в буфер обмена
pyperclip.copy(base64_string)
print("Base64-кодированное изображение скопировано в буфер обмена.")
