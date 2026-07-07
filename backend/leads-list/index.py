import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    '''Возвращает список заявок (покупка, тест-драйв, заказ) из базы данных'''

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(
        "SELECT id, lead_type, data, telegram_sent, created_at::text "
        "FROM leads ORDER BY created_at DESC LIMIT 200"
    )
    rows = cur.fetchall()

    cur.close()
    conn.close()

    leads = [dict(row) for row in rows]

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'leads': leads}, default=str),
        'isBase64Encoded': False
    }
