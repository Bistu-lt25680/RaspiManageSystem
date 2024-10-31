import time
import requests
import random  # 添加随机数，模拟真实数据波动

try:
    while True:
        try:
            # 模拟真实的温湿度数据（添加随机波动）
            temperature_c = 27 + random.uniform(-1, 1)  # 26-28度之间波动
            temperature_f = temperature_c * (9 / 5) + 32
            humidity = 35 + random.uniform(-2, 2)  # 33-37之间波动
            
            print(
                "Temp: {:.1f} F / {:.1f} C    Humidity: {:.1f}% ".format(
                    temperature_f, temperature_c, humidity))
            
            data = {
                "temperature": round(temperature_c, 1),  # 保留一位小数
                "humidity": round(humidity, 1)
            }
            
            response = requests.post("http://127.0.0.1:8000/api/dht11-data/", json=data)
            
        except requests.exceptions.RequestException as e:
            print("发送数据失败:", str(e))
            
        time.sleep(2.0)  # 和树莓派代码保持一致的间隔

except KeyboardInterrupt:
    print("\n程序已停止")