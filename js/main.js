// Yantra Packs — main.js

// Mobile hamburger
document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('mb');
  var menu = document.getElementById('mm');
  if (btn && menu) {
    btn.addEventListener('click', function() { menu.classList.toggle('open'); });
    document.addEventListener('click', function(e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) menu.classList.remove('open');
    });
  }

  // Navbar scroll effect
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.style.boxShadow = window.scrollY > 60 ? '0 2px 24px rgba(0,0,0,0.10)' : 'none';
    });
  }

  // Scroll animations
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fu, .fu2, .fu3').forEach(function(el) { obs.observe(el); });

  // Industry carousel — infinite loop via card cloning
  var indTrack = document.getElementById('ind-track');
  if (indTrack) {
    var indDots = document.querySelectorAll('.ind-dot');
    var indPrev = document.getElementById('ind-prev');
    var indNext = document.getElementById('ind-next');
    // Clone all original cards and append for seamless loop
    var origCards = Array.from(indTrack.querySelectorAll('.ind-card'));
    var indTotal = origCards.length;
    origCards.forEach(function(c) { indTrack.appendChild(c.cloneNode(true)); });
    var indCurrent = 0;
    function indCardW() { return indTrack.querySelector('.ind-card').offsetWidth + 20; }
    function indSetDot(idx) {
      var dot = ((idx % indTotal) + indTotal) % indTotal;
      indDots.forEach(function(d, i) { d.classList.toggle('active', i === dot); });
    }
    function indGoTo(idx, animate) {
      if (animate === false) indTrack.style.transition = 'none';
      else indTrack.style.transition = 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)';
      indCurrent = idx;
      indTrack.style.transform = 'translateX(-' + (indCurrent * indCardW()) + 'px)';
      indSetDot(indCurrent);
    }
    // After transition ends, silently reset if we've entered the cloned zone
    indTrack.addEventListener('transitionend', function() {
      if (indCurrent >= indTotal) indGoTo(indCurrent - indTotal, false);
      if (indCurrent < 0)        indGoTo(indCurrent + indTotal, false);
    });
    if (indPrev) indPrev.addEventListener('click', function() { indGoTo(indCurrent - 1, true); });
    if (indNext) indNext.addEventListener('click', function() { indGoTo(indCurrent + 1, true); });
    indDots.forEach(function(d, i) { d.addEventListener('click', function() { indGoTo(i, true); }); });
    // Touch/swipe
    var indStartX = 0;
    indTrack.addEventListener('touchstart', function(e) { indStartX = e.touches[0].clientX; }, { passive: true });
    indTrack.addEventListener('touchend', function(e) {
      var diff = indStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) indGoTo(indCurrent + (diff > 0 ? 1 : -1), true);
    });
    indGoTo(0, false);
  }

  // Dashboard col on desktop
  var dc = document.getElementById('dashboard-col');
  if (dc && window.innerWidth >= 768) dc.style.display = 'block';

  // Customer grid responsive
  var cg = document.getElementById('customer-grid');
  if (cg) {
    if (window.innerWidth < 480) cg.style.gridTemplateColumns = 'repeat(2,1fr)';
    else if (window.innerWidth < 768) cg.style.gridTemplateColumns = 'repeat(3,1fr)';
  }

  // Tab switching (technology page)
  var tabs = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = this.dataset.tab;
      tabs.forEach(function(t) { t.classList.remove('active'); });
      panels.forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
  if (tabs.length) tabs[0].classList.add('active');
  if (panels.length) panels[0].classList.add('active');

  // Animated counters
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var duration = 1800;
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = target * ease;
      el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counterObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !e.target.classList.contains('counted')) {
        e.target.classList.add('counted');
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(function(el) { counterObs.observe(el); });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = this.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Contact form handler
  // TODO: Replace the fetch URL below with your actual form endpoint.
  // Options: Formspree (https://formspree.io), EmailJS, or your own backend API.
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = document.getElementById('submit-btn');
      var msg = document.getElementById('form-message');
      var endpoint = contactForm.getAttribute('action') || '';

      // Collect form data
      var data = new FormData(contactForm);

      if (!endpoint) {
        // No endpoint configured yet — show a clear placeholder message
        msg.className = 'form-message error';
        msg.textContent = '⚠️ Form endpoint not configured. Please set the action attribute on the form or wire up a backend. (Contact: sales@yantrapacks.com)';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      msg.className = 'form-message';
      msg.textContent = '';

      fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(res) {
        if (res.ok) {
          msg.className = 'form-message success';
          msg.textContent = '✅ Thank you! We\'ll be in touch within 4 business hours.';
          contactForm.reset();
        } else {
          throw new Error('Server error');
        }
      })
      .catch(function() {
        msg.className = 'form-message error';
        msg.textContent = '❌ Something went wrong. Please email us directly at sales@yantrapacks.com';
      })
      .finally(function() {
        btn.disabled = false;
        btn.textContent = 'Request a Demo →';
      });
    });
  }
});
