/* ==========================================================================
   Clube Futebol Atlético Votorantim - Interactive JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Toast Notification Helper
  function showToast(message, iconClass = 'fa-circle-check', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${iconClass}" style="color: var(--primary-gold); font-size: 1.2rem;"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // 2. Scroll Progress Bar & Navbar State
  const progressBar = document.getElementById('scrollProgressBar');
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll progress percentage
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Navbar background transition
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Section Link Highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // 3. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 4. Gallery Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 5. Lightbox Carousel Modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let currentGalleryIndex = 0;

  function updateModalImage(index) {
    if (galleryCards.length === 0) return;
    currentGalleryIndex = (index + galleryCards.length) % galleryCards.length;
    const card = galleryCards[currentGalleryIndex];
    const img = card.querySelector('img');
    const title = card.querySelector('.gallery-title')?.innerText || '';
    
    if (modalImg && img) {
      modalImg.src = img.src;
    }
    if (modalCaption) {
      modalCaption.innerText = title;
    }
  }

  galleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      currentGalleryIndex = idx;
      updateModalImage(currentGalleryIndex);
      modal?.classList.add('active');
    });
  });

  if (modalPrev) {
    modalPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalImage(currentGalleryIndex - 1);
    });
  }

  if (modalNext) {
    modalNext.addEventListener('click', (e) => {
      e.stopPropagation();
      updateModalImage(currentGalleryIndex + 1);
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal?.classList.remove('active');
    });
  }

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!modal?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') {
      updateModalImage(currentGalleryIndex - 1);
    } else if (e.key === 'ArrowRight') {
      updateModalImage(currentGalleryIndex + 1);
    } else if (e.key === 'Escape') {
      modal.classList.remove('active');
    }
  });

  // 6. Match Countdown Timer (Dynamic Tick)
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');

  // Target match date: 4 days from now
  const targetMatchTime = new Date().getTime() + (4 * 24 * 60 * 60 * 1000) + (12 * 60 * 60 * 1000);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetMatchTime - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (cdDays) cdDays.innerText = days < 10 ? '0' + days : days;
    if (cdHours) cdHours.innerText = hours < 10 ? '0' + hours : hours;
    if (cdMins) cdMins.innerText = minutes < 10 ? '0' + minutes : minutes;
    if (cdSecs) cdSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 7. Match Tab Switcher (Upcoming vs Results)
  const matchTabBtns = document.querySelectorAll('.match-tab-btn');
  const upcomingMatchesGrid = document.getElementById('upcomingMatchesGrid');
  const pastMatchesGrid = document.getElementById('pastMatchesGrid');

  matchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      matchTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.getAttribute('data-tab');
      if (tab === 'upcoming') {
        if (upcomingMatchesGrid) upcomingMatchesGrid.style.display = 'grid';
        if (pastMatchesGrid) pastMatchesGrid.style.display = 'none';
      } else {
        if (upcomingMatchesGrid) upcomingMatchesGrid.style.display = 'none';
        if (pastMatchesGrid) pastMatchesGrid.style.display = 'grid';
      }
    });
  });

  // 8. Fan Voting Widget
  const pollBtns = document.querySelectorAll('.poll-btn');
  let hasVoted = false;

  pollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasVoted) {
        showToast('Você já votou nesta enquete!', 'fa-circle-info');
        return;
      }

      hasVoted = true;
      btn.classList.add('voted');
      const playerName = btn.getAttribute('data-player');

      showToast(`Voto computado em: ${playerName}! Obrigado por participar.`, 'fa-trophy');
    });
  });

  // 9. Contact & Member Form Submission
  const contactForm = document.getElementById('clubContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        submitBtn.style.background = '#10b981';
        submitBtn.style.color = '#fff';

        showToast('Mensagem enviada com sucesso! A diretoria do C.A. Votorantim entrará em contato.', 'fa-paper-plane');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3500);
      }, 1000);
    });
  }

});
