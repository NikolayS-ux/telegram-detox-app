document.addEventListener('DOMContentLoaded', function() {
    let resultsData = JSON.parse(localStorage.getItem('detoxResults')) || [];
    let completedDays = JSON.parse(localStorage.getItem('detoxCompletedDays')) || {};
    let resultsChart;

    function switchScreen(targetId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => {
            s.style.opacity = '0';
            setTimeout(() => s.classList.add('hidden'), 200);
        });

        setTimeout(() => {
            const target = document.getElementById(targetId);
            target.classList.remove('hidden');
            setTimeout(() => {
                target.style.opacity = '1';
                target.style.transition = 'opacity 0.4s ease';
            }, 50);
        }, 210);

        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
        });

        if (targetId === 'screen-results') renderResults();
        if (targetId === 'screen-motivation') updateMotivation();
    }

    // Навигация
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.addEventListener('click', () => switchScreen(btn.getAttribute('data-target')));
    });

    // Клик по дням
    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const dayKey = btn.getAttribute('data-day');
            const data = DETOX_DAYS_CONTENT[dayKey];
            if (data) {
                document.getElementById('day-detail-title').textContent = data.title;
                document.getElementById('day-content').innerHTML = `
                    ${data.photoUrl ? `<img src="${data.photoUrl}" style="width:100%; border-radius:15px; margin-bottom:20px;">` : ''}
                    <div class="description-text">${data.description}</div>
                `;
                switchScreen('screen-day-detail');
            }
        });
    });

    document.querySelector('.back-button').addEventListener('click', () => switchScreen('screen-detox'));

    // Графики
    function renderResults() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        if (resultsChart) resultsChart.destroy();
        resultsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: resultsData.map(d => d.date),
                datasets: [{
                    label: 'Вес',
                    data: resultsData.map(d => d.weight),
                    borderColor: '#43a047',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(67, 160, 71, 0.1)'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // Форма результатов
    document.getElementById('results-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const entry = {
            date: document.getElementById('result-date').value,
            weight: parseFloat(document.getElementById('result-weight').value)
        };
        resultsData.push(entry);
        localStorage.setItem('detoxResults', JSON.stringify(resultsData));
        renderResults();
        e.target.reset();
    });

    function updateMotivation() {
        const count = Object.keys(completedDays).length;
        document.getElementById('progress-bar-fill').style.width = (count / 7 * 100) + '%';
        document.getElementById('progress-text').textContent = `${count}/7`;
    }

    document.getElementById('complete-day-button').addEventListener('click', () => {
        const today = new Date().toISOString().split('T')[0];
        completedDays[today] = true;
        localStorage.setItem('detoxCompletedDays', JSON.stringify(completedDays));
        updateMotivation();
    });
});
