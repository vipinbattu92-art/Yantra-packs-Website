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
});
