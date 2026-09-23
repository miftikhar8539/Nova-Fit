// ==========================================================================
// NOVAFIT Activewear - CENTRAL JAVASCRIPT
// ==========================================================================

// --------------------------------------------------------------------------
// CENTRAL GLOBAL PRODUCTS DATABASE
// --------------------------------------------------------------------------
const globalProducts = {
  hoodie: {
    id: 1,
    title: "Men's Hoodie",
    price: 3200,
    stars: "★★★★☆",
    rating: "4.5 (120)",
    reviewsText: "4.5 (120 reviews)",
    desc: "Stay warm and stylish with our premium cotton hoodie. Designed for comfort, durability and everyday wear.",
    defaultImg: "/images/pro1.jpg",
    colors: ["#556b2f", "#111111", "#cbd5e1", "#f5f5dc"]
  },
  leggings: {
    id: 2,
    title: "Women's Leggings",
    price: 999,
    stars: "★★★★★",
    rating: "4.7 (98)",
    reviewsText: "4.7 (98 reviews)",
    desc: "High-waisted stretchable leggings designed for gym workouts, yoga, and seamless all-day activewear.",
    defaultImg: "/images/pro2.jpg",
    colors: ["#64748b", "#111111"]
  },
  shoes: {
    id: 3,
    title: "Running Shoes",
    price: 4200,
    stars: "★★★★☆",
    rating: "4.6 (210)",
    reviewsText: "4.6 (210 reviews)",
    desc: "Lightweight and breathable running shoes built for maximum speed, cushioning and daily workout support.",
    defaultImg: "/images/pro3.jpg",
    colors: ["#111111", "#ffffff", "#0b633d"]
  },
  cap: {
    id: 4,
    title: "Baseball Cap",
    price: 3299,
    stars: "★★★★☆",
    rating: "4.3 (76)",
    reviewsText: "4.3 (76 reviews)",
    desc: "Classic adjustable fit baseball cap made with breathable fabric to keep you cool on sunny days.",
    defaultImg: "/images/pro4.jpg",
    colors: ["#111111", "#556b2f"]
  },
  pants: {
    id: 5,
    title: "Gym Track Pant Men's",
    price: 2800,
    stars: "★★★★☆",
    rating: "4.4 (110)",
    reviewsText: "4.4 (110 reviews)",
    desc: "Flexible athletic track pants with zipper pockets, ideal for workout sessions and casual everyday wear.",
    defaultImg: "/images/pro5.jpg",
    colors: ["#64748b", "#111111"]
  },
  tank: {
    id: 6,
    title: "Men's Sleeveless Gym Tank Top",
    price: 1500,
    stars: "★★★★☆",
    rating: "4.2 (64)",
    reviewsText: "4.2 (64 reviews)",
    desc: "Breathable sleeveless gym tank top designed for intense workouts and maximum range of motion.",
    defaultImg: "/images/pro6.jpg",
    colors: ["#cbd5e1", "#111111"]
  },
  bottle: {
    id: 7,
    title: "Gym Water Bottle",
    price: 3500,
    stars: "★★★★★",
    rating: "4.8 (145)",
    reviewsText: "4.8 (145 reviews)",
    desc: "Insulated stainless steel gym water bottle designed to keep your drinks cold for up to 24 hours.",
    defaultImg: "/images/pro7.jpg",
    colors: ["#0b633d", "#111111"]
  },
  bag: {
    id: 8,
    title: "Gym Bag",
    price: 3800,
    stars: "★★★★★",
    rating: "4.9 (180)",
    reviewsText: "4.9 (180 reviews)",
    desc: "Spacious duffle gym bag featuring dedicated shoe compartment and water-resistant fabric.",
    defaultImg: "/images/pro8.jpg",
    colors: ["#111111", "#64748b"]
  }
};

function getProductByKey(key) {
  return globalProducts[key] || null;
}

// --------------------------------------------------------------------------
// SHARED PRODUCT HELPERS
// --------------------------------------------------------------------------
function isDiscountedProduct(product) {
  return !!product && product.price >= 3000;
}

function getOriginalPrice(product) {
  return isDiscountedProduct(product) ? Math.round(product.price / 0.7) : null;
}

function getProductDetailUrl(key) {
  return `product-detail.html?product=${encodeURIComponent(key)}`;
}

function getProductKeyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('product') || 'shoes';
}

