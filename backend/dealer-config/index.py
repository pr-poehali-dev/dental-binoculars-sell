"""
Получение и обновление конфигурации коммерческого предложения для дилеров.
GET  — получить все настройки
POST — обновить настройки (требует admin_password)
"""

import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 't_p27497026_dental_binoculars_se')
    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f'SELECT key, value FROM {schema}.dealer_config ORDER BY id')
        rows = cur.fetchall()
        conn.close()

        config = {row[0]: row[1] for row in rows}
        return {
            'statusCode': 200,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps(config, ensure_ascii=False)
        }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        password = body.get('admin_password', '')

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT value FROM {schema}.dealer_config WHERE key = 'admin_password'")
        row = cur.fetchone()
        stored_password = row[0] if row else ''

        if password != stored_password:
            conn.close()
            return {
                'statusCode': 403,
                'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Неверный пароль'})
            }

        skip_keys = {'admin_password'}
        updated = []
        for key, value in body.items():
            if key in skip_keys:
                continue
            cur.execute(
                f"INSERT INTO {schema}.dealer_config (key, value, updated_at) VALUES (%s, %s, NOW()) "
                f"ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
                (key, str(value))
            )
            updated.append(key)

        conn.commit()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'updated': updated}, ensure_ascii=False)
        }

    return {'statusCode': 405, 'headers': CORS_HEADERS, 'body': 'Method not allowed'}