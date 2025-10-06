// --- 1. УПРАВЛЕНИЕ ЭКРАНАМИ ---

const appContainer = document.getElementById('app-container');
const navButtons = document.querySelectorAll('#footer-nav .nav-button');
const backButton = document.querySelector('.back-button');

/**
 * Переключает видимый экран и активную кнопку в навигации.
 * @param {string} targetScreenId - ID секции, которую нужно показать.
 */
function switchScreen(targetScreenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Показываем целевой экран
    const targetScreen = document.getElementById(targetScreenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }

    // Обновляем активную кнопку в навигации
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.target === targetScreenId) {
            button.classList.add('active');
        }
    });

    // Если переходим на экран результатов, обновляем график
    if (targetScreenId === 'screen-results') {
        renderWeightChart();
    }
}

// Обработчики для кнопок нижней навигации
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchScreen(button.dataset.target);
    });
});

// Обработчики для кнопок меню Курса
document.querySelectorAll('#detox-menu .menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const day = e.currentTarget.dataset.day;
        if (day) {
            // Переход на экран детализации дня
            document.getElementById('day-detail-title').textContent = `Меню на День ${day}`;
            document.getElementById('day-content').innerHTML = 
                `<p>Здесь должно быть фото и описание меню для **Дня ${day}**.</p><p>Вам нужно будет заменить этот текст своим контентом и изображениями!</p>`;
            switchScreen('screen-day-detail');
        } else {
            alert('Здесь будет экран с Рецептами!');
        }
    });
});

// Обработчик для кнопки "Назад"
backButton.addEventListener('click', () => {
    switchScreen('screen-detox');
});


// --- 2. ЛОГИКА РЕЗУЛЬТАТОВ И ГРАФИКОВ ---

const resultsForm = document.getElementById('results-form');
const CHART_ID = 'weightChart';
// Имя ключа для хранения данных в localStorage
const STORAGE_KEY = 'detox_user_results';

/**
 * Загружает все сохраненные результаты из localStorage.
 * @returns {Array} Массив объектов результатов.
 */
function loadResults() {
    try {
        const json = localStorage.getItem(STORAGE_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error("Ошибка при загрузке данных из localStorage:", e);
        return [];
    }
}

/**
 * Сохраняет новый результат, добавляя его к существующим.
 * @param {object} newResult - Объект с данными за день.
 */
function saveResult(newResult) {
    const results = loadResults();
    
    // Добавляем текущую дату для отслеживания
    newResult.date = new Date().toLocaleDateString('ru-RU');
    
    results.push(newResult);
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
        alert('Результаты успешно сохранены!');
    } catch (e) {
        console.error("Ошибка при сохранении данных в localStorage:", e);
        alert('Ошибка: Не удалось сохранить результаты. Возможно, память устройства переполнена.');
    }

    // Обновляем график после сохранения
    renderWeightChart();
}

/**
 * Обработчик отправки формы. Собирает данные и сохраняет их.
 */
resultsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const result = {
        weight: parseFloat(document.getElementById('weight').value) || 0,
        age: parseInt(document.getElementById('age').value) || 0,
        height: parseInt(document.getElementById('height').value) || 0,
        chest: parseFloat(document.getElementById('chest').value) || null,
        waist: parseFloat(document.getElementById('waist').value) || null,
        hips: parseFloat(document.getElementById('hips').value) || null,
        fat: parseFloat(document.getElementById('fat').value) || null,
        muscle: parseFloat(document.getElementById('muscle').value) || null,
        water: parseFloat(document.getElementById('water').value) || null,
        bmi: parseFloat(document.getElementById('bmi').value) || null,
    };
    
    saveResult(result);
});


// Переменная для хранения экземпляра графика Chart.js
let weightChartInstance = null;

/**
 * Отображает или обновляет график динамики веса.
 */
function renderWeightChart() {
    const results = loadResults();
    const ctx = document.getElementById(CHART_ID).getContext('2d');
    
    // Если результатов нет, скрываем канвас
    if (results.length === 0) {
        if (weightChartInstance) { weightChartInstance.destroy(); weightChartInstance = null; }
        ctx.canvas.style.display = 'none';
        return;
    }
    
    ctx.canvas.style.display = 'block';

    const labels = results.map(r => r.date);
    const data = results.map(r => r.weight);

    // Уничтожаем старый график, если он существует
    if (weightChartInstance) {
        weightChartInstance.destroy();
    }

    weightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Вес (кг)',
                data: data,
                borderColor: '#a55eea', // Лиловый цвет
                backgroundColor: 'rgba(165, 94, 234, 0.2)', // Лиловый с прозрачностью
                tension: 0.4, // Сглаженные линии
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Вес (кг)',
                        color: '#ffffff' // Белый текст для темного фона
                    },
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' 
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' 
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// При загрузке страницы запускаем начальный экран
document.addEventListener('DOMContentLoaded', () => {
    switchScreen('screen-detox');
});