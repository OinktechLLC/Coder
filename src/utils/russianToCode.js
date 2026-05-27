class RussianToCode {
  static keywords = {
    // Pawno/Russian translations
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
    
    // Functions
    'печатать': 'Print',
    'вывести': 'printf',
    'основная': 'main',
    'функция': 'function',
    
    // Variables
    'игрок': 'playerid',
    'текст': 'text',
    'число': 'number',
    'строка': 'string'
  };

  static convert(code) {
    let converted = code;

    // Replace Russian keywords with English equivalents
    Object.entries(this.keywords).forEach(([ru, en]) => {
      const regex = new RegExp(`\\b${ru}\\b`, 'gi');
      converted = converted.replace(regex, en);
    });

    // Convert Russian comments to English (optional)
    converted = converted.replace(/\/\/\s*(.*)/g, (match, comment) => {
      return `// ${comment}`;
    });

    return converted;
  }

  static isRussian(text) {
    return /[\u0400-\u04FF]/.test(text);
  }

  static autoConvert(code) {
    if (this.isRussian(code)) {
      return this.convert(code);
    }
    return code;
  }
}

export default RussianToCode;