function attachProductDetailNavigation(root = document) {
  root.querySelectorAll('.product-card[data-product-key]').forEach(card => {
    if (card.dataset.detailNavigationAttached === 'true') return;

    card.dataset.detailNavigationAttached = 'true';
    const openDetail = (event) => {
      if (event.target.closest('.add-to-cart-trigger')) return;

      const key = card.getAttribute('data-product-key');
      if (key && getProductByKey(key)) {
        window.location.href = getProductDetailUrl(key);
      }
    };

    card.addEventListener('click', openDetail);
    card.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.add-to-cart-trigger')) {
        event.preventDefault();
        openDetail(event);
      }
    });
  });
}

// --------------------------------------------------------------------------
// SECTION 1: SMART NAVBAR, SEARCH & MOBILE SIDEBAR
// --------------------------------------------------------------------------
const mainNavbar = document.getElementById('main-navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 60) {
    mainNavbar.classList.add('navbar-scrolled');
  } else {
    if (!document.body.classList.contains('about-page-body')) {
      mainNavbar.classList.remove('navbar-scrolled');
    }
  }

  if (currentScrollY > lastScrollY && currentScrollY > 150) {
    mainNavbar.classList.add('navbar-hidden');
  } else {
    mainNavbar.classList.remove('navbar-hidden');
  }

  lastScrollY = currentScrollY;
});

// Expandable Search Box
const searchToggleBtn = document.getElementById('search-toggle-btn');
const searchWrapper = document.getElementById('search-wrapper');
const inlineSearchInput = document.getElementById('inline-search-input');
const searchDropdown = document.getElementById('search-dropdown');

const searchableItems = Object.values(globalProducts).map(item => ({
  name: item.title,
  link: "products.html"
}));

if (searchToggleBtn && searchWrapper && inlineSearchInput) {
  searchToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    searchWrapper.classList.toggle('search-expanded');
    if (searchWrapper.classList.contains('search-expanded')) {
      inlineSearchInput.focus();
    } else {
      inlineSearchInput.value = '';
      if (searchDropdown) searchDropdown.classList.remove('active');
    }
  });

  inlineSearchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();

    if (query === '') {
      searchDropdown.classList.remove('active');
      return;
    }

    const filtered = searchableItems.filter(item => item.name.toLowerCase().includes(query));

    if (filtered.length > 0) {
      searchDropdown.innerHTML = filtered.map(item => `
        <a href="${item.link}" class="search-dropdown-item" onclick="closeSearchDropdown()">
          🔍 ${item.name}
        </a>
      `).join('');
      searchDropdown.classList.add('active');
    } else {
      searchDropdown.innerHTML = '<div class="search-dropdown-item">No products found</div>';
      searchDropdown.classList.add('active');
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchWrapper.contains(e.target)) {
      searchWrapper.classList.remove('search-expanded');
      if (searchDropdown) searchDropdown.classList.remove('active');
    }
  });
}

function closeSearchDropdown() {
  if (searchDropdown) searchDropdown.classList.remove('active');
  if (searchWrapper) searchWrapper.classList.remove('search-expanded');
}

// Mobile Sidebar Drawer
const hamburgerOpenBtn = document.getElementById('hamburger-open');
const hamburgerCloseBtn = document.getElementById('hamburger-close');
const mobileSidebar = document.getElementById('mobile-sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileMenu() {
  if (mobileSidebar && mobileOverlay) {
    mobileSidebar.classList.add('active');
    mobileOverlay.classList.add('active');
  }
}

function closeMobileMenu() {
  if (mobileSidebar && mobileOverlay) {
    mobileSidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
  }
}

if (hamburgerOpenBtn) hamburgerOpenBtn.addEventListener('click', openMobileMenu);
if (hamburgerCloseBtn) hamburgerCloseBtn.addEventListener('click', closeMobileMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

const sidebarLinks = document.querySelectorAll('.sidebar-link');
sidebarLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Global Cart Counter State
let cartCount = parseInt(localStorage.getItem('novafit_cart_count')) || 0;
const cartCountText = document.getElementById('cart-count-text');

function updateCartUI() {
  if (cartCountText) {
    cartCountText.textContent = `Cart (${cartCount})`;
  }
}

function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-trigger');
  addToCartButtons.forEach(button => {
    button.removeEventListener('click', handleAddToCart);
    button.addEventListener('click', handleAddToCart);
  });
}

function handleAddToCart(e) {
  e.preventDefault();
  cartCount++;
  localStorage.setItem('novafit_cart_count', cartCount);
  updateCartUI();

  this.style.opacity = '0.7';
  setTimeout(() => {
    this.style.opacity = '1';
  }, 200);
}

