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
    SAP: { label: 'SAP - San Pedro Sula, Honduras', query: 'Ramon Villeda Morales International Airport SAP San Pedro Sula Honduras' },
    MGA: { label: 'MGA - Managua, Nicaragua', query: 'Augusto C. Sandino International Airport MGA Managua Nicaragua' },
    SJO: { label: 'SJO - San Jose, Costa Rica', query: 'Juan Santamaria International Airport SJO San Jose Costa Rica' },
    SDQ: { label: 'SDQ - Santo Domingo, D.R.', query: 'Las Americas International Airport SDQ Santo Domingo Dominican Republic' },
    PUJ: { label: 'PUJ - Punta Cana, D.R.', query: 'Punta Cana International Airport PUJ Dominican Republic' },
  };

  const mapFrame = document.getElementById('airport-map-frame');
  const mapLink = document.querySelector('.map-link');
  const googleMapUrl = (query) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const googleMapSearchUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  if (mapFrame) {
    document.querySelectorAll('[data-airport]').forEach((item) => {
      item.addEventListener('click', () => {
        const airport = airports[item.dataset.airport];
        if (!airport) return;
        mapFrame.src = googleMapUrl(airport.query);
        if (mapLink) mapLink.href = googleMapSearchUrl(airport.query);
        document.querySelectorAll('[data-airport]').forEach((el) => el.classList.remove('selected'));
        item.classList.add('selected');
      });
    });
  }
});
