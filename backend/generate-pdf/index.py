import json
import io
import base64
import os
from typing import Dict, Any
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics


def build_dealer_pdf(config: dict, products_lupes: list, products_lights: list) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=1.5*cm, leftMargin=1.5*cm,
                            topMargin=1.5*cm, bottomMargin=1.5*cm)

    PRIMARY = HexColor('#10b981')
    ACCENT = HexColor('#f59e0b')
    DARK = HexColor('#111827')
    GRAY = HexColor('#6b7280')
    LIGHT_GRAY = HexColor('#f3f4f6')
    WHITE = white

    styles = getSampleStyleSheet()

    s_company = ParagraphStyle('company', fontSize=22, textColor=PRIMARY,
                                fontName='Helvetica-Bold', spaceAfter=2)
    s_title = ParagraphStyle('title', fontSize=14, textColor=DARK,
                              fontName='Helvetica-Bold', spaceAfter=16)
    s_subtitle = ParagraphStyle('subtitle', fontSize=10, textColor=GRAY,
                                 fontName='Helvetica', spaceAfter=6)
    s_section = ParagraphStyle('section', fontSize=12, textColor=PRIMARY,
                                fontName='Helvetica-Bold', spaceBefore=14, spaceAfter=6)
    s_body = ParagraphStyle('body', fontSize=9, textColor=DARK,
                             fontName='Helvetica', spaceAfter=4, leading=14)
    s_small = ParagraphStyle('small', fontSize=8, textColor=GRAY,
                              fontName='Helvetica', spaceAfter=2)
    s_product_name = ParagraphStyle('pname', fontSize=9, textColor=DARK,
                                     fontName='Helvetica-Bold', spaceAfter=2)
    s_price = ParagraphStyle('price', fontSize=10, textColor=PRIMARY,
                              fontName='Helvetica-Bold', spaceAfter=1)
    s_spec = ParagraphStyle('spec', fontSize=8, textColor=GRAY,
                             fontName='Helvetica', spaceAfter=1, leading=12)
    s_footer = ParagraphStyle('footer', fontSize=8, textColor=GRAY,
                               fontName='Helvetica', alignment=TA_CENTER)

    company_name = config.get('company_name', 'VAV DENTAL')
    hero_title = config.get('hero_title', 'Коммерческое предложение для дилеров')
    hero_subtitle = config.get('hero_subtitle', 'Приглашаем региональных партнёров к сотрудничеству')
    company_desc = config.get('company_description', '')
    phone = config.get('phone', '')
    email = config.get('email', '')
    address = config.get('address', '')
    margin_info = config.get('margin_info', 'Маржинальность 25-40%')
    min_order = config.get('min_order', 'Первый заказ от 1 единицы')
    delivery_info = config.get('delivery_info', 'Доставка за 1-3 дня по всей России')

    story = []

    # --- Шапка ---
    header_data = [[
        Paragraph(company_name, s_company),
        Paragraph(f'{phone}  |  {email}', ParagraphStyle('contact', fontSize=8, textColor=GRAY,
                                                           fontName='Helvetica', alignment=TA_RIGHT))
    ]]
    header_table = Table(header_data, colWidths=[10*cm, 7.5*cm])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width='100%', thickness=1.5, color=PRIMARY, spaceAfter=10))

    story.append(Paragraph(hero_title, s_title))
    story.append(Paragraph(hero_subtitle, s_subtitle))
    story.append(Spacer(1, 0.3*cm))

    # --- О компании ---
    story.append(Paragraph('О компании', s_section))
    story.append(Paragraph(company_desc, s_body))

    metrics = [
        ('15+ лет', 'на рынке стоматологической оптики'),
        ('По всей России', 'сервис и доставка'),
        ('5 звёзд', 'средняя оценка от врачей'),
    ]
    m_data = [[
        [Paragraph(v, ParagraphStyle('mv', fontSize=12, textColor=PRIMARY, fontName='Helvetica-Bold', spaceAfter=0)),
         Paragraph(l, s_small)]
        for v, l in metrics
    ]]
    m_table = Table(m_data, colWidths=[5.8*cm, 5.8*cm, 5.9*cm])
    m_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GRAY),
        ('ROUNDEDCORNERS', [4]),
        ('BOX', (0, 0), (0, 0), 0.5, HexColor('#e5e7eb')),
        ('BOX', (1, 0), (1, 0), 0.5, HexColor('#e5e7eb')),
        ('BOX', (2, 0), (2, 0), 0.5, HexColor('#e5e7eb')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(m_table)
    story.append(Spacer(1, 0.4*cm))

    # --- Ключевые условия ---
    story.append(Paragraph('Ключевые условия для дилеров', s_section))
    cond_data = [[
        [Paragraph('Маржинальность', s_small), Paragraph(margin_info, ParagraphStyle('cv', fontSize=10, textColor=DARK, fontName='Helvetica-Bold'))],
        [Paragraph('Минимальный заказ', s_small), Paragraph(min_order, ParagraphStyle('cv', fontSize=10, textColor=DARK, fontName='Helvetica-Bold'))],
        [Paragraph('Доставка', s_small), Paragraph(delivery_info, ParagraphStyle('cv', fontSize=10, textColor=DARK, fontName='Helvetica-Bold'))],
    ]]
    cond_table = Table(cond_data, colWidths=[5.8*cm, 5.8*cm, 5.9*cm])
    cond_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor('#ecfdf5')),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('LINEAFTER', (0, 0), (1, 0), 0.5, HexColor('#d1fae5')),
    ]))
    story.append(cond_table)

    # --- Бинокулярные лупы ---
    story.append(Paragraph('Бинокулярные лупы', s_section))

    lupe_rows = []
    row = []
    for i, p in enumerate(products_lupes):
        cell = [
            Paragraph(p.get('name', ''), s_product_name),
            Paragraph(p.get('price', ''), s_price),
        ]
        if p.get('oldPrice'):
            cell.append(Paragraph(p['oldPrice'], ParagraphStyle('old', fontSize=8, textColor=GRAY,
                                                                  fontName='Helvetica', spaceAfter=2)))
        if p.get('tag'):
            cell.append(Paragraph(f'[{p["tag"]}]', ParagraphStyle('tag', fontSize=7, textColor=PRIMARY,
                                                                     fontName='Helvetica-Bold', spaceAfter=3)))
        for spec in p.get('specs', []):
            cell.append(Paragraph(f'• {spec}', s_spec))
        row.append(cell)
        if len(row) == 2:
            lupe_rows.append(row)
            row = []
    if row:
        row.append('')
        lupe_rows.append(row)

    if lupe_rows:
        lupe_table = Table(lupe_rows, colWidths=[8.75*cm, 8.75*cm])
        lupe_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('BOX', (0, 0), (0, -1), 0.5, HexColor('#e5e7eb')),
            ('BOX', (1, 0), (1, -1), 0.5, HexColor('#e5e7eb')),
            ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GRAY),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [LIGHT_GRAY, WHITE]),
        ]))
        story.append(lupe_table)

    # --- Осветители ---
    story.append(Paragraph('Головные осветители', s_section))

    light_rows = []
    row = []
    for i, p in enumerate(products_lights):
        cell = [
            Paragraph(p.get('name', ''), s_product_name),
            Paragraph(p.get('price', ''), s_price),
        ]
        if p.get('oldPrice'):
            cell.append(Paragraph(p['oldPrice'], ParagraphStyle('old2', fontSize=8, textColor=GRAY,
                                                                  fontName='Helvetica', spaceAfter=2)))
        for spec in p.get('specs', []):
            cell.append(Paragraph(f'• {spec}', s_spec))
        row.append(cell)
        if len(row) == 3:
            light_rows.append(row)
            row = []
    if row:
        while len(row) < 3:
            row.append('')
        light_rows.append(row)

    if light_rows:
        light_table = Table(light_rows, colWidths=[5.8*cm, 5.8*cm, 5.9*cm])
        light_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('BOX', (0, 0), (0, -1), 0.5, HexColor('#e5e7eb')),
            ('BOX', (1, 0), (1, -1), 0.5, HexColor('#e5e7eb')),
            ('BOX', (2, 0), (2, -1), 0.5, HexColor('#e5e7eb')),
            ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GRAY),
        ]))
        story.append(light_table)

    # --- Что получает дилер ---
    story.append(Paragraph('Что получает дилер', s_section))
    benefits = [
        'Дилерские цены с фиксированной скидкой от РРЦ',
        'Приоритетное резервирование товара на складе',
        'Персональный менеджер для работы с партнёрами',
        'Готовые рекламные материалы (офлайн и онлайн)',
        'Гарантийное и постгарантийное обслуживание',
        'Поддержка при участии в тендерах и выставках',
    ]
    ben_data = [[Paragraph(f'✓  {b}', s_body)] for b in benefits]
    ben_table = Table(ben_data, colWidths=[17.5*cm])
    ben_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(ben_table)

    # --- Футер ---
    story.append(Spacer(1, 0.5*cm))
    story.append(HRFlowable(width='100%', thickness=0.5, color=HexColor('#e5e7eb'), spaceAfter=6))
    story.append(Paragraph(
        f'{company_name}  |  {address}  |  {phone}  |  {email}',
        s_footer
    ))

    doc.build(story)
    return buffer.getvalue()


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Генерация PDF: каталог вакансий (type=vacancies) или КП для дилеров (type=dealer).
    POST / с полем type в body.
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
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    body_data = json.loads(event.get('body', '{}'))
    doc_type = body_data.get('type', 'vacancies')

    if doc_type == 'dealer':
        pdf_bytes = build_dealer_pdf(
            config=body_data.get('config', {}),
            products_lupes=body_data.get('products_lupes', []),
            products_lights=body_data.get('products_lights', []),
        )
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'pdf': base64.b64encode(pdf_bytes).decode('utf-8'), 'filename': 'VAV_DENTAL_КП_дилеры.pdf'})
        }

    # --- vacancies (старый режим) ---
    vacancies = body_data.get('vacancies', [])
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24,
                                  textColor='#1a1a1a', spaceAfter=30, alignment=TA_CENTER)
    heading_style = ParagraphStyle('CustomHeading', parent=styles['Heading2'], fontSize=16,
                                    textColor='#2563eb', spaceAfter=12, spaceBefore=20)
    body_style = ParagraphStyle('CustomBody', parent=styles['BodyText'], fontSize=11,
                                 textColor='#4b5563', spaceAfter=8, alignment=TA_LEFT)
    story = []
    story.append(Paragraph("Каталог вакансий", title_style))
    story.append(Spacer(1, 0.5*cm))
    for idx, vacancy in enumerate(vacancies):
        if idx > 0:
            story.append(PageBreak())
        story.append(Paragraph(vacancy.get('title', 'Без названия'), heading_style))
        if vacancy.get('salary'):
            story.append(Paragraph(f"<b>Зарплата:</b> {vacancy['salary']}", body_style))
        if vacancy.get('location'):
            story.append(Paragraph(f"<b>Локация:</b> {vacancy['location']}", body_style))
        if vacancy.get('type'):
            story.append(Paragraph(f"<b>Тип занятости:</b> {vacancy['type']}", body_style))
        story.append(Spacer(1, 0.3*cm))
        if vacancy.get('description'):
            story.append(Paragraph("<b>Описание:</b>", body_style))
            story.append(Paragraph(vacancy['description'], body_style))
        if vacancy.get('requirements'):
            story.append(Spacer(1, 0.2*cm))
            story.append(Paragraph("<b>Требования:</b>", body_style))
            for req in vacancy['requirements']:
                story.append(Paragraph(f"• {req}", body_style))
        if vacancy.get('benefits'):
            story.append(Spacer(1, 0.2*cm))
            story.append(Paragraph("<b>Условия:</b>", body_style))
            for benefit in vacancy['benefits']:
                story.append(Paragraph(f"• {benefit}", body_style))
    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'pdf': base64.b64encode(pdf_bytes).decode('utf-8'), 'filename': 'catalog.pdf'})
    }
