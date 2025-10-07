// --- 1. ДАННЫЕ КУРСА ДЕТОКС ДНИ 1-7, СПИСОК ПРОДУКТОВ И РЕЦЕПТЫ ---
// (ВНИМАНИЕ: Контент укорочен для краткости, в вашем файле он должен быть полным)
const DETOX_DAYS_CONTENT = {
    // День 0: Список Продуктов
    "0": {
        title: "Список Продуктов",
        photoUrl: "list_of_products.jpg",
        description: `<p>**Курс Детокс - Мягкое очищение...**</p>... (полный контент Дня 0) ...`
    }, 
    // Рецепты
    "recipes": {
        title: "Сборник Рецептов Курса",
        photoUrl: "recipes_main.jpg",
        description: `<p>Здесь собраны все рецепты...</p>... (полный контент Рецептов) ...`
    },
    // День 1:
    "1": {
        title: "День 1: Подготовка и старт",
        photoUrl: "menu_day_1.jpg", 
        description: `<h3>ПЕРВЫЙ ЗАВТРАК...</h3>... (полный контент Дня 1) ...`
    },
    // ... (контент дней 2-7)...
    "7": { 
        title: "День 7: Завершение и мягкий выход",
        photoUrl: "menu_day_7.jpg", 
        description: `<h3>ПЕРВЫЙ ЗАВТРАК...</h3>... (полный контент Дня 7) ...`
    },
};
// --- КОНЕЦ ДАННЫХ КУРСА ---


// --- 2. ЛОГИКА ПРИЛОЖЕНИЯ ---
document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const navButtons = document.querySelectorAll('#footer-nav .nav-button');
    const screens = document.querySelectorAll('.screen');
    const detoxMenu = document.getElementById('detox-menu');
    const dayDetailTitle = document.getElementById('day-detail-title');
    const dayContentArea = document.getElementById('day-content');
    const backButton = document.querySelector('.back-button-detail');
    const resultsForm = document.getElementById('results-form');
    const historyList = document.getElementById('history-list');
    const weightChartCanvas = document.getElementById('weight-chart');
    let weightChart = null; // Для хранения экземпляра графика

    // --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ ---
    function switchScreen(targetId) {
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        document.getElementById(targetId).classList.remove('hidden');
        document.getElementById(targetId).classList.add('active');

        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-target') === targetId) {
                button.classList.add('active');
            }
        });
        
        // Перерисовываем график при активации экрана результатов
        if (targetId === 'screen-results') {
            renderChart();
        }
    }

    // --- ОБРАБОТЧИКИ НАВИГАЦИИ ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchScreen(button.getAttribute('data-target'));
        });
    });

    // Обработчик для кнопок Дней и Рецептов
    if (detoxMenu) {
        detoxMenu.addEventListener('click', (event) => {
            const button = event.target.closest('.menu-item');
            if (button && !button.classList.contains('future-course')) {
                const dayKey = button.getAttribute('data-day');
                if (dayKey && DETOX_DAYS_CONTENT[dayKey]) {
                    const content = DETOX_DAYS_CONTENT[dayKey];
                    
                    // Обновляем экран детализации
                    dayDetailTitle.textContent = content.title;
                    const htmlContent = `
                        <img src="${content.photoUrl}" alt="${content.title}" class="day-photo">
                        <div class="day-description">
                            ${content.description}
                        </div>
                    `;
                    dayContentArea.innerHTML = htmlContent;

                    // Переключаемся на экран детализации
                    document.getElementById('screen-day-detail').classList.remove('hidden');
                    document.getElementById('screen-day-detail').classList.add('active');
                    // Скрываем нижнюю навигацию на этом экране
                    document.getElementById('footer-nav').classList.add('hidden');
                }
            }
        });
    }

    // Обработчик для кнопки "Назад" с экрана деталей
    if (backButton) {
        backButton.addEventListener('click', () => {
            switchScreen('screen-detox');
            // Показываем нижнюю навигацию
            document.getElementById('footer-nav').classList.remove('hidden');
        });
    }


    // --- 3. ЛОГИКА ТРЕКЕРА РЕЗУЛЬТАТОВ (Local Storage) ---
    const STORAGE_KEY = 'detox_results';

    function loadResults() {
        try {
            const json = localStorage.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error("Ошибка загрузки результатов:", e);
            return [];
        }
    }

    function saveResults(results) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
        } catch (e) {
            console.error("Ошибка сохранения результатов:", e);
        }
    }

    function renderHistory() {
        const results = loadResults();
        historyList.innerHTML = ''; // Очистка списка
        
        results.sort((a, b) => new Date(b.date) - new Date(a.date)); // Сортировка по дате (новые сверху)

        results.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.date}</strong>: Вес - ${item.weight} кг, Талия - ${item.waist ? item.waist + ' см' : 'Н/Д'}`;
            historyList.appendChild(li);
        });
    }

    // Обработчик отправки формы
    resultsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('input-date').value;
        const weight = parseFloat(document.getElementById('input-weight').value);
        const waist = parseFloat(document.getElementById('input-waist').value) || null; // Талия может быть пустой

        if (!date || isNaN(weight)) {
            alert('Пожалуйста, введите дату и вес.');
            return;
        }

        const newEntry = { date, weight, waist, timestamp: new Date().getTime() };
        
        let results = loadResults();
        
        // Проверка на дубликат (по дате)
        const existingIndex = results.findIndex(item => item.date === date);
        if (existingIndex > -1) {
            // Обновляем существующую запись
            results[existingIndex] = newEntry;
            alert(`Результат за ${date} обновлен!`);
        } else {
            // Добавляем новую запись
            results.push(newEntry);
            alert('Результат сохранен!');
        }
        
        saveResults(results);
        renderHistory();
        renderChart();
        resultsForm.reset(); // Очистка формы
    });
    
    // --- 4. ЛОГИКА ГРАФИКА (Chart.js) ---
    function renderChart() {
        const results = loadResults().sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортировка по дате для графика (старые слева)

        const dates = results.map(item => item.date);
        const weights = results.map(item => item.weight);

        if (weightChart) {
            weightChart.destroy(); // Удаляем старый график перед созданием нового
        }

        weightChart = new Chart(weightChartCanvas, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Вес (кг)',
                    data: weights,
                    borderColor: '#a55eea', // Лиловый цвет
                    backgroundColor: 'rgba(165, 94, 234, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: { color: '#cccccc' },
                        grid: { color: '#33334d' }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#cccccc' },
                        grid: { color: '#33334d' }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                }
            }
        });
    }


    // Инициализация при загрузке страницы
    switchScreen('screen-detox');
    renderHistory();
    // Chart.js будет вызван при первом переходе на экран "Результаты"
});
