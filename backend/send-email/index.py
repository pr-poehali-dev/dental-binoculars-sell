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
    try:
        urllib.request.urlopen(req, timeout=3)
        return True
    except Exception as e:
        print(f'Telegram send failed: {e}')
        return False


def save_lead(lead_type: str, data: dict) -> int:
    conn = psycopg2.connect(os.environ['DATABASE_URL'], connect_timeout=5)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO leads (lead_type, data, telegram_sent) VALUES (%s, %s, FALSE) RETURNING id",
        (lead_type, Json(data))
    )
    lead_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return lead_id


def mark_telegram_sent(lead_id: int):
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'], connect_timeout=5)
        cur = conn.cursor()
        cur.execute("UPDATE leads SET telegram_sent = TRUE WHERE id = %s", (lead_id,))
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f'Failed to update telegram_sent flag: {e}')


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

    raw_body = event.get('body', '{}')
    try:
        body = json.loads(raw_body)
    except Exception:
        body = {}

    email_type = body.get('type') if isinstance(body, dict) else None
    data = body.get('data', {}) if isinstance(body, dict) else {}
    if not isinstance(data, dict):
        data = {'raw': data}

    if email_type not in ('purchase', 'testdrive', 'cart'):
        email_type = email_type or 'unknown'
        try:
            save_lead(email_type, data if data else {'raw_body': raw_body})
        except Exception as e:
            print(f'Failed to save unknown-type lead to DB: {e}')
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unknown type'}),
            'isBase64Encoded': False
        }

    lead_id = None
    try:
        lead_id = save_lead(email_type, data)
    except Exception as e:
        print(f'Failed to save lead to DB: {e}')

    try:
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
        else:
            items = data.get('items', [])
            items_tg = '\n'.join(
                f"  • {item.get('name')} x{item.get('quantity')} — {item.get('price')} ₽"
                for item in items if isinstance(item, dict)
            )
            tg_text = (
                "🛒 <b>Новый заказ — VAV DENTAL</b>\n\n"
                f"👤 <b>Имя:</b> {data.get('name')}\n"
                f"📞 <b>Телефон:</b> {data.get('phone')}\n"
                f"📧 <b>Email:</b> {data.get('email', 'Не указан')}\n"
                f"💬 <b>Комментарий:</b> {data.get('comment', 'Нет')}\n\n"
                f"📦 <b>Состав заказа:</b>\n{items_tg}\n\n"
                f"💰 <b>Итого: {data.get('total', 0)} ₽</b>"
            )
    except Exception as e:
        print(f'Failed to build telegram text: {e}')
        tg_text = f"⚠️ Новая заявка ({email_type}), не удалось отформатировать текст. ID: {lead_id}"

    sent = send_telegram(tg_text)
    if sent and lead_id is not None:
        mark_telegram_sent(lead_id)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'success': True, 'telegram_sent': sent, 'saved': lead_id is not None}),
        'isBase64Encoded': False
    }