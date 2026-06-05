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
  const resumeInput = document.getElementById('resume-file');
  const resumeCount = document.getElementById('resume-count');

  if (resumeInput && resumeCount) {
    resumeInput.addEventListener('change', () => {
      const count = resumeInput.files ? resumeInput.files.length : 0;
      resumeCount.textContent = `Attachments (${count})`;
    });
  }

  if (careersForm) {
    careersForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('careers-msg');
      const btn = document.getElementById('careers-btn');
      const captchaToken = window.grecaptcha ? grecaptcha.getResponse() : '';

      const showCareersMsg = (type, text) => {
        if (!msg) return;
        msg.textContent = text;
        msg.className = `form-message ${type}`;
      };

      if (!resumeInput || !resumeInput.files || resumeInput.files.length === 0) {
        showCareersMsg('err', 'Please attach your resume before submitting.');
        return;
      }

      if (!captchaToken) {
        showCareersMsg('err', 'Please complete the reCAPTCHA verification.');
        return;
      }

      const fd = new FormData(careersForm);
      fd.append('_subject', `Flytech Aerospace application - ${fd.get('role') || 'General'}`);
      fd.append('_template', 'table');
      fd.append('_captcha', 'false');

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
      }

      try {
        const res = await fetch('https://formsubmit.co/ajax/admin@flytech.aero', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd,
        });
        const data = await res.json();
        if (res.ok && (data.success === 'true' || data.success === true)) {
          showCareersMsg('ok', 'Application submitted. We will review your information shortly.');
          careersForm.reset();
          if (resumeCount) resumeCount.textContent = 'Attachments (0)';
          if (window.grecaptcha) grecaptcha.reset();
        } else {
          showCareersMsg('err', 'Something went wrong. Please email your resume to admin@flytech.aero.');
        }
      } catch {
        showCareersMsg('err', 'Network error. Please email your resume to admin@flytech.aero.');
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Submit Application ›';
      }
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

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google',
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
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
