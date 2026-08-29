// main.js — behaviors: page fade, reveal with stagger, navbar shadow

document.addEventListener('DOMContentLoaded', () => {
  // Page fade-in on load
  window.addEventListener('load', () => {
    document.querySelector('.page-fade')?.classList.add('visible');
  });

  const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
  const infoCards = Array.from(document.querySelectorAll('.info-card'));
  const modal = document.getElementById('sectionModal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.querySelector('.floating-modal__close');

  const modalContentMap = {
    'sobre-mi': `
      <div class="modal-content">
        <span class="eyebrow modal-content__eyebrow">Sobre mí</span>
        <h2 class="modal-content__title" id="modalTitle">Mi historia y enfoque</h2>
        <p class="modal-content__text">Soy un estudiante de sistemas que se quiere convertir en desarrollador web y diseñador enfocado en crear experiencias claras, modernas y funcionales. Me gusta combinar diseño visual con buenas prácticas de desarrollo para entregar productos que se sientan bien y funcionen bien.</p>
        <ul class="modal-content__list">
          <li>Diseño UI/UX con atención a la experiencia del usuario.</li>
          <li>Desarrollo front-end limpio, responsive y optimizado.</li>
          <li>Soluciones digitales pensadas para marcas y proyectos reales.</li>
        </ul>
      </div>
    `,
    'proyectos': `
      <div class="modal-content">
        <span class="eyebrow modal-content__eyebrow">Proyectos</span>
        <h2 class="modal-content__title" id="modalTitle">Trabajos destacados</h2>
        <p class="modal-content__text">He desarrollado experiencias digitales con enfoque en visual, claridad y rendimiento. Cada proyecto busca resolver necesidades reales con una estética cuidada y una estructura sólida.</p>
        <ul class="modal-content__list">
          <li>Landing pages premium y conversion-focused.</li>
          <li>Dashboards y apps con interacción funcional.</li>
          <li>Sistemas visuales y branding digital coherente.</li>
        </ul>
        <div class="modal-content__actions">
          <a href="#inicio" class="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    `,
    'contacto': `
      <div class="modal-content">
        <span class="eyebrow modal-content__eyebrow">Contacto</span>
        <h2 class="modal-content__title" id="modalTitle">Hablemos de tu proyecto</h2>
        <p class="modal-content__text">Si necesitas una presencia web moderna, interfaces limpias o soluciones digitales con personalidad, estoy listo para colaborar.</p>
        <div class="modal-content__actions">
          <a href="mailto:samuelbolano@email.com" class="btn btn-primary">Enviar correo</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" class="btn btn-outline-light">LinkedIn</a>
        </div>
      </div>
    `
  };

  const setActiveNav = (targetId) => {
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${targetId}`;
      link.classList.toggle('active', isActive);
    });
  };

  const setActiveCard = (targetId) => {
    infoCards.forEach(card => {
      const isActive = card.dataset.card === targetId;
      card.classList.toggle('card-selected', isActive);
    });
  };

  const openModal = (targetId) => {
    if (!modal || !modalContent) return;

    const content = modalContentMap[targetId];
    if (!content) return;

    modalContent.innerHTML = content;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    setActiveNav(targetId);
    setActiveCard(targetId);
  };

  const closeModal = () => {
    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  const goToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveNav('inicio');
    infoCards.forEach(card => card.classList.remove('card-selected'));
    closeModal();
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href')?.replace('#', '');
      if (!targetId) return;

      event.preventDefault();

      if (targetId === 'inicio') {
        goToHome();
        return;
      }

      openModal(targetId);
    });
  });

  infoCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.dataset.card) {
        openModal(card.dataset.card);
      }
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (card.dataset.card) {
          openModal(card.dataset.card);
        }
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      const closeButton = event.target instanceof HTMLElement ? event.target.closest('.floating-modal__close') : null;
      const isBackdrop = event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true';

      if (closeButton || isBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Reveal elements on scroll with stagger applied only to .reveal-stagger
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  const staggerEls = Array.from(document.querySelectorAll('.reveal-stagger'));
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let delay = 0;
        if (entry.target.classList.contains('reveal-stagger')) {
          const index = staggerEls.indexOf(entry.target);
          delay = Math.max(0, index) * 120; // 120ms stagger between staggered elements
        }
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Navbar shadow on scroll
  const nav = document.querySelector('.navbar');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('navbar-scrolled');
    else nav.classList.remove('navbar-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
