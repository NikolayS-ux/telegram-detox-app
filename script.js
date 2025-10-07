// --- 1. ДАННЫЕ КУРСА ДЕТОКС ДНИ 1-7, СПИСОК ПРОДУКТОВ И РЕЦЕПТЫ ---
// (ВНИМАНИЕ: Проверьте, что ваш полный контент сохранен в этом блоке!)
const DETOX_DAYS_CONTENT = {
    // День 0: Список Продуктов
    "0": {
        title: "Список Продуктов",
        photoUrl: "list_of_products.jpg", 
        description: `<h3>ОСНОВНЫЕ ПРИНЦИПЫ</h3>... (полный контент Дня 0) ...`
    }, 
    // Рецепты 
    "recipes": {
        title: "Сборник Рецептов Курса",
        photoUrl: "recipes_main.jpg", 
        description: `<h3>1. Блюда из рыбы и морепродуктов</h3>... (полный контент Рецептов) ...`
    },
    // День 1:
    "1": {
        title: "День 1: Подготовка и старт",
        photoUrl: "menu_day_1.jpg", 
        description: `<h3>ПЕРВЫЙ ЗАВТРАК</h3>... (полный контент Дня 1) ...`
    },
    // ... (контент дней 2-7)...
    "7": { 
        title: "День 7: Завершение и мягкий выход",
        photoUrl: "menu_day_7.jpg", 
        description: `<h3>ПЕРВЫЙ ЗАВТРАК</h3>... (полный контент Дня 7) ...`
    },
};
// --- КОНЕЦ ДАННЫХ КУРСА ---


// --- 2. ЛОГИКА ПРИЛОЖЕНИЯ (Исправлено для 3-х кнопок) ---
document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const navButtons = document.querySelectorAll('#footer-nav .nav-button');
    const screens = document.querySelectorAll('.screen');
    const detoxMenu = document.getElementById('detox-menu');
    const dayDetailTitle = document.getElementById('day-detail-title');
    const dayContentArea = document.getElementById('day-content');
    // Я заменил .back-button на .back-button-detail в HTML для лучшего соответствия стилю
    const backButton = document.querySelector('.back-button-detail'); 
    const footerNav = document.getElementById('footer-nav');

    // --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ОСНОВНЫХ ЭКРАНОВ (Курс, Результаты, Бонусы) ---
    function switchScreen(targetId) {
        // Скрываем все экраны
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        // Показываем целевой экран
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }

        // Обновление активной кнопки в подвале
        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-target') === targetId) {
                button.classList.add('active');
            }
        });
        
        // Всегда показываем подвал при переключении основных экранов
        footerNav.classList.remove('hidden');
    }
    
    // --- ЗАГРУЗКА КОНТЕНТА ДНЯ/РЕЦЕПТОВ (Переход на экран Деталей) ---
    function loadDetailScreen(key) {
        const content = DETOX_DAYS_CONTENT[key];
        
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
        switchScreen('screen-day-detail');
        
        // Скрываем подвал, так как это детальный экран
        footerNav.classList.add('hidden');
        
        // Прокрутка к верху
        document.getElementById('screen-day-detail').scrollTo(0, 0);
    }

    // --- ОБРАБОТЧИКИ ---
    
    // 1. Навигация в подвале (Курс, Результаты, Бонусы)
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            
            // Если нажимаем на любую из трех кнопок, переключаем основной экран
            if (target) {
                switchScreen(target);
            }
        });
    });

    // 2. Кнопки Дней/Рецептов в главном меню
    if (detoxMenu) {
        detoxMenu.addEventListener('click', (event) => {
            const button = event.target.closest('.menu-item');
            if (button && !button.classList.contains('future-course')) {
                const dayKey = button.getAttribute('data-day');
                
                if (dayKey && DETOX_DAYS_CONTENT[dayKey]) {
                    loadDetailScreen(dayKey);
                }
            }
        });
    }

    // 3. Кнопка "Назад" с экрана деталей
    // Примечание: В вашем HTML есть класс .back-button. 
    // Я использую .back-button-detail, как мы исправили в CSS/HTML, но 
    // на всякий случай добавлю обработчик и на .back-button.
    const backButtonOld = document.querySelector('.back-button'); 
    
    const handleBackButton = () => {
        switchScreen('screen-detox'); 
    };
    
    if (backButton) {
        backButton.addEventListener('click', handleBackButton);
    }
    if (backButtonOld) {
        backButtonOld.addEventListener('click', handleBackButton);
    }


    // Инициализация (начинаем с главного экрана)
    switchScreen('screen-detox');
});