updateCartUI();

// --------------------------------------------------------------------------
// SECTION 3: OUR BEST SELLING CAROUSEL
// --------------------------------------------------------------------------
function renderBestSellingCarousel() {
  const container = document.getElementById('products-container');
  if (!container) return;

  const productsList = Object.entries(globalProducts);

  container.innerHTML = productsList.map(([productKey, product]) => {
    const discounted = isDiscountedProduct(product);
    const oldPrice = getOriginalPrice(product);

    return `
      <div class="product-card" data-product-key="${productKey}" role="link" tabindex="0" aria-label="View ${product.title}">
        <div class="card-img-wrapper">
          <img src="${product.defaultImg}" alt="${product.title}" class="product-img">
          ${discounted ? `<span class="badge badge-discount">30% OFF</span>` : ''}
          ${discounted ? `<span class="badge badge-shipping">Free Shipping</span>` : ''}
        </div>
        <div class="card-details">
          <h3 class="product-title">${product.title}</h3>
          <div class="product-rating">
            <span class="stars">${product.stars}</span>
            <span class="rating-text">${product.rating}</span>
          </div>
          <div class="product-pricing">
            ${discounted ? `<span class="old-price">Rs. ${oldPrice.toLocaleString()}</span>` : ''}
            <span class="current-price ${!discounted ? 'solo-price' : ''}">Rs. ${product.price.toLocaleString()}</span>
          </div>
          <button class="card-add-btn add-to-cart-trigger">Add To Cart</button>
        </div>
      </div>
    `;
  }).join('');

  attachAddToCartListeners();
  attachProductDetailNavigation(container);
}

const productsScrollContainer = document.getElementById('products-container');
const prevArrowBtn = document.getElementById('carousel-prev-btn');
const nextArrowBtn = document.getElementById('carousel-next-btn');

function getSingleCardScrollWidth() {
  const firstCard = productsScrollContainer ? productsScrollContainer.querySelector('.product-card') : null;
  return firstCard ? firstCard.offsetWidth + 20 : 280;
}

if (prevArrowBtn && productsScrollContainer) {
  prevArrowBtn.addEventListener('click', () => {
    productsScrollContainer.scrollBy({ left: -getSingleCardScrollWidth(), behavior: 'smooth' });
  });
}

if (nextArrowBtn && productsScrollContainer) {
  nextArrowBtn.addEventListener('click', () => {
    productsScrollContainer.scrollBy({ left: getSingleCardScrollWidth(), behavior: 'smooth' });
  });
}

// --------------------------------------------------------------------------
// SECTION 4: FEATURED LOOKBOOK & SLIDER ENGINE
// --------------------------------------------------------------------------
const previewCardBox = document.getElementById('preview-card-box');
const previewImg = document.getElementById('preview-product-img');
const previewTitle = document.getElementById('preview-title');
const previewStars = document.getElementById('preview-stars');
const previewReviews = document.getElementById('preview-reviews');
const previewPrice = document.getElementById('preview-price');
const previewOldPrice = document.getElementById('preview-old-price');
const previewDesc = document.getElementById('preview-desc');
const colorWrapper = document.getElementById('preview-color-wrapper');

function updateProductPreview(key) {
  const item = getProductByKey(key);
  if (!item || !previewCardBox) return;

  previewCardBox.classList.add('card-fade-out');

  setTimeout(() => {
    if (previewTitle) previewTitle.textContent = item.title;
    if (previewStars) previewStars.textContent = item.stars;
    if (previewReviews) previewReviews.textContent = item.reviewsText || item.rating;
    if (previewDesc) previewDesc.textContent = item.desc;
    if (previewImg) previewImg.src = item.defaultImg;

    const isDiscounted = item.price >= 3000;
    const oldPriceVal = isDiscounted ? Math.round(item.price / 0.7) : null;

    if (previewPrice) previewPrice.textContent = `Rs. ${item.price.toLocaleString()}`;

    const discountBadge = document.getElementById('preview-discount-badge');
    const shippingBadge = document.getElementById('preview-shipping-badge');

    if (isDiscounted) {
      if (previewOldPrice) {
        previewOldPrice.style.display = 'inline';
        previewOldPrice.textContent = `Rs. ${oldPriceVal.toLocaleString()}`;
      }
      if (discountBadge) discountBadge.style.display = 'inline-block';
      if (shippingBadge) shippingBadge.style.display = 'inline-block';
    } else {
      if (previewOldPrice) previewOldPrice.style.display = 'none';
      if (discountBadge) discountBadge.style.display = 'none';
      if (shippingBadge) shippingBadge.style.display = 'none';
    }

    if (colorWrapper && item.colors) {
      colorWrapper.innerHTML = item.colors.map((hex, idx) => `
        <span class="color-swatch ${idx === 0 ? 'active-swatch' : ''}" style="background-color: ${hex};"></span>
      `).join('');

      attachColorListeners();
    }

    previewCardBox.classList.remove('card-fade-out');
  }, 350);
}

