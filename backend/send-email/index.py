import json
import os
import urllib.request
import psycopg2
from psycopg2.extras import Json


def send_telegram(text: str) -> bool:
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return False
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    last_error = None
    for attempt in range(2):
        try:
            urllib.request.urlopen(req, timeout=4)
            return True
        except Exception as e:
            last_error = e
    print(f'Telegram send failed: {last_error}')
    return False


def save_lead(lead_type: str, data: dict, telegram_sent: bool):
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO leads (lead_type, data, telegram_sent) VALUES (%s, %s, %s)",
            (lead_type, Json(data), telegram_sent)
        )
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f'Failed to save lead to DB: {e}')


def handler(event: dict, context) -> dict:
    '''Отправка заявок в Telegram и сохранение в базу данных'''

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

    body = json.loads(event.get('body', '{}'))
    email_type = body.get('type')
    data = body.get('data', {})

    if email_type == 'purchase':
        tg_text = (
            "🦷 <b>Заявка на покупку — VAV DENTAL</b>\n\n"
            f"👤 <b>ФИО:</b> {data.get('name')}\n"
            f"🏙 <b>Город:</b> {data.get('city')}\n"
            f"🩺 <b>Специальность:</b> {data.get('specialty')}\n"
            f"📞 <b>Телефон:</b> {data.get('phone')}\n"
            f"💬 <b>Комментарий:</b> {data.get('message', 'Не указан')}"
        )
    elif email_type == 'testdrive':
        tg_text = (
            "🚀 <b>Заявка на тест-драйв — VAV DENTAL</b>\n\n"
            f"👤 <b>ФИО:</b> {data.get('fullName')}\n"
            f"📞 <b>Телефон:</b> {data.get('phone')}\n"
            f"🩺 <b>Специальность:</b> {data.get('specialty')}\n"
            f"🏙 <b>Город:</b> {data.get('city')}"
        )
    elif email_type == 'cart':
        items = data.get('items', [])
        items_tg = '\n'.join([f"  • {item['name']} x{item['quantity']} — {item['price']:,} ₽" for item in items])
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
            'body': json.dumps({'error': 'Unknown type'}),
            'isBase64Encoded': False
        }

    sent = send_telegram(tg_text)
    save_lead(email_type, data, sent)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'telegram_sent': sent}),
        'isBase64Encoded': False
    }
