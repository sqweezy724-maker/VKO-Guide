#!/usr/bin/env python3
# -*- coding: utf-8 -*-

places_data = [
    {
        "id": 2,
        "name": "Рахмановские Ключи",
        "emoji": "♨️",
        "region": "Катон-Карагайский район",
        "rating": 4.9,
        "lat": 49.5117,
        "lng": 86.0017,
        "image": "https://lh3.googleusercontent.com/place-photos/AL8-SNFvc2i4uYGNkMkEJr0s6OIxbkfb_QlIG-_2qCRbsxA-H9W9zFoGBgB6iT4quKpr_ZURet9zhpimXSEry4T3_eBVgeedsLhQZw6vWE50mj-LIOXPCVBcxaZMk1ZIqhgWw_b-yt6pQnSa4zYIICE=s800-w800-h600",
        "description": "Термальные источники на высоте 1770 м. Лечебные радоновые воды среди кедровой тайги.",
        "info": "Температура воды +37–42°C. Содержит радон, который благотворно влияет на нервную и сердечно-сосудистую систему. Работает санаторий.",
        "ecology": "Термальные воды — уникальная геотермальная система, сложившаяся миллионы лет назад. Важно сохранять чистоту источников.",
        "pros": ["Лечебные воды", "Горный воздух на 1770 м", "Уникальная природа Алтая", "Близость к нацпарку"],
        "ecoTip": "Используйте биоразлагаемые средства гигиены рядом с источниками — химия загрязняет уникальную экосистему.",
        "contacts": {
            "phone": "+7 (72336) 9-91-23",
            "email": "rakhmanovsky@sanatorium.kz",
            "website": "http://rakhmanovsky.kz",
            "address": "ВКО, Катон-Карагайский район, урочище Рахмановские Ключи",
            "workingHours": "Круглосуточно (санаторий)",
            "ticketPrice": "От 15 000 ₸ за сутки с лечением"
        }
    },
    {
        "id": 3,
        "name": "Стрелка — слияние рек",
        "emoji": "🌊",
        "region": "Усть-Каменогорск",
        "rating": 4.8,
        "lat": 49.9485,
        "lng": 82.5869,
        "image": "https://lh3.googleusercontent.com/place-photos/AL8-SNEwKfgjMP5hZq5N781rCP0QzgIFBUrv-6yti-fBZSVA1jGBd4VdF7c2eyPCKScIsQirHTTN4wdl_qpCc1cvPw74YX5QRDUgya37BV5PD86LqH8lI-dxcCZ_SYVk0Lm1jjoZ5m_8azk9umNv=s800-w800-h600",
        "description": "Живописное слияние рек Иртыш и Ульба. Вечный огонь и рябиновые аллеи.",
        "info": "Историческое место — именно здесь в 1720 году была основана Усть-Каменная крепость. Рябиновая аллея тянется на 500 метров вдоль берега.",
        "ecology": "Слияние двух рек — важная экологическая зона. Здесь гнездятся перелётные птицы. Иртыш требует особой охраны от промышленных стоков.",
        "pros": ["Историческое место", "Красивый вид на реки", "Близость к центру города", "Зелёные аллеи"],
        "ecoTip": "Не бросайте мусор в реку — Иртыш несёт воду миллионам людей вниз по течению.",
        "contacts": {
            "phone": "+7 (7232) 26-42-68 (справочная УКО)",
            "address": "г. Усть-Каменогорск, наб. Славского",
            "workingHours": "Открыто круглосуточно",
            "ticketPrice": "Бесплатно"
        }
    },
    {
        "id": 4,
        "name": "Этнопарк",
        "emoji": "🌿",
        "region": "Усть-Каменогорск",
        "rating": 4.7,
        "lat": 49.9352,
        "lng": 82.6110,
        "image": "https://lh3.googleusercontent.com/places/ANXAkqGXBHsYK5ysMbUG4uIJwc1Bip1w_0mK0Pt_y6PBYcYL_x-ZgyUyW8TaBZemw4PPQzj38iH_CVSU1fmZ8pmpu4sFmrfBrOuJ55Y=s800-w800-h600",
        "description": "Природно-этнический комплекс с ботаническим садом и традиционными домами народов ВКО.",
        "info": "На территории парка представлены традиционные жилища казахов, русских и других народов региона. Ботанический сад включает более 500 видов растений.",
        "ecology": "Этнопарк сохраняет редкие местные виды растений и поддерживает традиции бережного отношения к природе коренных народов.",
        "pros": ["Культурное наследие", "Редкие растения", "Образовательная ценность", "Прогулочные маршруты"],
        "ecoTip": "Поддерживайте местных производителей — покупка сувениров у местных мастеров помогает сохранить традиции и снижает углеродный след.",
        "contacts": {
            "phone": "+7 (7232) 75-46-17",
            "email": "ethnopark.ust@mail.ru",
            "address": "г. Усть-Каменогорск, ул. Казахстан, 38",
            "workingHours": "Вт-Вс: 10:00 - 19:00, Пн: выходной",
            "ticketPrice": "Взрослые: 400 ₸, Студенты: 200 ₸"
        }
    },
    {
        "id": 5,
        "name": "Парк Жамбыла",
        "emoji": "🌳",
        "region": "Усть-Каменогорск",
        "rating": 4.5,
        "lat": 49.9507,
        "lng": 82.6260,
        "image": "https://lh3.googleusercontent.com/places/ANXAkqEA_SEnzJfowN7RAxbtot6QY56SXSRP0N5-X5g187lc46xYDuGHXmOCE47B4mdYZAH_sBpfxbQN2lCGIqhZCroK8uy5jv_cYrc=s800-w800-h600",
        "description": "Уютный городской парк в центре города. Зелёные аллеи и летние кафе.",
        "info": "Назван в честь великого казахского акына Жамбыла Жабаева. Площадь 12 га. Любимое место отдыха горожан всех возрастов.",
        "ecology": "Городские деревья парка ежегодно поглощают около 300 тонн CO₂ и производят кислород для тысяч жителей города.",
        "pros": ["В центре города", "Чистый воздух", "Доступность", "Место для пикника"],
        "ecoTip": "Приходите пешком или на велосипеде — парк в пешей доступности от большинства районов города.",
        "contacts": {
            "phone": "+7 (7232) 26-42-68",
            "address": "г. Усть-Каменогорск, ул. Жамбыла",
            "workingHours": "Открыто круглосуточно",
            "ticketPrice": "Бесплатно"
        }
    },
    {
        "id": 6,
        "name": "Западно-Алтайский заповедник",
        "emoji": "🦅",
        "region": "ВКО, Казахстан",
        "rating": 4.8,
        "lat": 49.5500,
        "lng": 83.9500,
        "image": "https://lh3.googleusercontent.com/place-photos/AL8-SNGOwmRTqNdXBotCSUvhn4wEjbnC4j7I_E3d9EpKzxOTSF6NlcpbTApRVk9-D80yXS9mjec3ePXJpXlCmZrFSdt1SOhVE2XPniRRksO9yaelJNt0fwjfeONUMoBgq3T5WDXpveU1jHHLIdicGg=s800-w800-h600",
        "description": "Девственный горный заповедник. Снежные барсы, орлы и 700+ видов растений.",
        "info": "Площадь 56 078 га. Основан в 1992 году. Здесь обитают снежный барс, горный козёл, беркут. Включён в список Всемирного наследия ЮНЕСКО.",
        "ecology": "Один из немногих мест на Земле, где сохранилась нетронутая природа Алтая. Каждый снежный барс здесь — бесценен для генофонда вида.",
        "pros": ["Нетронутая природа", "Редкие хищники", "Статус ЮНЕСКО", "Чистейший воздух"],
        "ecoTip": "В заповеднике строго запрещён сбор растений и охота. Фотоохота — лучшая альтернатива.",
        "contacts": {
            "phone": "+7 (72336) 2-16-84",
            "email": "zapaltai@mail.ru",
            "website": "http://zapaltai.kz",
            "address": "ВКО, Риддерский район, с. Акжар",
            "workingHours": "По согласованию с администрацией",
            "ticketPrice": "Экскурсии от 3000 ₸ с гидом"
        }
    }
]

