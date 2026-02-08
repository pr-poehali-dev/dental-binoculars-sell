import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def handler(event: dict, context) -> dict:
    '''Отправка заявок на почту vavdental@yandex.ru'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        email_type = body.get('type')  # 'purchase', 'testdrive', 'cart'
        data = body.get('data', {})
        
        # Формируем тему и содержание письма в зависимости от типа заявки
        if email_type == 'purchase':
            subject = 'Новая заявка на покупку с сайта VAV DENTAL'
            message = f"""
            <h2>Заявка на покупку</h2>
            <p><strong>ФИО:</strong> {data.get('name')}</p>
            <p><strong>Город:</strong> {data.get('city')}</p>
            <p><strong>Специальность:</strong> {data.get('specialty')}</p>
            <p><strong>Телефон:</strong> {data.get('phone')}</p>
            <p><strong>Комментарий:</strong> {data.get('message', 'Не указан')}</p>
            """
        elif email_type == 'testdrive':
            subject = 'Новая заявка на тест-драйв с сайта VAV DENTAL'
            message = f"""
            <h2>Заявка на тест-драйв</h2>
            <p><strong>ФИО:</strong> {data.get('fullName')}</p>
            <p><strong>Телефон:</strong> {data.get('phone')}</p>
            <p><strong>Специальность:</strong> {data.get('specialty')}</p>
            <p><strong>Город:</strong> {data.get('city')}</p>
            """
        elif email_type == 'cart':
            subject = 'Новый заказ с сайта VAV DENTAL'
            items = data.get('items', [])
            items_html = '<br>'.join([f"{item['name']} x{item['quantity']} - {item['price']:,} ₽" for item in items])
            message = f"""
            <h2>Оформлен заказ</h2>
            <p><strong>Имя:</strong> {data.get('name')}</p>
            <p><strong>Телефон:</strong> {data.get('phone')}</p>
            <p><strong>Email:</strong> {data.get('email', 'Не указан')}</p>
            <p><strong>Комментарий:</strong> {data.get('comment', 'Нет')}</p>
            <h3>Состав заказа:</h3>
            <p>{items_html}</p>
            <p><strong>Итого:</strong> {data.get('total', 0):,} ₽</p>
            """
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Unknown email type'}),
                'isBase64Encoded': False
            }
        

        sender_email = os.environ.get('YANDEX_EMAIL')
        sender_password = os.environ.get('YANDEX_PASSWORD')
        
        if not sender_email or not sender_password:
            raise Exception('YANDEX_EMAIL or YANDEX_PASSWORD not configured')
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = sender_email
        msg['To'] = 'vavdental@yandex.ru'
        
        html_part = MIMEText(message, 'html', 'utf-8')
        msg.attach(html_part)
        
        server = smtplib.SMTP('smtp.yandex.ru', 587, timeout=10)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Email sent successfully'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }