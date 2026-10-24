const inputs = document.querySelectorAll('.score-input');
const totalDisplay = document.getElementById('totalPercent');
const finalScoreDisplay = document.getElementById('finalScoreNeeded');
const req75 = document.getElementById('req75');
const req50 = document.getElementById('req50');
const resultContainer = document.getElementById('resultContainer');
const statusIcon = document.getElementById('statusIcon');
const subNote = document.getElementById('subNote');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (parseFloat(input.value) > 100) input.value = 100;
        calculate();
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    inputs.forEach(i => {
        i.value = '';
        i.classList.remove('invalid');
    });
    resetUI();
});

function calculate() {
    let phase2Total = 0;
    let anyUnder50 = false;
    let hasData = false;

    inputs.forEach(input => {
        const val = parseFloat(input.value) || 0;
        const weight = parseFloat(input.dataset.weight);
        
        if (input.value !== "") hasData = true;
        phase2Total += (val * weight);

        if (val < 50 && input.value !== "") {
            anyUnder50 = true;
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    });

    if (!hasData) {
        resetUI();
        return;
    }

    // تم التعديل لعرض رقمين عشريين (مثال: 78.25%)
    totalDisplay.innerText = phase2Total.toFixed(2) + "%";

    // الشرط الأول: مجموع المرحلة الثانية أكبر من أو يساوي 75%
    const is75Plus = phase2Total >= 75;
    updateReqStatus(req75, is75Plus);

    // الشرط الثاني: لا يوجد أي لجنة أقل من 50
    updateReqStatus(req50, !anyUnder50);

    // حساب الدرجة المطلوبة للاختبار النهائي
    let neededFor60 = (60 - (phase2Total * 0.6)) / 0.4;
    let actualRequired = Math.max(neededFor60, 50);

    if (is75Plus && !anyUnder50) {
        // حالة الإعفاء من النهائي
        resultContainer.className = "card result-panel pass-theme";
        statusIcon.innerText = "✓";
        statusIcon.style.background = "var(--success-green)";
        finalScoreDisplay.innerText = "EXEMPT";
        finalScoreDisplay.style.color = "var(--success-green)";
        subNote.innerText = "*Phase 2 requirements met! No final exam needed.";
    } else {
        // حالة دخول النهائي
        resultContainer.className = "card result-panel fail-theme";
        statusIcon.innerText = "!";
        statusIcon.style.background = "var(--danger-red)";
        finalScoreDisplay.style.color = "var(--primary-blue)";
        subNote.innerText = "*Final exam minimum 50 score applied";

        if (actualRequired > 100) {
            finalScoreDisplay.innerText = "Impossible";
            finalScoreDisplay.style.color = "var(--danger-red)";
        } else {
            finalScoreDisplay.innerText = actualRequired.toFixed(2) + "/100";
        }
    }
}

function updateReqStatus(element, isMet) {
    element.className = isMet ? "req-item met" : "req-item not-met";
}

function resetUI() {
    totalDisplay.innerText = "0.00%";
    finalScoreDisplay.innerText = "--";
    finalScoreDisplay.style.color = "var(--primary-blue)";
    resultContainer.className = "card result-panel";
    statusIcon.innerText = "?";
    statusIcon.style.background = "#cbd5e1";
    req75.className = "req-item";
    req50.className = "req-item";
    subNote.innerText = "*Final exam minimum 50 score applied";
}