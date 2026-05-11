const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');
const Push = require('pushover-notifications');

// --- Configuration ---
const HA_ENTITIES = {
    'living-room': 'sensor.living_room_temperature',
    'study': 'sensor.study_temperature',
    'den': 'sensor.den_temperature',
    'drafty-window': 'sensor.draftywindowtempsensor_hpcloset_temperature',
    'loft': 'sensor.temperature_sensor_living_room_temperature'
};

const haApi = axios.create({
    baseURL: process.env.HA_URL,
    headers: {
        'Authorization': `Bearer ${process.env.HA_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

// Setup Pushover
const push = new Push({ 
    user: process.env.PUSHOVER_USER,
    token: process.env.PUSHOVER_TOKEN
});

// --- Existing Temperature Routes ---

router.get('/temperatures', async (req, res) => {

    const results = {};
    
    for (const [roomId, entityId] of Object.entries(HA_ENTITIES)) {
        try {
            const response = await haApi.get(`/api/states/${entityId}`);
            results[roomId] = {
                state: response.data.state,
                last_updated: response.data.last_updated
            };
        } catch (error) {
            // This logs exactly WHICH entity failed and why
            console.error(`[HA Error] Could not fetch ${entityId}. Status: ${error.response?.status}`);
            
            // Provide a fallback so the frontend still renders the other rooms
            results[roomId] = {
                state: "--", 
                last_updated: new Date().toISOString()
            };
        }
    }
    
    // Always return a 200 OK with whatever results we successfully gathered
    res.json(results);
});


/**
 * Route: GET /api/history/:room
 * Fetches historical state changes from Home Assistant and formats them for Chart.js
 */
router.get('/history/:room', async (req, res) => {
    const { room } = req.params;
    const hours = parseInt(req.query.hours) || 24;
    
    // Look up the real HA entity ID based on the room name
    const entityId = HA_ENTITIES[room];
    
    if (!entityId) {
        return res.status(404).json({ error: "Room not found" });
    }

    try {
        // 1. Calculate the start time based on the requested hours
        // HA requires an ISO 8601 formatted timestamp
        const startTime = moment().subtract(hours, 'hours').toISOString();
        
        // 2. Call Home Assistant's history endpoint
        const response = await haApi.get(`/api/history/period/${startTime}`, {
            params: {
                filter_entity_id: entityId,
                minimal_response: true // Tells HA we only need state and time, not all the extra attributes
            }
        });

        // 3. HA returns an array of arrays. The first array contains our entity's history.
        const historyData = response.data[0] || [];

        const labels = [];
        const data = [];

        // 4. Loop through the HA data and format it for the frontend chart
        historyData.forEach(point => {
            // Sometimes sensors briefly drop offline, reporting "unavailable" or "unknown".
            // We want to skip those so they don't break our graph line.
            if (point.state !== 'unavailable' && point.state !== 'unknown') {
                
                // Format the time label (e.g., "10:30 AM")
                const timeLabel = new Date(point.last_changed).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                labels.push(timeLabel);
                data.push(parseFloat(point.state).toFixed(1));
            }
        });

        // 5. Send it back to the browser!
        res.json({ labels, data });

    } catch (error) {
        console.error(`[HA History Error] Could not fetch history for ${room}:`, error.message);
        res.status(500).json({ error: "Failed to fetch history data" });
    }
});

// --- New Pushover Notification Route ---

/**
 * Route: POST /api/twine
 * Sends a notification when the door is opened
 */
router.post("/twine", function(req, res) {
    // Getting the time in NY and formatting it
    const dateOpened = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    const formattedDate = moment(new Date(dateOpened)).format("lll");

    // Pulling temp from query params as per your legacy setup (e.g., /api/twine?temp=22)
    const temp = req.query.temp || "unknown";

    const msg = {
        message: `Opened at ${formattedDate}\nThe temperature was ${temp} Celsius`,
        title: `The door has been opened`,
        device: ["theWife", "pixel6"] // Specified target devices
    };

    push.send(msg, function(err, result) {
        if (err) {
            console.error("Pushover Error: ", err);
            // We still send the 200 response so the calling device doesn't hang, 
            // but we log the error on the server.
            return res.status(500).send("Message failed to send via Pushover");
        }
        console.log("Pushover success:", result);
        res.send("Message received and notification sent");
    });
});

module.exports = router;