html_template = '''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} | ВКО Гид</title>
    <meta name="description" content="{description}">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}
        .hero {{
            position: relative;
            height: 400px;
            background: url('{image}') center/cover;
        }}
        .hero::after {{
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }}
        .hero-content {{
            position: absolute;
            bottom: 30px;
            left: 30px;
            right: 30px;
            z-index: 1;
            color: white;
        }}
        .emoji {{ font-size: 48px; margin-bottom: 10px; }}
        h1 {{
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 8px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }}
        .region {{ font-size: 16px; opacity: 0.9; }}
        .rating {{
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(0,0,0,0.4);
            padding: 6px 12px;
            border-radius: 20px;
            margin-top: 10px;
            backdrop-filter: blur(10px);
        }}
        .content {{ padding: 40px 30px; }}
        .section {{ margin-bottom: 35px; }}
        .section-title {{
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #16a34a;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        .section-title::before {{
            content: '';
            width: 4px;
            height: 24px;
            background: #16a34a;
            border-radius: 2px;
        }}
        .description {{
            font-size: 16px;
            color: #4b5563;
            line-height: 1.8;
        }}
        .info-card {{
            background: #f3f4f6;
            padding: 20px;
            border-radius: 16px;
            border-left: 4px solid #16a34a;
            margin-bottom: 15px;
        }}
        .info-card h3 {{
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #16a34a;
        }}
        .contact-item {{
            display: flex;
            align-items: start;
            gap: 12px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 12px;
            margin-bottom: 12px;
            transition: all 0.2s;
        }}
        .contact-item:hover {{
            background: #f3f4f6;
            transform: translateX(5px);
        }}
        .contact-icon {{ font-size: 20px; }}
        .contact-label {{
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            margin-bottom: 4px;
        }}
        .contact-value {{
            font-size: 16px;
            color: #1f2937;
            font-weight: 500;
        }}
        .contact-value a {{
            color: #16a34a;
            text-decoration: none;
        }}
        .contact-value a:hover {{ text-decoration: underline; }}
        .pros {{
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }}
        .pro-tag {{
            background: linear-gradient(135deg, #16a34a, #15803d);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }}
        .eco-tip {{
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 20px;
            border-radius: 16px;
            border: 2px solid #fbbf24;
        }}
        .eco-tip::before {{
            content: '💡';
            font-size: 24px;
            margin-right: 10px;
        }}
        .map-container {{
            margin-top: 30px;
            border-radius: 16px;
            overflow: hidden;
            height: 300px;
            border: 2px solid #e5e7eb;
        }}
        .back-button {{
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #16a34a;
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.2s;
            margin-bottom: 20px;
        }}
        .back-button:hover {{
            background: #15803d;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }}
        @media (max-width: 768px) {{
            .hero {{ height: 300px; }}
            h1 {{ font-size: 28px; }}
            .content {{ padding: 30px 20px; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <div class="hero-content">
                <div class="emoji">{emoji}</div>
                <h1>{name}</h1>
                <div class="region">📍 {region}</div>
                <div class="rating">⭐ {rating}</div>
            </div>
        </div>
        
        <div class="content">
            <a href="../index.html" class="back-button">← Назад к карте</a>
            
            <div class="section">
                <div class="section-title">О месте</div>
                <p class="description">{description}</p>
            </div>
            
            <div class="section">
                <div class="section-title">Информация</div>
                <div class="info-card">
                    <h3>📋 Подробности</h3>
                    <p>{info}</p>
                </div>
                <div class="info-card">
                    <h3>🌱 Экология</h3>
                    <p>{ecology}</p>
                </div>
            </div>
            
            {contacts_html}
            
            <div class="section">
                <div class="section-title">Преимущества</div>
                <div class="pros">
                    {pros_html}
                </div>
            </div>
            
            <div class="section">
                <div class="eco-tip">{ecoTip}</div>
            </div>
            
            <div class="map-container">
                <iframe width="100%" height="100%" frameborder="0" style="border:0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox={lng_min},{lat_min},{lng_max},{lat_max}&layer=mapnik&marker={lat},{lng}"
                    allowfullscreen></iframe>
            </div>
        </div>
    </div>
</body>
</html>'''

