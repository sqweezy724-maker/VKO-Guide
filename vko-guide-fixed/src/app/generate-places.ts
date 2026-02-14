import { places } from "./places-data";
import type { Place } from "./places-data";
import * as fs from "fs";
import * as path from "path";

// Функция для генерации HTML страницы для места
const generatePlaceHTML = (place: Place): string => {
  const contacts = place.contacts || {};
  
  return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${place.name} | ВКО Гид</title>
    <meta name="description" content="${place.description}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .hero {
            position: relative;
            height: 400px;
            background: url('${place.image}') center/cover;
        }
        
        .hero::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
        }
        
        .hero-content {
            position: absolute;
            bottom: 30px;
            left: 30px;
            right: 30px;
            z-index: 1;
            color: white;
        }
        
        .emoji {
            font-size: 48px;
            margin-bottom: 10px;
            display: inline-block;
        }
        
        h1 {
            font-size: 36px;
            font-weight: 800;
            margin-bottom: 8px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        
        .region {
            font-size: 16px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .rating {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(0,0,0,0.4);
            padding: 6px 12px;
            border-radius: 20px;
            margin-top: 10px;
            backdrop-filter: blur(10px);
        }
        
        .rating::before {
            content: '⭐';
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #16a34a;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: #16a34a;
            border-radius: 2px;
        }
        
        .description {
            font-size: 16px;
            color: #4b5563;
            line-height: 1.8;
        }
        
        .info-grid {
            display: grid;
            gap: 20px;
        }
        
        .info-card {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 16px;
            border-left: 4px solid #16a34a;
        }
        
        .info-card h3 {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #16a34a;
        }
        
        .info-card p {
            font-size: 14px;
            color: #6b7280;
        }
        
        .contact-item {
            display: flex;
            align-items: start;
            gap: 12px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 12px;
            margin-bottom: 12px;
            transition: all 0.2s;
        }
        
        .contact-item:hover {
            background: #f3f4f6;
            transform: translateX(5px);
        }
        
        .contact-icon {
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .contact-label {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        
        .contact-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 500;
        }
        
        .contact-value a {
            color: #16a34a;
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .contact-value a:hover {
            color: #15803d;
            text-decoration: underline;
        }
        
        .pros {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .pro-tag {
            background: linear-gradient(135deg, #16a34a, #15803d);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }
        
        .eco-tip {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 20px;
            border-radius: 16px;
            border: 2px solid #fbbf24;
        }
        
        .eco-tip::before {
            content: '💡';
            font-size: 24px;
            margin-right: 10px;
        }
        
        .eco-tip-text {
            color: #78350f;
            font-size: 14px;
            font-weight: 500;
        }
        
        .map-container {
            margin-top: 30px;
            border-radius: 16px;
            overflow: hidden;
            height: 300px;
            border: 2px solid #e5e7eb;
        }
        
        .back-button {
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
        }
        
        .back-button:hover {
            background: #15803d;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
        }
        
        @media (max-width: 768px) {
            .hero {
                height: 300px;
            }
            
            h1 {
                font-size: 28px;
            }
            
            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <div class="hero-content">
                <div class="emoji">${place.emoji}</div>
                <h1>${place.name}</h1>
                <div class="region">📍 ${place.region}</div>
                <div class="rating">${place.rating}</div>
            </div>
        </div>
        
        <div class="content">
            <a href="../index.html" class="back-button">
                ← Назад к карте
            </a>
            
            <div class="section">
                <div class="section-title">О месте</div>
                <p class="description">${place.description}</p>
            </div>
            
            <div class="section">
                <div class="section-title">Информация</div>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>📋 Подробности</h3>
                        <p>${place.info}</p>
                    </div>
                    <div class="info-card">
                        <h3>🌱 Экология</h3>
                        <p>${place.ecology}</p>
                    </div>
                </div>
            </div>
            
            ${contacts.phone || contacts.email || contacts.website || contacts.address ? `
            <div class="section">
                <div class="section-title">Контакты</div>
                
                ${contacts.phone ? `
                <div class="contact-item">
                    <div class="contact-icon">📞</div>
                    <div>
                        <div class="contact-label">Телефон</div>
                        <div class="contact-value"><a href="tel:${contacts.phone.replace(/[^0-9+]/g, '')}">${contacts.phone}</a></div>
                    </div>
                </div>
                ` : ''}
                
                ${contacts.email ? `
                <div class="contact-item">
                    <div class="contact-icon">✉️</div>
                    <div>
                        <div class="contact-label">Email</div>
                        <div class="contact-value"><a href="mailto:${contacts.email}">${contacts.email}</a></div>
                    </div>
                </div>
                ` : ''}
                
                ${contacts.website ? `
                <div class="contact-item">
                    <div class="contact-icon">🌐</div>
                    <div>
                        <div class="contact-label">Веб-сайт</div>
                        <div class="contact-value"><a href="${contacts.website}" target="_blank">${contacts.website}</a></div>
                    </div>
                </div>
                ` : ''}
                
                ${contacts.address ? `
                <div class="contact-item">
                    <div class="contact-icon">📍</div>
                    <div>
                        <div class="contact-label">Адрес</div>
                        <div class="contact-value">${contacts.address}</div>
                    </div>
                </div>
                ` : ''}
                
                ${contacts.workingHours ? `
                <div class="contact-item">
                    <div class="contact-icon">🕐</div>
                    <div>
                        <div class="contact-label">Время работы</div>
                        <div class="contact-value">${contacts.workingHours}</div>
                    </div>
                </div>
                ` : ''}
                
                ${contacts.ticketPrice ? `
                <div class="contact-item">
                    <div class="contact-icon">💰</div>
                    <div>
                        <div class="contact-label">Стоимость</div>
                        <div class="contact-value">${contacts.ticketPrice}</div>
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="section">
                <div class="section-title">Преимущества</div>
                <div class="pros">
                    ${place.pros.map(pro => `<div class="pro-tag">${pro}</div>`).join('')}
                </div>
            </div>
            
            <div class="section">
                <div class="eco-tip">
                    <div class="eco-tip-text">${place.ecoTip}</div>
                </div>
            </div>
            
            <div class="map-container">
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    style="border:0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=${place.lng-0.05},${place.lat-0.05},${place.lng+0.05},${place.lat+0.05}&layer=mapnik&marker=${place.lat},${place.lng}"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    </div>
</body>
</html>`;
};

// Генерируем страницу для каждого места
export const generateAllPlacesHTML = () => {
  const outputDir = path.join(process.cwd(), "places");
  
  // Создаем директорию если её нет
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  places.forEach(place => {
    const html = generatePlaceHTML(place);
    const filename = `place-${place.id}.html`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, html, "utf-8");
    console.log(`✅ Generated: ${filename}`);
  });
  
  console.log(`\n🎉 Successfully generated ${places.length} place pages in ${outputDir}`);
};

// Если запускается напрямую
if (require.main === module) {
  generateAllPlacesHTML();
}
