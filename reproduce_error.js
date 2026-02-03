
// using global fetch
// Actually node 24 has fetch.

const BASE_URL = 'http://localhost:5000';

async function main() {
    console.log('Logging in...');
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'customer', password: 'customer123' })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const cookie = loginRes.headers.get('set-cookie');
    console.log('Logged in. Cookie:', cookie);

    console.log('Fetching slots...');
    const slotsRes = await fetch(`${BASE_URL}/api/slots`, {
        headers: { 'Cookie': cookie }
    });

    if (!slotsRes.ok) {
        console.error('Fetch slots failed:', await slotsRes.text());
        return;
    }

    const slots = await slotsRes.json();
    if (slots.length === 0) {
        console.error('No slots found');
        return;
    }

    const slotId = slots[0]._id; // Mongoose uses _id
    console.log(`Booking slot ${slotId}...`);

    const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        },
        body: JSON.stringify({ slotId: slotId })
    });

    const body = await bookingRes.json();
    console.log('Booking Response:', JSON.stringify(body, null, 2));
}

main().catch(console.error);
