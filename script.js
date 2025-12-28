document.addEventListener('DOMContentLoaded', function() {
    // 1. Состояние приложения
    let resultsData = JSON.parse(localStorage.getItem('detoxResults')) || [];
    let completedDays = JSON.parse(localStorage.getItem('detoxCompletedDays')) || {};
    const TOTAL_DAYS = 7;
    let resultsChart;

    // 2. Навигация
    function switchScreen(targetId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
        
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
        });

        if (targetId === 'screen-results') renderResults();
        if (targetId === 'screen-motivation') updateMotivation();
    }

    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => switchScreen(btn.getAttribute('data-target')));
    });

    // 3. Меню и детали дня
    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const dayKey = btn.getAttribute('data-day');
            const content = DETOX_DAYS_CONTENT[dayKey];
            if (content) {
                document.getElementById('day-detail-title').textContent = content.title;
                document.getElementById('day-content').innerHTML = `
                    ${content.photoUrl ? `<img src="${content.photoUrl}" alt="меню">` : ''}
                    ${content.description}
                `;
                switchScreen('screen-day-detail');
            }
        });
    });

    document.querySelector('.back-button').addEventListener('click', () => switchScreen('screen-detox'));

    // 4. Логика замеров
    document.getElementById('results-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const entry = {
            date: document.getElementById('result-date').value,
            weight: parseFloat(document.getElementById('result-weight').value),
            waist: parseInt(document.getElementById('result-waist').value),
            hips: parseInt(document.getElementById('result-hips').value)
        };
        resultsData.push(entry);
        resultsData.sort((a,b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('detoxResults', JSON.stringify(resultsData));
        renderResults();
        e.target.reset();
    });

    function renderResults() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        if (resultsChart) resultsChart.destroy();
        
        resultsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: resultsData.map(d => d.date),
                datasets: [{ label: 'Вес (кг)', data: resultsData.map(d => d.weight), borderColor: '#4caf50' }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // 5. Мотивация и Игра
    function updateMotivation() {
        const count = Object.keys(completedDays).length;
        const percent = (count / TOTAL_DAYS) * 100;
        document.getElementById('progress-bar-fill').style.width = percent + '%';
        document.getElementById('progress-text').textContent = `Пройдено: ${count} из ${TOTAL_DAYS} дней`;
        
        initGame();
    }

    document.getElementById('complete-day-button').addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        completedDays[today] = true;
        localStorage.setItem('detoxCompletedDays', JSON.stringify(completedDays));
        updateMotivation();
    });

    function initGame() {
        const items = [
            {n: 'Авокадо', h: true}, {n: 'Сахар', h: false}, 
            {n: 'Шпинат', h: true}, {n: 'Булка', h: false}
        ];
        const area = document.getElementById('game-area');
        area.innerHTML = '';
        items.sort(() => Math.random() - 0.5).forEach(item => {
            const b = document.createElement('button');
            b.className = 'game-choice-button';
            b.textContent = item.n;
            b.onclick = () => {
                const msg = document.getElementById('game-message');
                msg.classList.remove('hidden');
                msg.textContent = item.h ? "✅ Верно!" : "❌ Не в детоксе!";
                setTimeout(() => msg.classList.add('hidden'), 2000);
            };
            area.appendChild(b);
        });
    }
});