function attachColorListeners() {
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
      swatches.forEach(s => s.classList.remove('active-swatch'));
      this.classList.add('active-swatch');
      if (previewImg) {
        previewImg.style.opacity = '0.35';
        setTimeout(() => { previewImg.style.opacity = '1'; }, 150);
      }
    });
  });
}

const sizeBtns = document.querySelectorAll('.size-btn');
sizeBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    sizeBtns.forEach(b => b.classList.remove('active-size'));
    this.classList.add('active-size');
    // FIX 3: Extend image-changing transition behavior on Size selection
    if (previewImg) {
      previewImg.style.opacity = '0.35';
      setTimeout(() => { previewImg.style.opacity = '1'; }, 150);
    }
  });
});

const bannerPrevBtn = document.getElementById('banner-prev-btn');
const bannerNextBtn = document.getElementById('banner-next-btn');
const slide1 = document.getElementById('slide-1');
const slide2 = document.getElementById('slide-2');

let currentSlideIndex = 1;

function switchBannerSlide(slideIndex) {
  if (slideIndex === currentSlideIndex) return;

  if (slideIndex === 1) {
    if (slide2) slide2.classList.remove('active-slide');
    if (slide1) slide1.classList.add('active-slide');
    currentSlideIndex = 1;
    resetPinsActiveState('slide-1');
    updateProductPreview('hoodie');
  } else {
    if (slide1) slide1.classList.remove('active-slide');
    if (slide2) slide2.classList.add('active-slide');
    currentSlideIndex = 2;
    resetPinsActiveState('slide-2');
    updateProductPreview('pants');
  }
}

function resetPinsActiveState(slideId) {
  const activeSlideObj = document.getElementById(slideId);
  if (!activeSlideObj) return;

  const pinsInSlide = activeSlideObj.querySelectorAll('.hotspot-pin');
  pinsInSlide.forEach((pin, index) => {
    if (index === 0) pin.classList.add('active-pin');
    else pin.classList.remove('active-pin');
  });
}

if (bannerNextBtn) bannerNextBtn.addEventListener('click', () => switchBannerSlide(2));
if (bannerPrevBtn) bannerPrevBtn.addEventListener('click', () => switchBannerSlide(1));

const allHotspotPins = document.querySelectorAll('.hotspot-pin');
allHotspotPins.forEach(pin => {
  pin.addEventListener('click', function() {
    allHotspotPins.forEach(p => p.classList.remove('active-pin'));
    this.classList.add('active-pin');

    const productKey = this.getAttribute('data-product');
    updateProductPreview(productKey);
  });
});

// --------------------------------------------------------------------------
// SECTION 5: SCROLL ANIMATIONS
// --------------------------------------------------------------------------
const scrollElements = document.querySelectorAll('.reveal-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active-scroll');
    }
  });
}, { threshold: 0.08 });

scrollElements.forEach(el => scrollObserver.observe(el));

// --------------------------------------------------------------------------
// DOM INITIALIZATION & ABOUT ACCORDION
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderBestSellingCarousel();
  updateProductPreview('hoodie');

  // FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active-faq');
        faqItems.forEach(i => i.classList.remove('active-faq'));
        if (!isActive) {
          item.classList.add('active-faq');
        }
      });
    }
  });
});

// --------------------------------------------------------------------------
// CONTACT FORM SUBMISSION & CUSTOM POPUP MODAL
// --------------------------------------------------------------------------
const contactMainForm = document.getElementById('contact-main-form');
const thanksModalOverlay = document.getElementById('thanks-modal-overlay');
const modalOkBtn = document.getElementById('modal-ok-btn');

if (contactMainForm && thanksModalOverlay) {
  contactMainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    thanksModalOverlay.classList.add('active-modal');
    contactMainForm.reset();
  });
}

