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

  const careersForm = document.querySelector('[data-careers-form]');
  if (careersForm) {
    careersForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(careersForm);
      const subject = encodeURIComponent(`Flytech Aerospace application - ${data.get('role') || 'General'}`);
      const body = encodeURIComponent(`Name: ${data.get('name') || ''}\nPhone: ${data.get('phone') || ''}\nAddress: ${data.get('address') || ''}\nLicense: ${data.get('license') || ''}\nRole: ${data.get('role') || ''}\n\nMessage:\n${data.get('message') || ''}`);
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
  const mapLink = document.querySelector('.map-link');
  const googleMapSearchUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  if (mapEl && window.L) {
    const airportMap = L.map(mapEl, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([13.8, -78.5], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(airportMap);

    const pinIcon = L.divIcon({
      className: 'google-style-marker',
      html: '<span></span>',
      iconSize: [34, 44],
      iconAnchor: [17, 42],
      popupAnchor: [0, -38],
    });

    const markers = {};
    const bounds = [];
    Object.entries(airports).forEach(([code, airport]) => {
      const marker = L.marker([airport.lat, airport.lng], { icon: pinIcon })
        .addTo(airportMap)
        .bindPopup(`<strong>${airport.label}</strong>`);
      markers[code] = marker;
      bounds.push([airport.lat, airport.lng]);
    });

    if (bounds.length) {
      airportMap.fitBounds(bounds, { padding: [42, 42] });
    }

    document.querySelectorAll('[data-airport]').forEach((item) => {
      item.addEventListener('click', () => {
        const code = item.dataset.airport;
        const airport = airports[code];
        if (!airport) return;
        airportMap.flyTo([airport.lat, airport.lng], 9, { duration: 1 });
        markers[code].openPopup();
        if (mapLink) mapLink.href = googleMapSearchUrl(airport.label);
        document.querySelectorAll('[data-airport]').forEach((el) => el.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  }

});
