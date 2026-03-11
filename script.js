/* =========================
MOBILE MENU
========================= */

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if(toggle){
  toggle.addEventListener("click", ()=>{
    nav.classList.toggle("active");
  });

  document.querySelectorAll(".nav a").forEach(link=>{
    link.addEventListener("click", ()=>{
      nav.classList.remove("active");
    });
  });

  document.addEventListener("click", (e)=>{
    if(!nav.contains(e.target) && !toggle.contains(e.target)){
      nav.classList.remove("active");
    }
  });
}
/* =========================
SCROLL PROGRESS BAR
========================= */

const scrollBar = document.querySelector(".scroll-bar");
window.addEventListener("scroll",()=>{
  const scroll = window.scrollY;
  const height = document.body.scrollHeight - window.innerHeight;
  const progress = (scroll / height) * 100;
  if(scrollBar) scrollBar.style.width = progress + "%";
});

/* =========================
HEADER SCROLL EFFECT
========================= */

const header = document.querySelector(".header");
window.addEventListener("scroll",()=>{
  if(window.scrollY > 40){
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* =========================
SCROLL REVEAL ANIMATIONS
========================= */

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("active");
    }
  });
},{threshold:0.2});

document.querySelectorAll(".scroll-reveal, .scroll-left, .scroll-right, .scroll-zoom")
  .forEach(el=>observer.observe(el));

/* =========================
MAGNETIC BUTTON EFFECT
========================= */

document.querySelectorAll(".btn-primary,.banner-btn,.add-cart")
.forEach(btn=>{
  btn.addEventListener("mousemove",(e)=>{
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    btn.style.transform = `translate(${x*0.2}px,${y*0.2}px)`;
  });
  btn.addEventListener("mouseleave",()=>{ btn.style.transform = "translate(0,0)"; });
});

/* =========================
PRODUCT CARD GLOW
========================= */

document.querySelectorAll(".luxury-card").forEach(card=>{
  card.addEventListener("mousemove",(e)=>{
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--x", x + "px");
    card.style.setProperty("--y", y + "px");
  });
});

/* =========================
CART SYSTEM
========================= */

const cartIcon = document.getElementById("cartIcon");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");

const cartItemsEl = document.querySelector(".cart-items");
const totalEl = document.getElementById("total");
const cartCount = document.getElementById("cartCount");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
SAVE CART
========================= */
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
RENDER CART
========================= */
function renderCart(){
  if(!cartItemsEl) return;

  cartItemsEl.innerHTML = "";
  let total = 0;

  cart.forEach((item,index)=>{
    total += item.price * item.qty;

    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <div class="cart-img">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p class="cart-price">$${item.price}</p>
          <div class="cart-meta">
            <span>Size: ${item.size || "N/A"}</span>
            <span>Color: ${item.color || "Default"}</span>
          </div>
          <div class="cart-qty">
            <button onclick="decrease(${index})">-</button>
            <span>${item.qty}</span>
            <button onclick="increase(${index})">+</button>
          </div>
          <span class="remove" onclick="removeItem(${index})">Remove</span>
        </div>
      </div>
    `;
  });

  totalEl.textContent = total.toFixed(2);
  cartCount.textContent = cart.reduce((a,b)=>a+b.qty,0);
  saveCart();
}

/* =========================
SIZE & COLOR SELECTION
========================= */

document.querySelectorAll(".product-card").forEach(card => {
  const sizes = card.querySelectorAll(".sizes span");
  const colors = card.querySelectorAll(".colors .color");

  // Size selection
  sizes.forEach(size => {
    size.addEventListener("click", () => {
      sizes.forEach(s => s.classList.remove("selected"));
      size.classList.add("selected");
    });
  });

  // Color selection
  colors.forEach(color => {
    color.addEventListener("click", () => {
      colors.forEach(c => c.classList.remove("selected"));
      color.classList.add("selected");
    });
  });
});

/* =========================
ADD TO CART
========================= */
document.querySelectorAll(".product-card .add-cart").forEach(btn=>{
  btn.addEventListener("click",(e)=>{
    const card = e.target.closest(".product-card");

    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const img = card.dataset.img;
    const size = card.querySelector(".sizes .selected")?.dataset.size || "N/A";
    const color = card.querySelector(".colors .selected")?.dataset.color || "Default";

    const existing = cart.find(item =>
      item.name === name &&
      item.size === size &&
      item.color === color
    );

    if(existing){
      existing.qty++;
    } else {
      cart.push({name,price,img,size,color,qty:1});
    }

    renderCart();

    cartIcon.classList.add("shake");
    setTimeout(()=>{ cartIcon.classList.remove("shake"); },400);

    cartDrawer.classList.add("open");
  });
});

/* =========================
CART CONTROLS
========================= */
function increase(i){
  cart[i].qty++;
  renderCart();
}

function decrease(i){
  if(cart[i].qty > 1){
    cart[i].qty--;
  } else {
    cart.splice(i,1);
  }
  renderCart();
}

function removeItem(i){
  cart.splice(i,1);
  renderCart();
}

/* =========================
CART OPEN / CLOSE
========================= */
if(cartIcon){
  cartIcon.addEventListener("click",()=> cartDrawer.classList.add("open"));
}

if(closeCart){
  closeCart.addEventListener("click",()=> cartDrawer.classList.remove("open"));
}

/* =========================
PRODUCT FILTER SYSTEM
========================= */

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function filterProducts(){
  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
  const categoryValue = categoryFilter ? categoryFilter.value : "all";

  document.querySelectorAll(".product-card").forEach(card=>{
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category;

    const matchSearch = name.includes(searchValue);
    const matchCategory = categoryValue === "all" || category === categoryValue;

    card.style.display = (matchSearch && matchCategory) ? "" : "none";
  });
}

if(searchInput) searchInput.addEventListener("keyup", filterProducts);
if(categoryFilter) categoryFilter.addEventListener("change", filterProducts);

/* =========================
INIT
========================= */

renderCart();
