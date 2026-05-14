const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentExpression = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === 'clear') {
            currentExpression = '';
        } else if (action === 'delete') {
            currentExpression = currentExpression.slice(0, -1);
        } else if (action === 'calculate') {
            calculateResult();
        } else {
            if (currentExpression === 'Error') currentExpression = '';
            
            const lastChar = currentExpression.slice(-1);
            const operators = ['+', '-', '*', '/', '%', '.'];
            if (operators.includes(value) && operators.includes(lastChar)) return;

            currentExpression += value;
        }
        updateDisplay();
    });
});

function calculateResult() {
    if (!currentExpression) return;
    try {
        // Safe evaluation using Function constructor (faster & slightly safer than eval)
        const result = Function('"use strict"; return (' + currentExpression + ')')();
        
        if (!isFinite(result) || isNaN(result)) {
            currentExpression = 'Error';
        } else {
            // Fix JS floating-point quirks (e.g., 0.1 + 0.2)
            currentExpression = String(parseFloat(result.toFixed(10)));
        }
    } catch {
        currentExpression = 'Error';
    }
}

function updateDisplay() {
    display.value = currentExpression || '0';
}

// 🖥️ Keyboard Support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (/[0-9+\-*/.%]/.test(key)) {
        currentExpression += key;
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Backspace') {
        currentExpression = currentExpression.slice(0, -1);
    } else if (key === 'Escape') {
        currentExpression = '';
    } else {
        return;
    }
    updateDisplay();
});