def generate_contacts_html(contacts):
    html = '<div class="section"><div class="section-title">Контакты</div>'
    
    if contacts.get('phone'):
        phone_clean = contacts['phone'].replace(' ', '').replace('(', '').replace(')', '').replace('-', '')
        html += f'''
        <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div>
                <div class="contact-label">Телефон</div>
                <div class="contact-value"><a href="tel:{phone_clean}">{contacts['phone']}</a></div>
            </div>
        </div>'''
    
    if contacts.get('email'):
        html += f'''
        <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div>
                <div class="contact-label">Email</div>
                <div class="contact-value"><a href="mailto:{contacts['email']}">{contacts['email']}</a></div>
            </div>
        </div>'''
    
    if contacts.get('website'):
        html += f'''
        <div class="contact-item">
            <div class="contact-icon">🌐</div>
            <div>
                <div class="contact-label">Веб-сайт</div>
                <div class="contact-value"><a href="{contacts['website']}" target="_blank">{contacts['website']}</a></div>
            </div>
        </div>'''
    
    if contacts.get('address'):
        html += f'''
        <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div>
                <div class="contact-label">Адрес</div>
                <div class="contact-value">{contacts['address']}</div>
            </div>
        </div>'''
    
    if contacts.get('workingHours'):
        html += f'''
        <div class="contact-item">
            <div class="contact-icon">🕐</div>
            <div>
                <div class="contact-label">Время работы</div>
                <div class="contact-value">{contacts['workingHours']}</div>
            </div>
        </div>'''
    
    if contacts.get('ticketPrice'):
        html += f'''
        <div class="contact-item">
            <div class="contact-icon">💰</div>
            <div>
                <div class="contact-label">Стоимость</div>
                <div class="contact-value">{contacts['ticketPrice']}</div>
            </div>
        </div>'''
    
    html += '</div>'
    return html

for place in places_data:
    pros_html = ''.join([f'<div class="pro-tag">{pro}</div>' for pro in place['pros']])
    contacts_html = generate_contacts_html(place['contacts'])
    
    html = html_template.format(
        name=place['name'],
        emoji=place['emoji'],
        region=place['region'],
        rating=place['rating'],
        image=place['image'],
        description=place['description'],
        info=place['info'],
        ecology=place['ecology'],
        pros_html=pros_html,
        ecoTip=place['ecoTip'],
        contacts_html=contacts_html,
        lat=place['lat'],
        lng=place['lng'],
        lat_min=place['lat'] - 0.05,
        lat_max=place['lat'] + 0.05,
        lng_min=place['lng'] - 0.05,
        lng_max=place['lng'] + 0.05
    )
    
    with open(f'/home/claude/vko3/places/place-{place["id"]}.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f'✅ Generated place-{place["id"]}.html')

print(f'\n🎉 Successfully generated {len(places_data)} place pages!')
