document.addEventListener('DOMContentLoaded', function () {
  var mainNav = document.getElementById('mainNav');

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var collapse = bootstrap.Collapse.getInstance(mainNav);
      if (collapse) collapse.hide();
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  var root = document.documentElement;
  var maxBlur = 28;
  var minBrightness = 0.35;
  var ticking = false;

  function updateScrollBlur() {
    var scrollableHeight = document.body.scrollHeight - window.innerHeight;
    var progress = scrollableHeight > 0 ? window.scrollY / (scrollableHeight * 0.75) : 0;
    progress = Math.max(0, Math.min(progress, 1));

    root.style.setProperty('--scroll-blur', (progress * maxBlur).toFixed(1) + 'px');
    root.style.setProperty('--scroll-brightness', (1 - progress * (1 - minBrightness)).toFixed(2));
    ticking = false;
  }

  var navbar = document.querySelector('.site-navbar');

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateScrollBlur();
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });

  updateScrollBlur();

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  var discoCarouselEl = document.getElementById('discoCarousel');
  var yearStripButtons = document.querySelectorAll('.disco-year-strip button');

  if (discoCarouselEl && yearStripButtons.length) {
    discoCarouselEl.addEventListener('slide.bs.carousel', function (e) {
      yearStripButtons.forEach(function (btn, i) {
        btn.classList.toggle('active', i === e.to);
      });
    });
  }

  var statNumbers = document.querySelectorAll('.stat-number');
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      statNumbers.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count-to'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var start = performance.now();

        function tick(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
      });
      statObserver.disconnect();
    });
  }, { threshold: 0.4 });

  var statsRow = document.querySelector('.stats-row');
  if (statsRow) statObserver.observe(statsRow);
});
