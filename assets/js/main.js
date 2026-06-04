document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('open'));

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Flytech Aerospace request - ${data.get('service') || 'General Inquiry'}`);
      const body = encodeURIComponent(`Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\nService: ${data.get('service') || ''}\n\nMessage:\n${data.get('message') || ''}`);
      window.location.href = `mailto:admin@flytech.aero?subject=${subject}&body=${body}`;
    });
  }
  const airports = {
    SAP: { lat: 15.4526, lng: -87.9236, label: 'SAP - San Pedro Sula, Honduras' },
    MGA: { lat: 12.1415, lng: -86.1681, label: 'MGA - Managua, Nicaragua' },
    SJO: { lat: 9.9939, lng: -84.2088, label: 'SJO - San Jose, Costa Rica' },
    SDQ: { lat: 18.4297, lng: -69.6689, label: 'SDQ - Santo Domingo, D.R.' },
    PUJ: { lat: 18.5674, lng: -68.3634, label: 'PUJ - Punta Cana, D.R.' },
  };

  const mapEl = document.getElementById('airport-map');
  if (mapEl && window.L) {
    const airportMap = L.map(mapEl, { scrollWheelZoom: false }).setView([13.5, -78], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(airportMap);

    const icon = L.divIcon({
      className: '',
      html: '<div class="map-pin"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const markers = {};
    Object.entries(airports).forEach(([code, airport]) => {
      markers[code] = L.marker([airport.lat, airport.lng], { icon })
        .addTo(airportMap)
        .bindPopup(`<strong>${airport.label}</strong>`);
    });

    document.querySelectorAll('[data-airport]').forEach((item) => {
      item.addEventListener('click', () => {
        const code = item.dataset.airport;
        const airport = airports[code];
        if (!airport) return;
        airportMap.flyTo([airport.lat, airport.lng], 10, { duration: 1.2 });
        markers[code].openPopup();
        document.querySelectorAll('[data-airport]').forEach((el) => el.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  }
});
