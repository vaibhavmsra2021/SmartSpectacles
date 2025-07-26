let bluetoothDevice;
let gattServer;
let wearTimeCharacteristic;

const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcdef01-1234-5678-1234-56789abcdef1";

const statusText = document.getElementById('status');
const wearTimeText = document.getElementById('wearTime');
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');

// Connect to Bluetooth Device
async function connect() {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        statusText.textContent = 'Status: Connecting...';
        gattServer = await bluetoothDevice.gatt.connect();

        const service = await gattServer.getPrimaryService(SERVICE_UUID);
        wearTimeCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        statusText.textContent = 'Status: Connected';
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;

        startNotifications();
    } catch (error) {
        console.error('Connection failed:', error);
        statusText.textContent = 'Status: Connection failed';
    }
}

// Start Notifications for Wear Time
async function startNotifications() {
    try {
        await wearTimeCharacteristic.startNotifications();
        wearTimeCharacteristic.addEventListener('characteristicvaluechanged', handleWearTimeUpdate);
    } catch (error) {
        console.error('Failed to start notifications:', error);
    }
}

// Handle Incoming Wear Time Data
function handleWearTimeUpdate(event) {
    const value = new TextDecoder().decode(event.target.value);
    wearTimeText.textContent = `Wear Time: ${value} seconds`;
}

// Disconnect from Bluetooth Device
function disconnect() {
    if (bluetoothDevice && bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
        statusText.textContent = 'Status: Disconnected';
        wearTimeText.textContent = 'Wear Time: 0 seconds';
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
    }
}

// Button Event Listeners
connectBtn.addEventListener('click', connect);
disconnectBtn.addEventListener('click', disconnect);
