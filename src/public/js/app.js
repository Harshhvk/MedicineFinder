// src/public/js/app.js
document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    const toastSpinner = document.getElementById('toastSpinner');

    function showToast(msg, opts = {}) {
        toastText.textContent = msg;
        if (opts.loading) toastSpinner.style.display = 'inline-block'; else toastSpinner.style.display = 'none';
        toast.style.display = 'flex';
        if (!opts.persistent) setTimeout(() => toast.style.display = 'none', opts.timeout || 3000);
    }

    document.getElementById('submitBtn').addEventListener('click', async () => {
        const name = document.getElementById('medicineName').value.trim();
        const notes = document.getElementById('notes').value;
        const img = document.getElementById('imageInput').files[0] || null;
        const token = localStorage.getItem('consumerToken');
        if (!token) return showToast('Login required: open Consumer Dashboard and login/register');

        const fd = new FormData();
        fd.append('medicineName', name);
        fd.append('notes', notes);
        if (img) fd.append('image', img);

        showToast('Submitting request...', { loading: true, persistent: true });
        try {
            const res = await fetch('/api/consumer/request/create', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token }, body: fd });
            const data = await res.json();
            if (!res.ok) { showToast(data.message || 'Error'); return; }
            showToast('Request created — sent to ' + (data.sentTo || 0) + ' sellers');
        } catch (e) { showToast('Submit failed'); }
    });

    document.getElementById('findBtn').addEventListener('click', async () => {
        const currentLat = /* get current latitude */;
        const currentLng = /* get current longitude */;
        const km = 5; // default nearby distance
        showToast('Searching nearby sellers...', { loading: true, persistent: true });
        try {
            const res = await fetch(`/api/sellers/nearby?lat=${currentLat}&lng=${currentLng}&km=${km}`);
            const data = await res.json();
            const container = document.getElementById('nearbyContainer');
            container.innerHTML = '';
            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = '<div class="small">No sellers within ' + km + ' km</div>';
            } else {
                const list = document.createElement('div');
                list.className = 'sellers-list';
                data.forEach(s => {
                    const el = document.createElement('div');
                    el.className = 'seller';
                    el.innerHTML = `<div><div style="font-weight:700">${s.storeName}</div><div class="small">~${s.distanceKm.toFixed(2)} km</div></div><div><a class="btn ghost" href="https://www.google.com/maps/search/?api=1&query=${s.location?.lat || ''},${s.location?.lng || ''}" target="_blank">Navigate</a></div>`;
                    list.appendChild(el);
                });
                container.appendChild(list);
            }
        } catch (e) { showToast('Failed to fetch sellers'); }
    });
});