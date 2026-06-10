document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('open'));

  const testEmail = 'ing.dlopez@gmail.com';
  const parseFormSubmitResponse = async (res) => {
    const raw = await res.text();
    try {
      return JSON.parse(raw);
    } catch {
      return { success: false, message: raw || res.statusText };
    }
  };
  const formSubmitMessage = (data) => data.message || data.error || 'FormSubmit did not accept the submission. Check whether the destination email is activated.';
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('contact-msg');
      const contactBtn = document.getElementById('contact-btn');
      const showContactMsg = (type, text) => {
        if (!msg) return;
        msg.textContent = text;
        msg.className = `form-message ${type}`;
      };

      const fd = new FormData(form);
      fd.append('_subject', `Flytech Aerospace contact - ${fd.get('service') || 'General Inquiry'}`);
      fd.append('_template', 'table');
      fd.append('_captcha', 'false');

      if (contactBtn) {
        contactBtn.disabled = true;
        contactBtn.textContent = 'Sending...';
      }

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(testEmail)}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd,
        });
        const data = await parseFormSubmitResponse(res);
        if (res.ok && (data.success === 'true' || data.success === true)) {
          showContactMsg('ok', 'Message sent. Please check ing.dlopez@gmail.com.');
          form.reset();
        } else {
          showContactMsg('err', formSubmitMessage(data));
        }
      } catch {
        showContactMsg('err', 'Network error. Please email ing.dlopez@gmail.com directly.');
      }

      if (contactBtn) {
        contactBtn.disabled = false;
        contactBtn.textContent = '✈ Send Message';
      }
    });
  }
  const careersForm = document.querySelector('[data-careers-form]');
  const resumeInput = document.getElementById('resume-file');
  const resumeCount = document.getElementById('resume-count');

  const allowedResumeExtensions = ['pdf', 'doc', 'docx'];
  const allowedResumeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const maxResumeSize = 5 * 1024 * 1024;

  const validateResumeFile = () => {
    if (!resumeInput || !resumeInput.files || resumeInput.files.length === 0) {
      return 'Please attach your resume before submitting.';
    }

    const file = resumeInput.files[0];
    const extension = (file.name.split('.').pop() || '').toLowerCase();
    const hasAllowedExtension = allowedResumeExtensions.includes(extension);
    const hasAllowedType = !file.type || allowedResumeTypes.includes(file.type);

    if (!hasAllowedExtension || !hasAllowedType) {
      resumeInput.value = '';
      if (resumeCount) resumeCount.textContent = 'Attachments (0)';
      return 'Please attach your resume as a PDF or Word document (.pdf, .doc, .docx).';
    }

    if (file.size > maxResumeSize) {
      resumeInput.value = '';
      if (resumeCount) resumeCount.textContent = 'Attachments (0)';
      return 'Please attach a resume smaller than 5 MB.';
    }

    return '';
  };

  if (resumeInput && resumeCount) {
    resumeInput.addEventListener('change', () => {
      const error = validateResumeFile();
      if (error) {
        const msg = document.getElementById('careers-msg');
        if (msg) {
          msg.textContent = error;
          msg.className = 'form-message err';
        }
        return;
      }

      const file = resumeInput.files[0];
      resumeCount.textContent = file ? file.name : 'Attachments (0)';
    });
  }
  if (careersForm) {
    const msg = document.getElementById('careers-msg');
    const careersBtn = document.getElementById('careers-btn');
    const showCareersMsg = (type, text) => {
      if (!msg) return;
      msg.textContent = text;
      msg.className = `form-message ${type}`;
    };

    careersForm.addEventListener('submit', (e) => {
      const resumeError = validateResumeFile();
      if (resumeError) {
        e.preventDefault();
        showCareersMsg('err', resumeError);
        return;
      }

      if (careersBtn) {
        careersBtn.disabled = true;
        careersBtn.textContent = 'Submitting...';
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