function closeThanksModal() {
  if (thanksModalOverlay) {
    thanksModalOverlay.classList.remove('active-modal');
  }
}

if (modalOkBtn) {
  modalOkBtn.addEventListener('click', closeThanksModal);
}

if (thanksModalOverlay) {
  thanksModalOverlay.addEventListener('click', (e) => {
    if (e.target === thanksModalOverlay) {
      closeThanksModal();
    }
  });
}

// --------------------------------------------------------------------------
// SECTION: ALL PRODUCTS SHOP PAGE FILTER & PAGINATION ENGINE
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const shopGrid = document.getElementById('all-products-grid');
  if (!shopGrid) return; 

  const categoryMap = {
    hoodie: 'men',
    leggings: 'women',
    shoes: 'accessories',
    cap: 'accessories',
    pants: 'men',
    tank: 'men',
    bottle: 'accessories',
    bag: 'accessories'
  };

  let allProductsList = Object.keys(globalProducts).map(key => ({
    key: key,
    ...globalProducts[key],
    category: categoryMap[key] || 'men'
  }));

  let activeCategoryFilters = [];
  let activePriceFilters = [];
  let currentSort = 'featured';
  
  let currentPage = 1;
  const itemsPerPage = 4;

  function renderShopProducts() {
    let filtered = [...allProductsList];

    if (activeCategoryFilters.length > 0) {
      filtered = filtered.filter(p => activeCategoryFilters.includes(p.category));
    }

    if (activePriceFilters.length > 0) {
      filtered = filtered.filter(p => {
        return activePriceFilters.some(range => {
          if (range === '0-2000') return p.price <= 2000;
          if (range === '2001-4000') return p.price > 2000 && p.price <= 4000;
          if (range === '4001-6000') return p.price > 4000;
          return true;
        });
      });
    }

    if (currentSort === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

    shopGrid.classList.add('page-transitioning');

    setTimeout(() => {
      if (paginatedItems.length === 0) {
        shopGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">No products match your selected filters.</div>';
      } else {
        shopGrid.innerHTML = paginatedItems.map(product => {
          const isDiscounted = isDiscountedProduct(product);
          const oldPrice = getOriginalPrice(product);

          return `
            <div class="product-card" id="card-${product.key}" data-product-key="${product.key}" role="link" tabindex="0" aria-label="View ${product.title}">
              <div class="card-img-wrapper">
                <img src="${product.defaultImg}" alt="${product.title}" class="product-img">
                ${isDiscounted ? `<span class="badge badge-discount">30% OFF</span>` : ''}
                ${isDiscounted ? `<span class="badge badge-shipping">Free Shipping</span>` : ''}
              </div>
              <div class="card-details">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                  <span class="stars">${product.stars}</span>
                  <span class="rating-text">${product.rating}</span>
                </div>
                <div class="product-pricing">
                  ${isDiscounted ? `<span class="old-price">Rs. ${oldPrice.toLocaleString()}</span>` : ''}
                  <span class="current-price ${!isDiscounted ? 'solo-price' : ''}">Rs. ${product.price.toLocaleString()}</span>
                </div>
                <button class="card-add-btn add-to-cart-trigger">Add To Cart</button>
              </div>
            </div>
          `;
        }).join('');
      }

      shopGrid.classList.remove('page-transitioning');
      attachAddToCartListeners();
      attachProductDetailNavigation(shopGrid);
      updatePaginationControls(totalPages);
      checkUrlHashFocus();
    }, 280);
  }

  function updatePaginationControls(totalPages) {
    const page1Btn = document.querySelector('.page-num-btn[data-page="1"]');
    const page2Btn = document.querySelector('.page-num-btn[data-page="2"]');
    const prevBtn = document.getElementById('page-prev-btn');
    const nextBtn = document.getElementById('page-next-btn');

    if (page1Btn && page2Btn) {
      if (currentPage === 1) {
        page1Btn.classList.add('active-page');
        page2Btn.classList.remove('active-page');
      } else {
        page2Btn.classList.add('active-page');
        page1Btn.classList.remove('active-page');
      }
    }

    if (prevBtn) {
      if (currentPage === 1) prevBtn.classList.add('disabled');
      else prevBtn.classList.remove('disabled');
    }

    if (nextBtn) {
      if (currentPage === totalPages || totalPages <= 1) nextBtn.classList.add('disabled');
      else nextBtn.classList.remove('disabled');
    }
  }

  const pageBtns = document.querySelectorAll('.page-num-btn');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetPage = parseInt(this.getAttribute('data-page'));
      if (targetPage !== currentPage) {
        currentPage = targetPage;
        renderShopProducts();
      }
    });
  });

  const prevPageBtn = document.getElementById('page-prev-btn');
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderShopProducts();
      }
    });
  }

  const nextPageBtn = document.getElementById('page-next-btn');
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      renderShopProducts();
    });
  }

  function checkUrlHashFocus() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const targetIndex = allProductsList.findIndex(p => p.key === hash);
    if (targetIndex !== -1) {
      const itemPage = Math.floor(targetIndex / itemsPerPage) + 1;
      if (itemPage !== currentPage) {
        currentPage = itemPage;
        renderShopProducts();
        return;
      }
    }

    const targetCard = document.getElementById(`card-${hash}`);
    if (targetCard) {
      shopGrid.classList.add('has-focused-card');
      targetCard.classList.add('focused-highlight');

      setTimeout(() => {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);

      document.addEventListener('click', function removeFocus(e) {
        if (!targetCard.contains(e.target)) {
          shopGrid.classList.remove('has-focused-card');
          targetCard.classList.remove('focused-highlight');
          document.removeEventListener('click', removeFocus);
        }
      });
    }
  }

  const categoryChecks = document.querySelectorAll('.filter-cat-check');
  categoryChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      activeCategoryFilters = Array.from(categoryChecks).filter(c => c.checked).map(c => c.value);
      currentPage = 1;
      renderShopProducts();
    });
  });

  const priceChecks = document.querySelectorAll('.filter-price-check');
  priceChecks.forEach(chk => {
    chk.addEventListener('change', () => {
      activePriceFilters = Array.from(priceChecks).filter(c => c.checked).map(c => c.value);
      currentPage = 1;
      renderShopProducts();
    });
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderShopProducts();
    });
  }

  const resetBtn = document.getElementById('reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      categoryChecks.forEach(c => c.checked = false);
      priceChecks.forEach(c => c.checked = false);
      activeCategoryFilters = [];
      activePriceFilters = [];
      currentPage = 1;
      renderShopProducts();
    });
  }

  renderShopProducts();
  window.addEventListener('hashchange', checkUrlHashFocus);
});


