/* GreenRoot Agri Supply: vanilla JS, organised into small modules. */
(() => {
  'use strict';

  // ===== Data =====
  const CATEGORIES = ['Seeds & Seedlings', 'Fertilizers', 'Animal Feed', 'Farm Equipment', 'Agrochemicals', 'Irrigation Supplies', 'Livestock Supplies', 'Agricultural Tools'];
  const COLORS = ['#3f8f3a', '#14432a', '#a8792a', '#5b6b3a', '#7a4b2a', '#2c6e8a', '#8a5a44', '#4d5b52'];
  const PRODUCTS = [
    {
      id: 1,
      name: 'Hybrid Maize Seed 10kg',
      category: CATEGORIES[0],
      price: 28,
      availability: 'In stock',
      specs: ['Yield: 6-8 t/ha', 'Maturity: 110 days', 'Germination: 95%']
    },
    {
      id: 2,
      name: 'Tomato Seedling Tray (72)',
      category: CATEGORIES[0],
      price: 24,
      availability: 'Limited',
      specs: ['Variety: Roma VF', 'Ready in 4 weeks', 'Disease-screened']
    },
    {
      id: 3,
      name: 'NPK 15-15-15 50kg',
      category: CATEGORIES[1],
      price: 32,
      availability: 'In stock',
      specs: ['Granular', 'Suits cereals, vegetables', 'Bag: 50kg']
    },
    {
      id: 4,
      name: 'Organic Compost 25kg',
      category: CATEGORIES[1],
      price: 12,
      availability: 'In stock',
      specs: ['Matured 90 days', 'pH 6.8', 'Weed-free']
    },
    {
      id: 5,
      name: 'Broiler Starter Feed 25kg',
      category: CATEGORIES[2],
      price: 21,
      availability: 'In stock',
      specs: ['Protein: 22%', 'Age: 0-3 weeks', 'Crumble form']
    },
    {
      id: 6,
      name: 'Dairy Cattle Concentrate',
      category: CATEGORIES[2],
      price: null,
      availability: 'Limited',
      specs: ['Protein: 18%', 'Bulk pallets only', 'Custom blends']
    },
    {
      id: 7,
      name: '25HP Walk-Behind Tractor',
      category: CATEGORIES[3],
      price: null,
      availability: 'Pre-order',
      specs: ['Diesel engine', 'Tiller and trailer included', '12-month warranty']
    },
    {
      id: 8,
      name: 'Knapsack Sprayer 16L',
      category: CATEGORIES[3],
      price: 45,
      availability: 'In stock',
      specs: ['Manual pump', 'Brass nozzle', 'Capacity: 16L']
    },
    {
      id: 9,
      name: 'Glyphosate Herbicide 5L',
      category: CATEGORIES[4],
      price: 26,
      availability: 'In stock',
      specs: ['Non-selective', '480 g/L', 'Licensed handlers only']
    },
    {
      id: 10,
      name: 'Drip Irrigation Kit 1 acre',
      category: CATEGORIES[5],
      price: 210,
      availability: 'Limited',
      specs: ['Drippers at 30cm', 'Filter and fittings', 'Saves up to 60% water']
    },
    {
      id: 11,
      name: 'Poultry Drinker Set (10)',
      category: CATEGORIES[6],
      price: 38,
      availability: 'In stock',
      specs: ['Automatic nipple', 'UV-resistant', '10 units']
    },
    {
      id: 12,
      name: 'Steel Hoe and Cutlass Set',
      category: CATEGORIES[7],
      price: 15,
      availability: 'In stock',
      specs: ['Carbon steel', 'Hardwood handle', 'Set of 2']
    }
  ];
  const TESTIMONIALS = [
    '"Our seed and fertilizer arrive before planting, every season." Adaeze, maize farmer',
    '"Wholesale pricing let us stock 30% more without extra credit." Musa, agro-dealer',
    '"Consistent feed quality has cut our flock losses." Grace, poultry processor'
  ];

  // ===== State and helpers =====
  const state = {
    query: '',
      category: 'all',
      availability: 'all', sort: 'featured', inquiry: []
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const formatPrice = (p) => (p === null ? 'Request quote' : `$${p.toFixed(2)}`);
  const slug = (text) => text.toLowerCase().replace(/[^a-z]+/g, '-');

  // ===== Toast =====
  let toastTimer;

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ===== Navigation =====
  function initNav() {
    const toggle = $('.nav-toggle');
    const links = $('#nav-links');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
    $('#search-btn').addEventListener('click', () => {
      $('#products').scrollIntoView();
      $('#search-input').focus();
    });
  }

  // ===== Catalog: filter, sort, render =====
  function getVisibleProducts() {
    const q = state.query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => (state.category === 'all' || p.category === state.category) &&
      (state.availability === 'all' || p.availability === state.availability) &&
      (!q || `${p.name} ${p.category}`.toLowerCase().includes(q)));
    const price = (p) => (p.price === null ? Infinity : p.price);
    if (state.sort === 'name')
      list.sort((a, b) => a.name.localeCompare(b.name));
    if (state.sort === 'price-asc')
      list.sort((a, b) => price(a) - price(b));
    if (state.sort === 'price-desc')
      list.sort((a, b) => price(b) - price(a));
    return list;
  }

  function renderProducts() {
    const list = getVisibleProducts();
    $('#result-count').textContent = `${list.length} product${list.length === 1 ? '' : 's'} found`;
    $('#product-grid').innerHTML = list.length ? list.map((p) => `
      <article class="product">
        <div class="product-img" style="background:${COLORS[CATEGORIES.indexOf(p.category)]}">${p.name[0]}</div>
        <div class="product-body">
          <span class="tag">${p.category}</span>
          <h3>${p.name}</h3>
          <span class="status ${slug(p.availability)}">${p.availability}</span>
          <span class="price">${formatPrice(p.price)}</span>
          <div class="actions">
            <button class="btn btn-ghost dark" data-view="${p.id}">Quick view</button>
            <button class="btn btn-accent" data-add="${p.id}">Add to inquiry</button>
          </div>
        </div>
      </article>`).join('') : '<p>No products match. Try a different search or reset the filters.</p>';
  }

  function initCatalog() {
    const catSelect = $('#category-filter');
    catSelect.innerHTML = '<option value="all">All categories</option>' + CATEGORIES.map((c) => `<option>${c}</option>`).join('');
    $('#category-chips').innerHTML = CATEGORIES.map((c) => `<button class="chip" data-cat="${c}">${c}</button>`).join('');
    const setCategory = (value) => {
      state.category = value;
      catSelect.value = value;
      $$('.chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.cat === value));
      renderProducts();
    };
    $('#category-chips').addEventListener('click', (e) => {
      if (e.target.dataset.cat) {
        setCategory(e.target.dataset.cat);
        $('#products').scrollIntoView();
      }
    });
    catSelect.addEventListener('change', (e) => setCategory(e.target.value));
    $('#search-input').addEventListener('input', (e) => {
      state.query = e.target.value;
      renderProducts();
    });
    $('#availability-filter').addEventListener('change', (e) => {
      state.availability = e.target.value;
      renderProducts();
    });
    $('#sort-select').addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderProducts();
    });
    $('#reset-filters').addEventListener('click', () => {
      Object.assign(state, {
        query: '',
      availability: 'all', sort: 'featured'
      });
      $('#search-input').value = '';
      $('#availability-filter').value = 'all';
      $('#sort-select').value = 'featured';
      setCategory('all');
    });
    $('#product-grid').addEventListener('click', (e) => {
      if (e.target.dataset.add)
        addToInquiry(Number(e.target.dataset.add));
      if (e.target.dataset.view)
        openModal(Number(e.target.dataset.view));
    });
    renderProducts();
  }

  // ===== Quick-view modal =====
  function openModal(id) {
    const p = PRODUCTS.find((item) => item.id === id);
    $('#modal-content').innerHTML = `
      <span class="tag">${p.category}</span><h3 id="modal-title">${p.name}</h3>
      <p class="price">${formatPrice(p.price)} &middot; ${p.availability}</p>
      <ul class="spec-list">${p.specs.map((s) => `<li>${s}</li>`).join('')}</ul>
      <button class="btn btn-accent" data-add="${p.id}">Add to inquiry</button>`;
    $('#modal').hidden = false;
    $('.modal-close').focus();
  }

  function initModal() {
    const modal = $('#modal');
    const close = () => {
      modal.hidden = true;
    };
    $('.modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => {
      if (e.target === modal)
        close();
      if (e.target.dataset.add) {
        addToInquiry(Number(e.target.dataset.add));
        close();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape')
        close();
    });
  }

  // ===== Inquiry cart =====
  function addToInquiry(id) {
    const existing = state.inquiry.find((item) => item.id === id);
    if (existing)
      existing.qty += 1;
    else
      state.inquiry.push({
        id, qty: 1
      });
    renderInquiry();
    showToast('Added to your inquiry');
  }

  function renderInquiry() {
    $('#cart-count').textContent = state.inquiry.length;
    $('#inquiry-list').innerHTML = state.inquiry.length ? state.inquiry.map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      return `
          <li>
            <span>${p.name}</span>
            <input type="number" min="1" value="${item.qty}" data-qty="${item.id}" aria-label="Quantity for ${p.name}">
            <button data-remove="${item.id}" aria-label="Remove ${p.name}">&times;</button>
          </li>`;
    }).join('') : '<li>No products yet. Add some from the catalog.</li>';
  }

  function initInquiry() {
    const list = $('#inquiry-list');
    list.addEventListener('input', (e) => {
      const item = state.inquiry.find((x) => x.id === Number(e.target.dataset.qty));
      if (item)
        item.qty = Math.max(1, Number(e.target.value) || 1);
    });
    list.addEventListener('click', (e) => {
      if (e.target.dataset.remove) {
        state.inquiry = state.inquiry.filter((x) => x.id !== Number(e.target.dataset.remove));
        renderInquiry();
      }
    });
    renderInquiry();
  }

  // ===== Form validation =====
  function validateForm(form) {
    let valid = true;
    $$('input[required], textarea[required]', form).forEach((field) => {
      const error = $('.error', field.parentElement);
      let message = '';
      if (!field.value.trim())
        message = 'This field is required.';
      else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value))
        message = 'Enter a valid email address.';
      field.classList.toggle('invalid', Boolean(message));
      error.textContent = message;
      if (message)
        valid = false;
    });
    return valid;
  }

  function initForms() {
    $('#quote-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(e.target))
        return showToast('Fix the highlighted fields');
      if (!state.inquiry.length)
        return showToast('Add at least one product first');
      const confirmation = $('#quote-confirmation');
      confirmation.textContent = `Thanks ${e.target.name.value}. We received ${state.inquiry.length} item(s) and will email a quote within one business day.`;
      confirmation.hidden = false;
      e.target.reset();
      state.inquiry = [];
      renderInquiry();
      showToast('Quote request sent');
    });
    $('#contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(e.target))
        return showToast('Fix the highlighted fields');
      e.target.reset();
      showToast('Message sent. We will reply soon.');
    });
  }

  // ===== FAQ accordion =====
  function initFaq() {
    $$('.faq-q').forEach((button) => button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !open);
      answer.style.maxHeight = open ? 0 : `${answer.scrollHeight}px`;
    }));
  }

  // ===== Testimonials slider =====
  function initSlider() {
    const quote = $('#testimonials blockquote');
    const [prev, next] = $$('.slider-controls button');
    let index = 0;
    const show = (i) => {
      index = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
      quote.textContent = TESTIMONIALS[index];
    };
    prev.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    show(0);
    setInterval(() => show(index + 1), 7000);
  }

  // ===== Scroll reveal and stat counters =====
  function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting)
        return;
      entry.target.classList.add('visible');
      $$('[data-count]', entry.target).forEach(animateCount);
      observer.unobserve(entry.target);
    }), { threshold: 0.15 });
    $$('.section').forEach((section) => {
      section.classList.add('reveal');
      observer.observe(section);
    });
  }

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 1200, 1);
      el.textContent = Math.round(target * t).toLocaleString();
      if (t < 1)
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCatalog();
    initModal();
    initInquiry();
    initForms();
    initFaq();
    initSlider();
    initScrollEffects();
  });
})();