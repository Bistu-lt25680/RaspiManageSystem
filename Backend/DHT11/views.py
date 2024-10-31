from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime

# Create your views here.
# backend/sensor/views.py

# 全局变量用于存储传感器数据（仅用于演示）

global sensor_data
sensor_data = {
    "temperature": None,
    "humidity": None,
    "timestamp": None
}

@csrf_exempt
def receive_sensor_data(request):
    global sensor_data
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            temperature = data.get('temperature')
            humidity = data.get('humidity')
            
            if temperature is None or humidity is None:
                error_msg = "错误: 数据不完整"
                print(f"[{current_time}] {error_msg}")
                return JsonResponse({
                    "status": "error",
                    "message": error_msg
                }, status=400)

            # 更新全局变量
            sensor_data = {
                "temperature": round(temperature, 1),
                "humidity": round(humidity, 1),
                "timestamp": current_time
            }

            return JsonResponse({
                "status": "success",
                "data": sensor_data
            })

        except json.JSONDecodeError as e:
            error_msg = f"错误: JSON解析失败 - {str(e)}"
            print(f"[{current_time}] {error_msg}")
            print("-" * 50)
            return JsonResponse({
                "status": "error",
                "message": error_msg
            }, status=400)
            
        except Exception as e:
            error_msg = f"错误: 未知异常 - {str(e)}"
            print(f"[{current_time}] {error_msg}")
            print("-" * 50)
            return JsonResponse({
                "status": "error",
                "message": error_msg
            }, status=500)
    
    error_msg = "错误: 仅支持POST请求"
    print(f"[{current_time}] {error_msg}")
    print("-" * 50)
    return JsonResponse({
        "status": "error",
        "message": error_msg
    }, status=405)


def message_view(request):
    if request.method == 'GET':
        return JsonResponse({'message': 'Hello from Django!'})

def DHT11_view(request):
    if request.method == 'GET':
        # 返回全局变量中的传感器数据，确保保留一位小数
        formatted_data = {
            "temperature": "{:.1f}".format(sensor_data["temperature"]) if sensor_data["temperature"] is not None else None,
            "humidity": "{:.1f}".format(sensor_data["humidity"]) if sensor_data["humidity"] is not None else None,
            "timestamp": sensor_data["timestamp"]
        }
        print(formatted_data)
        return JsonResponse(formatted_data)