// --------------------------------------------------------------------------
// SECTION: PRODUCT DETAIL PAGE ENGINE
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const detailMainImg = document.getElementById('detail-main-img');
  const detailTitle = document.querySelector('.pdetail-title');
  const detailStars = document.querySelector('.pdetail-stars');
  const detailReviews = document.querySelector('.pdetail-reviews');
  const detailCurrentPrice = document.querySelector('.pdetail-current-price');
  const detailOldPrice = document.querySelector('.pdetail-old-price');
  const detailDiscountBadge = document.getElementById('pdetail-discount-badge');
  const detailShippingBadge = document.getElementById('pdetail-shipping-badge');
  const detailDescription = document.querySelector('.pdetail-short-desc');
  const detailBadge = document.querySelector('.pdetail-badge');
  const thumbnailRow = document.querySelector('.pdetail-thumbnails-row');

  const qtyInput = document.getElementById('qty-input');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-content-panel');

  const galleryPrevBtn = document.getElementById('gallery-prev-btn');
  const galleryNextBtn = document.getElementById('gallery-next-btn');
  const thumbPrevBtn = document.getElementById('thumb-prev-btn');
  const thumbNextBtn = document.getElementById('thumb-next-btn');

  const productsList = Object.entries(globalProducts);
  let currentProductIndex = 0;
  let currentProduct = null;
  let quantity = 1;

  // FIX 2: Independent Thumbnail Navigation Index State
  let thumbStartIndex = 0;

  function smoothDetailUpdate(callback) {
    const targets = [
      detailMainImg,
      detailTitle,
      detailCurrentPrice,
      detailDescription
    ].filter(Boolean);

    targets.forEach(element => element.classList.add('detail-content-fading'));

    setTimeout(() => {
      callback();
      requestAnimationFrame(() => {
        targets.forEach(element => element.classList.remove('detail-content-fading'));
      });
    }, 180);
  }

  // FIX 4: Dynamic Quantity × Price 3000 Threshold Badges Logic
  function updateDetailPrice() {
    if (!currentProduct) return;

    const totalPrice = currentProduct.price * quantity;
    const meetsThreshold = totalPrice >= 3000;
    const originalUnitPrice = getOriginalPrice(currentProduct);

    if (detailCurrentPrice) {
      detailCurrentPrice.textContent = `Rs. ${totalPrice.toLocaleString()}`;
    }

    // Dynamic show/hide of badges when total >= 3000 or < 3000
    if (detailDiscountBadge) {
      detailDiscountBadge.style.display = meetsThreshold ? 'inline-block' : 'none';
    }

    if (detailShippingBadge) {
      detailShippingBadge.style.display = meetsThreshold ? 'inline-block' : 'none';
    }

    if (detailOldPrice) {
      if (meetsThreshold) {
        const baseOldPrice = originalUnitPrice || Math.round(currentProduct.price / 0.7);
        detailOldPrice.style.display = 'inline';
        detailOldPrice.textContent = `Rs. ${(baseOldPrice * quantity).toLocaleString()}`;
      } else {
        detailOldPrice.style.display = 'none';
      }
    }
  }

  // FIX 2: Render thumbnails independently based on thumbStartIndex
  function renderThumbnailCarousel() {
    if (!thumbnailRow) return;

    const visibleCount = 4;
    const visibleProducts = productsList.slice(thumbStartIndex, thumbStartIndex + visibleCount);

    thumbnailRow.innerHTML = visibleProducts.map(([key, product]) => `
      <div class="thumb-box ${currentProduct && key === currentProduct.key ? 'active-thumb' : ''}"
           data-product-key="${key}"
           data-img="${product.defaultImg}"
           role="button"
           tabindex="0"
           aria-label="View ${product.title}">
        <img src="${product.defaultImg}" alt="${product.title}">
      </div>
    `).join('');

    thumbnailRow.querySelectorAll('.thumb-box').forEach(thumb => {
      const selectThumb = () => {
        const key = thumb.getAttribute('data-product-key');
        const index = productsList.findIndex(([productKey]) => productKey === key);
        if (index !== -1) {
          // Selects product without altering thumbnail carousel index
          currentProductIndex = index;
          renderProduct(productsList[index][1], true, false);
        }
      };

      thumb.addEventListener('click', selectThumb);
      thumb.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectThumb();
        }
      });
    });
  }

  // Independent Thumbnails Navigation Buttons
  if (thumbPrevBtn) {
    thumbPrevBtn.addEventListener('click', () => {
      if (thumbStartIndex > 0) {
        thumbStartIndex--;
        renderThumbnailCarousel();
      }
    });
  }

  if (thumbNextBtn) {
    thumbNextBtn.addEventListener('click', () => {
      if (thumbStartIndex < productsList.length - 4) {
        thumbStartIndex++;
        renderThumbnailCarousel();
      }
    });
  }

  function renderProduct(product, animate = false, updateThumbIndex = true) {
    if (!product) return;

    const applyProduct = () => {
      currentProduct = product;
      quantity = 1;

      if (qtyInput) qtyInput.value = '1';

      if (detailMainImg) {
        detailMainImg.src = product.defaultImg;
        detailMainImg.alt = product.title;
      }

      if (detailTitle) detailTitle.textContent = product.title;
      if (detailStars) detailStars.textContent = product.stars;
      if (detailReviews) detailReviews.textContent = product.reviewsText || product.rating;
      if (detailDescription) detailDescription.textContent = product.desc;

      if (detailBadge) {
        detailBadge.textContent = product.price >= 3000 ? 'Best Seller' : 'Featured';
      }

      updateDetailPrice();
      renderColorOptions();

      if (updateThumbIndex) {
        thumbStartIndex = Math.floor(currentProductIndex / 4) * 4;
        thumbStartIndex = Math.min(thumbStartIndex, Math.max(0, productsList.length - 4));
      }
      renderThumbnailCarousel();
    };

    if (animate) {
      smoothDetailUpdate(applyProduct);
    } else {
      applyProduct();
    }
  }

  function setProductByIndex(index, animate = true) {
    if (!productsList.length) return;

    currentProductIndex = (index + productsList.length) % productsList.length;
    const [, product] = productsList[currentProductIndex];

    renderProduct(product, animate, true);
  }

  function renderColorOptions() {
    const colorContainer = document.querySelector('.pdetail-colors-list');
    if (!colorContainer || !currentProduct) return;

    colorContainer.innerHTML = currentProduct.colors.map((hex, index) => `
      <span class="pd-color-swatch ${index === 0 ? 'active-pd-swatch' : ''}"
            style="background-color: ${hex};"
            data-color-index="${index}"
            role="button"
            tabindex="0"
            aria-label="Select color ${index + 1}"></span>
    `).join('');

    colorContainer.querySelectorAll('.pd-color-swatch').forEach(swatch => {
      const selectColor = () => {
        colorContainer.querySelectorAll('.pd-color-swatch')
          .forEach(item => item.classList.remove('active-pd-swatch'));

        swatch.classList.add('active-pd-swatch');

        if (detailMainImg) {
          detailMainImg.classList.add('detail-image-fading');
          setTimeout(() => {
            detailMainImg.src = currentProduct.defaultImg;
            detailMainImg.classList.remove('detail-image-fading');
          }, 150);
        }
      };

      swatch.addEventListener('click', selectColor);
      swatch.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectColor();
        }
      });
    });
  }

  // Quantity controls update price and threshold badges dynamically
  if (qtyMinus) {
    qtyMinus.addEventListener('click', () => {
      quantity = Math.max(1, quantity - 1);
      if (qtyInput) qtyInput.value = quantity;
      updateDetailPrice();
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', () => {
      quantity += 1;
      if (qtyInput) qtyInput.value = quantity;
      updateDetailPrice();
    });
  }

  // FIX 3: Size selection updates image transition behavior just like color selection
  document.querySelectorAll('.pd-size-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.pd-size-btn').forEach(btn => {
        btn.classList.remove('active-pd-size');
      });
      button.classList.add('active-pd-size');

      if (detailMainImg) {
        detailMainImg.classList.add('detail-image-fading');
        setTimeout(() => {
          detailMainImg.classList.remove('detail-image-fading');
        }, 150);
      }
    });
  });

  // Main gallery arrows navigate through products
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => {
      setProductByIndex(currentProductIndex - 1, true);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => {
      setProductByIndex(currentProductIndex + 1, true);
    });
  }

  // Detail tabs
  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        tabBtns.forEach(item => item.classList.remove('active-tab'));
        tabPanels.forEach(panel => panel.classList.remove('active-panel'));

        this.classList.add('active-tab');

        const targetTabId = this.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetTabId);
        if (targetPanel) targetPanel.classList.add('active-panel');
      });
    });
  }

  // Render "You May Also Like"
  const youLikeGrid = document.getElementById('you-like-grid');

  if (youLikeGrid) {
    youLikeGrid.innerHTML = productsList.map(([key, product]) => {
      const discounted = isDiscountedProduct(product);
      const oldPrice = getOriginalPrice(product);

      return `
        <div class="product-card" data-product-key="${key}" role="link" tabindex="0" aria-label="View ${product.title}">
          <div class="card-img-wrapper">
            <img src="${product.defaultImg}" alt="${product.title}" class="product-img">
            ${discounted ? `<span class="badge badge-discount">30% OFF</span>` : ''}
            ${discounted ? `<span class="badge badge-shipping">Free Shipping</span>` : ''}
          </div>
          <div class="card-details">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
              <span class="stars">${product.stars}</span>
              <span class="rating-text">${product.rating}</span>
            </div>
            <div class="product-pricing">
              ${discounted ? `<span class="old-price">Rs. ${oldPrice.toLocaleString()}</span>` : ''}
              <span class="current-price ${!discounted ? 'solo-price' : ''}">Rs. ${product.price.toLocaleString()}</span>
            </div>
            <button class="card-add-btn add-to-cart-trigger">Add To Cart</button>
          </div>
        </div>
      `;
    }).join('');

    attachAddToCartListeners();
    attachProductDetailNavigation(youLikeGrid);

    const youPrev = document.getElementById('you-prev-btn');
    const youNext = document.getElementById('you-next-btn');

    if (youPrev) {
      youPrev.addEventListener('click', () => {
        youLikeGrid.scrollBy({ left: -getSingleYouLikeCardScrollWidth(), behavior: 'smooth' });
      });
    }

    if (youNext) {
      youNext.addEventListener('click', () => {
        youLikeGrid.scrollBy({ left: getSingleYouLikeCardScrollWidth(), behavior: 'smooth' });
      });
    }
  }

  function getSingleYouLikeCardScrollWidth() {
    const card = youLikeGrid ? youLikeGrid.querySelector('.product-card') : null;
    return card ? card.offsetWidth + 20 : 280;
  }

  const requestedKey = getProductKeyFromUrl();
  const requestedIndex = productsList.findIndex(([key]) => key === requestedKey);

  setProductByIndex(requestedIndex >= 0 ? requestedIndex : 2, false);
});