/**
 * Red1dark Moderation Module
 * Интеграция с OpenAI API + Локальные фильтры
 */

// Функция для проверки через Flask API (безопасный вызов OpenAI)
async function checkWithOpenAI(text) {
    // Сюда вставишь ссылку на свой Flask апп после деплоя
    const FLASK_API_URL = 'https://твой-апп.pythonanywhere.com/moderate'; 
    
    try {
        const res = await fetch(FLASK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        return {
            flagged: data.flagged,
            categories: data.categories
        };
    } catch (error) {
        console.error('Moderation service unavailable:', error);
        // Если сервер упал, можно пропустить проверку или заблокировать сообщение
        return { flagged: false }; 
    }
}

class Red1darkModeration {
    constructor(apiKey) {
        this.apiKey = apiKey;
        
        // Локальный черный список (дополнительная защита)
        this.localBlacklist = [
            'казино', 'ставки', 'crypto-scam', 'нарко', 
            'террор', 'взрыв', 'убийство'
        ];
    }

    /**
     * Проверка текста перед отправкой
     * @param {string} text - Текст сообщения
     * @returns {Promise<{allowed: boolean, reason?: string}>}
     */
    async checkText(text) {
        if (!text || text.trim().length === 0) {
            return { allowed: false, reason: 'Пустое сообщение' };
        }

        // 1. Локальная проверка (быстрая)
        const localViolation = this.localBlacklist.find(word => 
            text.toLowerCase().includes(word)
        );
        if (localViolation) {
            return { 
                allowed: false, 
                reason: `Запрещенное слово: "${localViolation}"` 
            };
        }

        // 2. Проверка через OpenAI (если есть ключ)
        if (this.apiKey && this.apiKey.startsWith('sk-')) {
            try {
                const moderationResult = await checkWithOpenAI(text);
                
                if (moderationResult.flagged) {
                    const categories = moderationResult.categories;
                    const reasons = [];
                    
                    if (categories.hate) reasons.push('Ненависть');
                    if (categories.sexual) reasons.push('Сексуальный контент');
                    if (categories.violence) reasons.push('Насилие');
                    if (categories.self_harm) reasons.push('Самоповреждение');
                    if (categories.harassment) reasons.push('Преследование');
                    
                    return {
                        allowed: false,
                        reason: `Нарушение правил: ${reasons.join(', ')}`
                    };
                }

                return { allowed: true };

            } catch (error) {
                console.error('Moderation API Error:', error);
                // При ошибке API можно либо пропустить, либо заблокировать (строгий режим)
                return { allowed: true, warning: 'Модерация временно недоступна' };
            }
        }

        // Если ключа нет, пропускаем (режим разработки)
        return { allowed: true, warning: 'OpenAI ключ не настроен' };
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Red1darkModeration;
} else {
    window.Red1darkModeration = Red1darkModeration;
}