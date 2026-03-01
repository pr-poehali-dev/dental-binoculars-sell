import os
import hashlib
import psycopg2


def handler(event: dict, context) -> dict:
    """Записывает уникальный визит по IP (один раз в сутки)"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
    ip_hash = hashlib.sha256(ip.encode()).hexdigest()

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO visits (ip_hash, date) VALUES (%s, CURRENT_DATE) ON CONFLICT (ip_hash, date) DO NOTHING",
        (ip_hash,)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': {'ok': True}
    }