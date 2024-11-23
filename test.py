import time
import requests
import random  # 添加随机数，模拟真实数据波动

server_url = "http://101.43.131.207:8000/api/dht11-data/"
test_url = "http://localhost:3000/api/dht11datas/"

while True:
    try:
        # 模拟真实的温湿度数据（添加随机波动）
        temperature_c = 27 + random.uniform(-1, 1)  # 26-28度之间波动
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = 35 + random.uniform(-2, 2)  # 33-37之间波动
        
        print(
            "Temp: {:.1f} F / {:.1f} C    Humidity: {:.1f}% ".format(
                temperature_f, temperature_c, humidity))
        
        # 使用 format 强制保留一位小数
        data = {
            "temperature": float("{:.1f}".format(temperature_c)),
            "humidity": float("{:.1f}".format(humidity))
        }
        
        # response = requests.post(server_url, json=data)
        response = requests.post(test_url, json=data)
        
    except requests.exceptions.RequestException as e:
        print("发送数据失败:", str(e))
        
    time.sleep(2.0)  # 和树莓派代码保持一致的间隔
