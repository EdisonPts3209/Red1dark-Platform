/**
 * Red1dark Moderation Module
 * Интеграция с OpenAI API + Локальные фильтры
 */

class Red1darkModeration {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.openai.com/v1/moderations';
        
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
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        input: text,
                        model: "text-moderation-latest"
                    })
                });

                const data = await response.json();
                
                if (data.results && data.results[0].flagged) {
                    const categories = data.results[0].categories;
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