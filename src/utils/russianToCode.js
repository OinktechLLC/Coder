class RussianToCode {
  static keywords = {
    // Pawno/Russian translations - основные ключевые слова
    'если': 'if',
    'иначе': 'else',
    'пока': 'while',
    'для': 'for',
    'возврат': 'return',
    'новый': 'new',
    'общий': 'public',
    'статический': 'static',
    'константа': 'const',
    'переключатель': 'switch',
    'случай': 'case',
    'прервать': 'break',
    'продолжить': 'continue',
    'пусто': 'void',
    'истина': 'true',
    'ложь': 'false',
    
    // Функции вывода
    'печатать': 'Print',
    'напечатать': 'Print',
    'вывести': 'printf',
    'показать': 'Show',
    'сообщение': 'Message',
    
    // Основная функция
    'основная': 'main',
    'главная': 'main',
    'старт': 'start',
    'запуск': 'launch',
    
    // События игрока
    'игрок зашел': 'OnPlayerConnect',
    'игрок вышел': 'OnPlayerDisconnect',
    'игрок написал': 'OnPlayerText',
    'игрок ввел команду': 'OnPlayerCommandText',
    'игрок обновился': 'OnPlayerUpdate',
    'игрок нажал': 'OnPlayerKeyPress',
    'игрок получил урон': 'OnPlayerTakeDamage',
    'игрок умер': 'OnPlayerDeath',
    'игрок заспавнился': 'OnPlayerSpawn',
    
    // Переменные и типы
    'игрок': 'playerid',
    'текст': 'text',
    'число': 'number',
    'строка': 'string',
    'массив': 'array',
    'булево': 'bool',
    
    // Другие полезные слова
    'функция': 'function',
    'переменная': 'variable',
    'цикл': 'loop',
    'условие': 'condition',
    'событие': 'event',
    'таймер': 'timer',
    'задержка': 'delay'
  };

  // Фразы-паттерны которые нужно заменять целиком
  static patterns = [
    // Если игрок зашел { ... } -> OnPlayerConnect(playerid) { ... }
    {
      regex: /если\s+игрок\s+зашел\s*\{/gi,
      replacement: 'OnPlayerConnect(playerid) {'
    },
    // Если игрок вышел { ... } -> OnPlayerDisconnect(playerid, reason) { ... }
    {
      regex: /если\s+игрок\s+вышел\s*\{/gi,
      replacement: 'OnPlayerDisconnect(playerid, reason) {'
    },
    // Игрок написал { ... } -> OnPlayerText(playerid, text[]) { ... }
    {
      regex: /игрок\s+написал\s*\{/gi,
      replacement: 'OnPlayerText(playerid, text[]) {'
    },
    // Игрок ввел команду { ... } -> OnPlayerCommandText(playerid, cmdtext[]) { ... }
    {
      regex: /игрок\s+ввел\s+команду\s*\{/gi,
      replacement: 'OnPlayerCommandText(playerid, cmdtext[]) {'
    },
    // Печатать("...") -> Print("...")
    {
      regex: /печатать\s*\(/gi,
      replacement: 'Print('
    },
    // Напечатать("...") -> Print("...")
    {
      regex: /напечатать\s*\(/gi,
      replacement: 'Print('
    },
    // Вывести("...") -> printf("...")
    {
      regex: /вывести\s*\(/gi,
      replacement: 'printf('
    }
  ];

  static convert(code) {
    let converted = code;

    // Сначала применяем паттерны для сложных конструкций
    this.patterns.forEach(pattern => {
      converted = converted.replace(pattern.regex, pattern.replacement);
    });

    // Затем заменяем отдельные ключевые слова
    Object.entries(this.keywords).forEach(([ru, en]) => {
      // Создаем regex который учитывает границы слов
      const regex = new RegExp(`\\b${ru}\\b`, 'gi');
      converted = converted.replace(regex, en);
    });

    // Обрабатываем русские комментарии - оставляем как есть
    // converted = converted.replace(/\/\/\s*(.*)/g, (match, comment) => {
    //   return `// ${comment}`;
    // });

    // Русские строки оставляем без изменений
    // Это позволяет использовать русский текст в Print() и других функциях
    
    return converted;
  }

  static isRussian(text) {
    return /[а-яА-ЯёЁ]/.test(text);
  }

  static autoConvert(code) {
    if (this.isRussian(code)) {
      return this.convert(code);
    }
    return code;
  }

  static validateRussianKeywords(code) {
    // Проверяем какие русские ключевые слова найдены в коде
    const russianKeywords = Object.keys(this.keywords);
    const foundKeywords = [];
    
    russianKeywords.forEach(ru => {
      const regex = new RegExp(`\\b${ru}\\b`, 'gi');
      if (regex.test(code)) {
        foundKeywords.push(ru);
      }
    });
    
    // Проверяем паттерны
    this.patterns.forEach((pattern, index) => {
      if (pattern.regex.test(code)) {
        foundKeywords.push(`паттерн_${index}`);
      }
    });
    
    return {
      hasRussian: foundKeywords.length > 0,
      keywords: foundKeywords
    };
  }

  // Получить список всех поддерживаемых русских ключевых слов
  static getSupportedKeywords() {
    return {
      keywords: Object.keys(this.keywords),
      patterns: this.patterns.map(p => p.regex.source)
    };
  }
}

export default RussianToCode;
