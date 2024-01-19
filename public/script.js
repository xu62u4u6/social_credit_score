
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

    // 將 FormData 對象轉換為 JSON 對象
    const json = {};
    formData.forEach((value, key) => json[key] = value);
    fetch('/insertScoreChange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
        form.reset();
        let message = '';
        if (json.scoreChange < 0) {
            message = `${json.username} 因為${json.reason} 扣 ${Math.abs(json.scoreChange)} 分`;
        } else {
            message = `${json.username} 因為${json.reason} 加${json.scoreChange} 分`;
        }
        alert(message);
    })
    .catch(error => {
        alert('分數變更失敗！');
    });
}

function getUserScoreChanges() {
    const username = document.getElementById('usernameSelectReason').value;

    fetch(`/user/${username}`)
        .then(response => response.json())
        .then(data => {
            // 將資訊顯示在頁面上的表格中
            const userScoreChangesTable = document.getElementById('userScoreChangesTable');
            const tbody = userScoreChangesTable.querySelector('tbody');
            tbody.innerHTML = '';

            data.forEach(scoreChange => {
                // 將每筆資訊插入表格的新一行
                const row = tbody.insertRow();
                const cellReason = row.insertCell(0);
                const cellScoreChange = row.insertCell(1);

                // 設定每一格的內容
                cellReason.textContent = scoreChange.reason;
                cellScoreChange.textContent = scoreChange.score_change;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

initializeScoreChart();
// 獲取使用者清單，動態生成下拉選單
fetch('/userList')
    .then(response => response.json())
    .then(userList => {
        const usernameSelectScoreChange = document.getElementById('usernameSelectScoreChange');
        const usernameSelectReason = document.getElementById('usernameSelectReason');
        userList.forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.text = username;
            usernameSelectScoreChange.add(option);
        });
        userList.forEach(username => {
            const option = document.createElement('option');
            option.value = username;
            option.text = username;
            usernameSelectReason.add(option);
        });
    })
    .catch(error => {
        console.error('Error fetching user list:', error);
    });
