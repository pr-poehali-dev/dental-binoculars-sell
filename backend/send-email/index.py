import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import urllib.request

def send_telegram(text: str):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    urllib.request.urlopen(req, timeout=10)

def handler(event: dict, context) -> dict:
    '''Отправка заявок на почту vavdental@yandex.ru и в Telegram'''
    
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
            tg_text = (
                "🦷 <b>Заявка на покупку — VAV DENTAL</b>\n\n"
                f"👤 <b>ФИО:</b> {data.get('name')}\n"
                f"🏙 <b>Город:</b> {data.get('city')}\n"
                f"🩺 <b>Специальность:</b> {data.get('specialty')}\n"
                f"📞 <b>Телефон:</b> {data.get('phone')}\n"
                f"💬 <b>Комментарий:</b> {data.get('message', 'Не указан')}"
            )
        elif email_type == 'testdrive':
            subject = 'Новая заявка на тест-драйв с сайта VAV DENTAL'
            message = f"""
            <h2>Заявка на тест-драйв</h2>
            <p><strong>ФИО:</strong> {data.get('fullName')}</p>
            <p><strong>Телефон:</strong> {data.get('phone')}</p>
            <p><strong>Специальность:</strong> {data.get('specialty')}</p>
            <p><strong>Город:</strong> {data.get('city')}</p>
            """
            tg_text = (
                "🚀 <b>Заявка на тест-драйв — VAV DENTAL</b>\n\n"
                f"👤 <b>ФИО:</b> {data.get('fullName')}\n"
                f"📞 <b>Телефон:</b> {data.get('phone')}\n"
                f"🩺 <b>Специальность:</b> {data.get('specialty')}\n"
                f"🏙 <b>Город:</b> {data.get('city')}"
            )
        elif email_type == 'cart':
            subject = 'Новый заказ с сайта VAV DENTAL'
            items = data.get('items', [])
            items_html = '<br>'.join([f"{item['name']} x{item['quantity']} - {item['price']:,} ₽" for item in items])
            items_tg = '\n'.join([f"  • {item['name']} x{item['quantity']} — {item['price']:,} ₽" for item in items])
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
            tg_text = (
                "🛒 <b>Новый заказ — VAV DENTAL</b>\n\n"
                f"👤 <b>Имя:</b> {data.get('name')}\n"
                f"📞 <b>Телефон:</b> {data.get('phone')}\n"
                f"📧 <b>Email:</b> {data.get('email', 'Не указан')}\n"
                f"💬 <b>Комментарий:</b> {data.get('comment', 'Нет')}\n\n"
                f"📦 <b>Состав заказа:</b>\n{items_tg}\n\n"
                f"💰 <b>Итого: {data.get('total', 0):,} ₽</b>"
            )
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
        
        send_telegram(tg_text)

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
            'body': json.dumps({'success': True, 'message': 'Sent successfully'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        import traceback
        print(f"ERROR: {str(e)}")
        print(traceback.format_exc())
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
