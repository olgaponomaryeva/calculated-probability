function checkIfAllEmpty() {
    const alphaGalactosidase = document.getElementById('alphaGalactosidase').value.trim();
    const h2fpef = document.getElementById('h2fpef').value.trim();
    const hospitalization = document.getElementById('hospitalization').value;
    const smoking = document.getElementById('smoking').value;
    const eEprime = document.getElementById('eEprime').value.trim();
    const clearButton = document.getElementById('clearButton');
    
    if (alphaGalactosidase === '' && h2fpef === '' && hospitalization === '' && smoking === '' && eEprime === '') {
        clearButton.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
    }
}

function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const numericInputs = ['alphaGalactosidase', 'h2fpef', 'eEprime'];
    numericInputs.forEach(function(id) {
        const input = document.getElementById(id);
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
            const parts = this.value.split('.');
            if (parts.length > 2) {
                this.value = parts[0] + '.' + parts.slice(1).join('');
            }
            clearFieldError(id);
            checkIfAllEmpty();
        });
    });
    
    const selectInputs = ['hospitalization', 'smokаваing'];
    selectInputs.forEach(function(id) {
        const select = document.getElementById(id);
        select.addEventListener('change', function() {
            clearFieldError(id);
            checkIfAllEmpty();
        });
    });
    
    checkIfAllEmpty();
});

function logisticProbability(z) {
    return 1 / (1 + Math.exp(-z));
}

function calculateZ(alphaGalactosidase, h2fpef, hospitalization, smoking, eEprime) {
    return -6.032 - 0.020 * alphaGalactosidase + 0.385 * h2fpef + 1.817 * hospitalization + 2.489 * smoking + 0.178 * eEprime;
}

function validateInput(value, min, max, fieldName) {
    if (isNaN(value) || value === '') {
        return `Пожалуйста, введите числовое значение для ${fieldName}.`;
    }

    if (value < min || value > max) {
        return `Пожалуйста, введите значение от ${min} до ${max} для ${fieldName}.`;
    }

    return null;
}

function validateSelect(value, fieldName) {
    if (value === '') {
        return `Пожалуйста, выберите значение для ${fieldName}.`;
    }
    return null;
}

function calculateProbability() {
    const alphaGalactosidaseStr = document.getElementById('alphaGalactosidase').value.trim();
    const h2fpefStr = document.getElementById('h2fpef').value.trim();
    const hospitalizationStr = document.getElementById('hospitalization').value;
    const smokingStr = document.getElementById('smoking').value;
    const eEprimeStr = document.getElementById('eEprime').value.trim();

    const alphaGalactosidaseError = validateInput(alphaGalactosidaseStr === '' ? '' : parseFloat(alphaGalactosidaseStr.replace(',', '.')), 0, 1000, "альфа-галактозидазы А");
    const h2fpefError = validateInput(h2fpefStr === '' ? '' : parseFloat(h2fpefStr.replace(',', '.')), 0, 9, "H2FPEF");
    const hospitalizationError = validateSelect(hospitalizationStr, "факта госпитализации");
    const smokingError = validateSelect(smokingStr, "статуса курения");
    const eEprimeError = validateInput(eEprimeStr === '' ? '' : parseFloat(eEprimeStr.replace(',', '.')), 0, 100, "отношения Е/е'");

    document.getElementById('alphaGalactosidaseError').textContent = alphaGalactosidaseError || '';
    document.getElementById('h2fpefError').textContent = h2fpefError || '';
    document.getElementById('hospitalizationError').textContent = hospitalizationError || '';
    document.getElementById('smokingError').textContent = smokingError || '';
    document.getElementById('eEprimeError').textContent = eEprimeError || '';

    if (alphaGalactosidaseError || h2fpefError || hospitalizationError || smokingError || eEprimeError) {
        return;
    }

    const alphaGalactosidase = parseFloat(alphaGalactosidaseStr.replace(',', '.'));
    const h2fpef = parseFloat(h2fpefStr.replace(',', '.'));
    const hospitalization = parseInt(hospitalizationStr);
    const smoking = parseInt(smokingStr);
    const eEprime = parseFloat(eEprimeStr.replace(',', '.'));

    const z = calculateZ(alphaGalactosidase, h2fpef, hospitalization, smoking, eEprime);

    const probability = logisticProbability(z);

    const resultElement = document.getElementById('result');
    resultElement.textContent = `Вероятность сердечно-сосудистой госпитализации в ближайшие 12 месяцев: ${(probability * 100).toFixed(2)}%`;
    resultElement.classList.add('show');
}

function clearForm() {
    document.getElementById('alphaGalactosidase').value = '';
    document.getElementById('h2fpef').value = '';
    document.getElementById('hospitalization').value = '';
    document.getElementById('smoking').value = '';
    document.getElementById('eEprime').value = '';

    document.getElementById('alphaGalactosidaseError').textContent = '';
    document.getElementById('h2fpefError').textContent = '';
    document.getElementById('hospitalizationError').textContent = '';
    document.getElementById('smokingError').textContent = '';
    document.getElementById('eEprimeError').textContent = '';

    const resultElement = document.getElementById('result');
    resultElement.textContent = '';
    resultElement.classList.remove('show');
    
    checkIfAllEmpty();
}

