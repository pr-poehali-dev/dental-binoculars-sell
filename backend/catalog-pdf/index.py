import json
from typing import Dict, Any
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.enums import TA_LEFT, TA_CENTER
import io
import base64
import requests
from io import BytesIO

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация PDF-каталога с товарами
    Args: event - словарь с httpMethod, body с данными о товарах
          context - объект с атрибутом request_id
    Returns: HTTP-ответ с PDF в base64
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
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
    
    body_data = json.loads(event.get('body', '{}'))
    products = body_data.get('products', [])
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor='#1a1a1a',
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=18,
        textColor='#2563eb',
        spaceAfter=12,
        spaceBefore=20
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        textColor='#4b5563',
        spaceAfter=8,
        alignment=TA_LEFT
    )
    
    price_style = ParagraphStyle(
        'PriceStyle',
        parent=styles['Heading3'],
        fontSize=16,
        textColor='#16a34a',
        spaceAfter=8,
        alignment=TA_LEFT
    )
    
    story = []
    
    story.append(Paragraph("Каталог продуктов", title_style))
    story.append(Paragraph("VAV DENTAL — Профессиональное стоматологическое оборудование", body_style))
    story.append(Spacer(1, 0.5*cm))
    
    for idx, product in enumerate(products):
        if idx > 0:
            story.append(PageBreak())
        
        story.append(Paragraph(product.get('name', 'Без названия'), heading_style))
        
        if product.get('image'):
            try:
                response = requests.get(product['image'], timeout=5)
                if response.status_code == 200:
                    img_data = BytesIO(response.content)
                    img = Image(img_data, width=10*cm, height=10*cm)
                    story.append(img)
                    story.append(Spacer(1, 0.5*cm))
            except:
                pass
        
        if product.get('description'):
            story.append(Paragraph(product['description'], body_style))
            story.append(Spacer(1, 0.3*cm))
        
        if product.get('magnification') and product['magnification'] != 'N/A':
            story.append(Paragraph(f"<b>Увеличение:</b> {product['magnification']}", body_style))
        
        if product.get('price'):
            story.append(Paragraph(f"<b>Цена:</b> {product['price']:,} ₽".replace(',', ' '), price_style))
        
        story.append(Spacer(1, 0.5*cm))
        story.append(Paragraph("<b>Контакты для заказа:</b>", body_style))
        story.append(Paragraph("Телефон: +7 (495) 123-45-67", body_style))
        story.append(Paragraph("Email: info@dentaloptics.ru", body_style))
    
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'pdf': pdf_base64,
            'filename': 'catalog.pdf'
        })
    }
