let currentRoomId = 'living-room';
let currentHours = 24;
let chartInstance = null;

// Handle selecting a room card
function selectRoom(roomId, roomName) {
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById('card-' + roomId).classList.add('active');
    document.getElementById('chart-room-name').innerText = roomName;
    
    currentRoomId = roomId;
    updateChart();
}

// Handle selecting a timeframe
function setTimeframe(hours) {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${hours}h`).classList.add('active');
    
    currentHours = hours;
    updateChart();
}

// Fetch historical data from our secure backend
async function updateChart() {
    try {
        const response = await fetch(`/api/history/${currentRoomId}?hours=${currentHours}`);
        const chartData = await response.json();

        const ctx = document.getElementById('tempChart').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Temperature °F',
                    data: chartData.data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    pointRadius: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        beginAtZero: false,
                        grid: { borderDash: [5, 5] }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (error) {
        console.error("Error updating chart:", error);
    }
}

// Fetch live data from our secure backend
async function fetchLiveTemperatures() {
    const btn = document.getElementById('refreshBtn');
    btn.innerHTML = '⟳ Refreshing...';

    try {
        const response = await fetch('/api/temperatures');
        const data = await response.json();
        
        // Update each room card based on the backend response
        for (const [roomId, sensorData] of Object.entries(data)) {
            const tempElement = document.getElementById(`temp-${roomId}`);
            const timeElement = document.getElementById(`time-${roomId}`);
            
            if (tempElement && timeElement) {
                tempElement.innerText = parseFloat(sensorData.state).toFixed(1);
                
                const updated = new Date(sensorData.last_updated);
                timeElement.innerText = `Last updated: ${updated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }
        }
    } catch (error) {
        console.error("Error fetching live temperatures:", error);
    } finally {
        btn.innerHTML = '⟳ Refresh';
    }
}

// Initialize on page load
window.onload = () => {
    fetchLiveTemperatures();
    updateChart();
    
    // Auto-refresh live temperatures every 5 minutes
    setInterval(fetchLiveTemperatures, 300000); 
};


// Helper: Optional conversion logic 
// (If HA already sends Celsius, this just ensures the formatting is clean)
function formatTemp(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return "--";
    
    // If you ever need to convert F to C, use: (num - 32) * 5/9
    return num.toFixed(1); 
}

async function fetchLiveTemperatures() {
    const btn = document.getElementById('refreshBtn');
    btn.innerHTML = '⟳ Refreshing...';

    try {
        const response = await fetch('/api/temperatures');
        const data = await response.json();
        
        for (const [roomId, sensorData] of Object.entries(data)) {
            const tempElement = document.getElementById(`temp-${roomId}`);
            const timeElement = document.getElementById(`time-${roomId}`);
            
            if (tempElement) {
                // Use the helper here
                tempElement.innerText = formatTemp(sensorData.state);
                
                const updated = new Date(sensorData.last_updated);
                timeElement.innerText = `Last updated: ${updated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }
        }
    } catch (error) {
        console.error("Error fetching live temperatures:", error);
    } finally {
        btn.innerHTML = '⟳ Refresh';
    }
}

// Update the Chart label to Celsius as well
async function updateChart() {
    try {
        const response = await fetch(`/api/history/${currentRoomId}?hours=${currentHours}`);
        const chartData = await response.json();
        const ctx = document.getElementById('tempChart').getContext('2d');
        
        if (chartInstance) { chartInstance.destroy(); }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Temperature °C', // Updated label
                    data: chartData.data,
                    // ... style settings stay the same
                }]
            },
            options: { /* ... options remain the same */ }
        });
    } catch (error) {
        console.error("Error updating chart:", error);
    }
}