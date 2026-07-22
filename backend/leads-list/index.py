import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def handler(event: dict, context) -> dict:
    '''Возвращает список заявок (GET) или архивирует заявку по id (DELETE — мягкое удаление, данные не стираются)'''

    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    if method == 'DELETE':
        params = event.get('queryStringParameters') or {}
        lead_id = params.get('id')

        if not lead_id or not str(lead_id).isdigit():
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing or invalid id'}),
                'isBase64Encoded': False
            }

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("UPDATE leads SET archived = TRUE WHERE id = %s", (int(lead_id),))
        archived = cur.rowcount
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'archived': archived}),
            'isBase64Encoded': False
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)

    cur.execute(
        "SELECT id, lead_type, data, telegram_sent, created_at::text "
        "FROM leads WHERE archived = FALSE ORDER BY created_at DESC LIMIT 200"
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