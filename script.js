// Кэширование DOM элементов
const elements = {};

// Инициализация элементов при загрузке страницы
function initElements() {
    elements.alphaGalactosidase = document.getElementById('alphaGalactosidase');
    elements.h2fpef = document.getElementById('h2fpef');
    elements.hospitalization = document.getElementById('hospitalization');
    elements.smoking = document.getElementById('smoking');
    elements.eEprime = document.getElementById('eEprime');
    elements.clearButton = document.getElementById('clearButton');
    elements.result = document.getElementById('result');
    
    // Кэширование элементов ошибок
    elements.errors = {
        alphaGalactosidase: document.getElementById('alphaGalactosidaseError'),
        h2fpef: document.getElementById('h2fpefError'),
        hospitalization: document.getElementById('hospitalizationError'),
        smoking: document.getElementById('smokingError'),
        eEprime: document.getElementById('eEprimeError')
    };
}

// Вспомогательная функция для нормализации числовых значений
function normalizeNumber(value) {
    return value.replace(',', '.');
}

// Вспомогательная функция для парсинга числового значения
function parseNumber(value) {
    return parseFloat(normalizeNumber(value));
}

// Проверка, все ли поля пусты
function checkIfAllEmpty() {
    const isEmpty = 
        elements.alphaGalactosidase.value.trim() === '' &&
        elements.h2fpef.value.trim() === '' &&
        elements.hospitalization.value === '' &&
        elements.smoking.value === '' &&
        elements.eEprime.value.trim() === '';
    
    elements.clearButton.style.display = isEmpty ? 'none' : 'block';
}

// Очистка ошибки поля
function clearFieldError(fieldId) {
    if (elements.errors[fieldId]) {
        elements.errors[fieldId].textContent = '';
    }
}

// Валидация и форматирование числового ввода
function formatNumericInput(input) {
    input.value = input.value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
    const parts = input.value.split('.');
    if (parts.length > 2) {
        input.value = parts[0] + '.' + parts.slice(1).join('');
    }
}

// Debounce функция для оптимизации производительности
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Инициализация обработчиков событий
function initEventListeners() {
    const numericInputs = ['alphaGalactosidase', 'h2fpef', 'eEprime'];
    const debouncedCheck = debounce(checkIfAllEmpty, 100);
    
    numericInputs.forEach(id => {
        const input = elements[id];
        input.addEventListener('input', function() {
            formatNumericInput(this);
            clearFieldError(id);
            debouncedCheck();
        });
    });
    
    const selectInputs = ['hospitalization', 'smoking'];
    selectInputs.forEach(id => {
        elements[id].addEventListener('change', function() {
            clearFieldError(id);
            checkIfAllEmpty();
        });
    });
}

// Логистическая функция вероятности
function logisticProbability(z) {
    return 1 / (1 + Math.exp(-z));
}

// Расчет Z-значения
function calculateZ(alphaGalactosidase, h2fpef, hospitalization, smoking, eEprime) {
    return -6.032 - 0.020 * alphaGalactosidase + 0.385 * h2fpef + 
           1.817 * hospitalization + 2.489 * smoking + 0.178 * eEprime;
}

// Валидация числового ввода
function validateInput(value, min, max, fieldName) {
    if (isNaN(value) || value === '') {
        return `Пожалуйста, введите числовое значение для ${fieldName}.`;
    }
    if (value < min || value > max) {
        return `Пожалуйста, введите значение от ${min} до ${max} для ${fieldName}.`;
    }
    return null;
}

// Валидация выбора
function validateSelect(value, fieldName) {
    if (value === '') {
        return `Пожалуйста, выберите значение для ${fieldName}.`;
    }
    return null;
}

// Расчет вероятности
function calculateProbability() {
    // Получение значений
    const values = {
        alphaGalactosidase: elements.alphaGalactosidase.value.trim(),
        h2fpef: elements.h2fpef.value.trim(),
        hospitalization: elements.hospitalization.value,
        smoking: elements.smoking.value,
        eEprime: elements.eEprime.value.trim()
    };

    // Валидация
    const errors = {
        alphaGalactosidase: validateInput(
            values.alphaGalactosidase ? parseNumber(values.alphaGalactosidase) : '', 
            0, 1000, "альфа-галактозидазы А"
        ),
        h2fpef: validateInput(
            values.h2fpef ? parseNumber(values.h2fpef) : '', 
            0, 9, "H2FPEF"
        ),
        hospitalization: validateSelect(values.hospitalization, "факта госпитализации"),
        smoking: validateSelect(values.smoking, "статуса курения"),
        eEprime: validateInput(
            values.eEprime ? parseNumber(values.eEprime) : '', 
            0, 100, "отношения Е/е'"
        )
    };

    // Отображение ошибок
    Object.keys(errors).forEach(key => {
        elements.errors[key].textContent = errors[key] || '';
    });

    // Проверка наличия ошибок
    if (Object.values(errors).some(error => error !== null)) {
        return;
    }

    // Парсинг значений
    const parsedValues = {
        alphaGalactosidase: parseNumber(values.alphaGalactosidase),
        h2fpef: parseNumber(values.h2fpef),
        hospitalization: parseInt(values.hospitalization),
        smoking: parseInt(values.smoking),
        eEprime: parseNumber(values.eEprime)
    };

    // Расчет
    const z = calculateZ(
        parsedValues.alphaGalactosidase,
        parsedValues.h2fpef,
        parsedValues.hospitalization,
        parsedValues.smoking,
        parsedValues.eEprime
    );

    const probability = logisticProbability(z);

    // Отображение результата
    elements.result.textContent = 
        `Вероятность сердечно-сосудистой госпитализации в ближайшие 12 месяцев: ${(probability * 100).toFixed(2)}%`;
    elements.result.classList.add('show');
}

// Очистка формы
function clearForm() {
    // Очистка полей ввода
    elements.alphaGalactosidase.value = '';
    elements.h2fpef.value = '';
    elements.hospitalization.value = '';
    elements.smoking.value = '';
    elements.eEprime.value = '';

    // Очистка ошибок
    Object.values(elements.errors).forEach(errorEl => {
        errorEl.textContent = '';
    });

    // Очистка результата
    elements.result.textContent = '';
    elements.result.classList.remove('show');
    
    checkIfAllEmpty();
}

// Установка года в футер
function setCopyrightYear() {
    const copyrightFooter = document.getElementById('copyrightFooter');
    if (copyrightFooter) {
        const currentYear = new Date().getFullYear();
        const startYear = 2025;
        copyrightFooter.textContent = `© ${startYear} - ${currentYear}`;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initElements();
    initEventListeners();
    checkIfAllEmpty();
    setCopyrightYear();
    
    // Привязка обработчиков кнопок
    document.getElementById('calculateButton').addEventListener('click', calculateProbability);
    if (elements.clearButton) {
        elements.clearButton.addEventListener('click', clearForm);
    }
});

