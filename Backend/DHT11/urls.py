# backend/sensor/urls.py (新建文件)
from django.urls import path
from . import views

urlpatterns = [
    path('api/dht11-data/', views.receive_sensor_data, name='receive_sensor_data'),
    path('api/message/', views.message_view, name='message_view'),
    path('api/dht11datas/', views.DHT11_view, name='DHT11_view'),
]
