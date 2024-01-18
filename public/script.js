
function createScoreChart(totalScores) {
    var deductionChartCanvas = document.getElementById('scoreChart').getContext('2d');

    var scoreChart = new Chart(deductionChartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(totalScores),
            datasets: [{
                label: '總分',
                data: Object.values(totalScores),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function initializeScoreChart() {
    fetch('/getJsonData')
        .then(response => response.json())
        .then(totalScores => {
            createScoreChart(totalScores);
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
}

function handleHomeClick() {
    initializeScoreChart();  // 調用初始化圖表函數
    showContent('home');        // 顯示首頁內容
}


function showContent(pageId) {
    // 隱藏所有內容
    document.getElementById('home').style.display = 'none';
    document.getElementById('scoreChange').style.display = 'none';
    document.getElementById('changeReason').style.display = 'none';

    // 顯示選定的內容
    document.getElementById(pageId).style.display = 'block';
}


function insertScoreChange() {
    const form = document.getElementById('scoreChangeForm');
    const formData = new FormData(form);
    fetch('/insertScoreChange', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // 在這裡處理成功回應
        })
        .catch(error => {
            console.error('Error:', error);
            // 在這裡處理錯誤
        });
}

initializeScoreChart();