const products = {
    beauty: {
        name: "Fresh Beauty Hampers",
        price: 80000,
        image: "images/Gift Box.jpeg",
        description: "Hampers cantik dengan pilihan hadiah spesial."
    },
    snack: {
        name: "Sweet Snack",
        price: 75000,
        image: "images/snack Hampers.jpeg",
        description: "Hampers camilan manis dengan kemasan menarik."
    },
    snackbox: {
        name: "Sweet Snack Box",
        price: 95000,
        image: "images/Snack Box.jpeg",
        description: "Paket camilan pilihan dalam kotak hadiah."
    },
    skincare: {
        name: "Beauty Gift Box",
        price: 85000,
        image: "images/Skincare Hampers.jpeg",
        description: "Hampers pilihan dengan tema kecantikan."
    },
    stationery: {
        name: "Sunny Stationery Box",
        price: 45000,
        image: "images/gift Hampers.jpeg",
        description: "Paket hadiah alat tulis dengan tampilan menarik."
    }
};

function formatRupiah(number) {
    return "Rp" + number.toLocaleString("id-ID");
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("pixiequeCart")) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("pixiequeCart", JSON.stringify(cart));
}
function updateCartCount() {
    const cartLinks = document.querySelectorAll(".cart-link");

    const totalItems = getCart().reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartLinks.forEach(link => {
        let badge = link.querySelector(".cart-count");

        if (!badge) {
            badge = document.createElement("span");
            badge.className = "cart-count";
            link.appendChild(badge);
        }

        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? "inline-flex" : "none";
    });
}

function addToCart(id) {
    const product = products[id];

    if (!product) return;

    let cart = getCart();
    let item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    renderCart();
}

function showProductDetail() {
    const area = document.getElementById("product-detail");

    if (!area) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = products[id];

    if (!product) {
        area.innerHTML = `
            <div class="empty-cart">
                <h2>Produk tidak ditemukan</h2>
                <a href="toko.html" class="btn">Kembali ke Toko</a>
            </div>
        `;
        return;
    }

    area.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="detail-info">
            <span class="eyebrow">PIXIEQUE COLLECTION</span>
            <h2>${product.name}</h2>
            <div class="detail-price">${formatRupiah(product.price)}</div>
            <p>${product.description}</p>
            <p><strong>Harga:</strong> ${formatRupiah(product.price)}</p>

            <button class="btn" onclick="addToCart('${id}')">
                Tambah ke Keranjang
            </button>
        </div>
    `;
}

function renderCart() {
    const area = document.getElementById("cart-items");
    const totalArea = document.getElementById("total");

    if (!area || !totalArea) return;

    const cart = getCart();
    let total = 0;

    if (cart.length === 0) {
        area.innerHTML = `
            <div class="empty-cart">
                <h3>Keranjang masih kosong</h3>
                <p>Yuk, temukan hadiah spesial dari PIXIEQUE!</p>
                <a href="toko.html" class="btn">Mulai Belanja</a>
            </div>
        `;

        totalArea.textContent = formatRupiah(0);
        return;
    }

    area.innerHTML = cart.map(item => {
        const product = products[item.id];

        if (!product) return "";

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">
                    <h3>${product.name}</h3>
                    <p>${formatRupiah(product.price)}</p>
                    <p>Subtotal: ${formatRupiah(subtotal)}</p>

                    <div class="quantity-controls">
                        <button onclick="changeQuantity('${item.id}', -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>

                <button class="remove-btn"
                    onclick="removeFromCart('${item.id}')">
                    Hapus
                </button>
            </div>
        `;
    }).join("");

    totalArea.textContent = formatRupiah(total);
}

function changeQuantity(id, amount) {
    const cart = getCart();
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    saveCart(cart.filter(item => item.quantity > 0));
    renderCart();
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);

    saveCart(cart);
    renderCart();
}

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", function () {
            addToCart(this.dataset.id);
        });
    });

    updateCartCount();
    showProductDetail();
    renderCart();

    console.log("PIXIEQUE siap digunakan!");
});
/* CHECKOUT PIXIEQUE */

function getProductInfo(id) {
    return products[id];
}

function getCheckoutData() {
    const cart = getCart();
    let total = 0;

    const items = cart.map(item => {
        const product = getProductInfo(item.id);
        if (!product) return null;

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            subtotal: subtotal
        };
    }).filter(Boolean);

    return { items, total };
}

/* CHECKOUT PIXIEQUE */

function getProductInfo(id) {
    return products[id];
}

function getCheckoutData() {
    const cart = getCart();
    let total = 0;

    const items = cart.map(item => {
        const product = getProductInfo(item.id);
        if (!product) return null;

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            subtotal: subtotal
        };
    }).filter(Boolean);

    return { items, total };
}

function showCheckout() {
    const summary = document.getElementById("checkout-summary");
    const totalArea = document.getElementById("checkout-total");

    if (!summary || !totalArea) return;

    const data = getCheckoutData();

    if (data.items.length === 0) {
        summary.innerHTML = "<p>Keranjang masih kosong.</p>";
        totalArea.textContent = formatRupiah(0);
        return;
    }

    summary.innerHTML = data.items.map(item => `
        <p>${item.name} x ${item.quantity}
        — ${formatRupiah(item.subtotal)}</p>
    `).join("");

    totalArea.textContent = formatRupiah(data.total);
}

function saveCheckout() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const data = getCheckoutData();

        if (data.items.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        const customer = {
            nama: document.getElementById("nama").value,
            telepon: document.getElementById("telepon").value,
            alamat: document.getElementById("alamat").value,
            catatan: document.getElementById("catatan").value
        };

        localStorage.setItem("pixiequeCheckout",
            JSON.stringify({ customer, ...data })
        );

        window.location.href = "pembayaran.html";
    });
}

function showPayment() {
    const area = document.getElementById("payment-summary");
    const form = document.getElementById("payment-form");

    if (!area || !form) return;

    const checkout = JSON.parse(
        localStorage.getItem("pixiequeCheckout") || "null"
    );

    if (!checkout) {
        area.innerHTML = "<p>Data checkout belum tersedia.</p>";
        form.style.display = "none";
        return;
    }

    area.innerHTML = `
        <h3>Total Pembayaran</h3>
        <h2>${formatRupiah(checkout.total)}</h2>
        <p>Nama: ${checkout.customer.nama}</p>
    `;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const metode = new FormData(form).get("metode");

        const order = {
            ...checkout,
            metode: metode,
            status: "Menunggu konfirmasi",
            tanggal: new Date().toLocaleString("id-ID")
        };

        const orders = JSON.parse(
            localStorage.getItem("pixiequeOrders") || "[]"
        );

        orders.push(order);

        localStorage.setItem("pixiequeOrders",
            JSON.stringify(orders)
        );

        localStorage.removeItem("pixiequeCheckout");
        localStorage.removeItem("pixiequeCart");

        window.location.href = "pesanan.html";
    });
}

function showOrders() {
    const area = document.getElementById("order-list");
    if (!area) return;

    const orders = JSON.parse(
        localStorage.getItem("pixiequeOrders") || "[]"
    );

    if (orders.length === 0) {
        area.innerHTML = `
            <div class="order-card">
                <h3>Belum Ada Pesanan</h3>
                <p>Pesanan yang sudah dibuat akan muncul di sini.</p>
                <a href="toko.html" class="btn">Mulai Belanja</a>
            </div>
        `;
        return;
    }

    area.innerHTML = orders.map((order, index) => `
        <div class="order-card">
            <h3>Pesanan #${index + 1}</h3>
            <p><strong>Nama:</strong> ${order.customer.nama}</p>
            <p><strong>Nomor HP:</strong> ${order.customer.telepon}</p>
            <p><strong>Alamat:</strong> ${order.customer.alamat}</p>
            <p><strong>Produk:</strong></p>
            ${order.items.map(item => `
                <p>${item.name} x ${item.quantity}
                — ${formatRupiah(item.subtotal)}</p>
            `).join("")}
            <p><strong>Pembayaran:</strong> ${order.metode}</p>
            <p><strong>Total:</strong> ${formatRupiah(order.total)}</p>
            <p class="order-status">${order.status}</p>
            <small>${order.tanggal}</small>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", function() {
    showCheckout();
    saveCheckout();
    showPayment();
    showOrders();
});

function getCheckoutData() {
    const cart = getCart();
    let total = 0;

    const items = cart.map(item => {
        const product = products[item.id];

        if (!product) return null;

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            subtotal: subtotal
        };
    }).filter(Boolean);

    return { items, total };
}

function showCheckout() {
    const summary = document.getElementById("checkout-summary");
    const totalArea = document.getElementById("checkout-total");

    if (!summary || !totalArea) return;

    const data = getCheckoutData();

    summary.innerHTML = data.items.map(item => `
        <p>${item.name} x ${item.quantity} -
        ${formatRupiah(item.subtotal)}</p>
    `).join("");

    totalArea.textContent = formatRupiah(data.total);
}
function saveCheckout() {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const data = getCheckoutData();

        if (data.items.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        const customer = {
            nama: document.getElementById("nama").value,
            telepon: document.getElementById("telepon").value,
            alamat: document.getElementById("alamat").value,
            catatan: document.getElementById("catatan").value
        };

        localStorage.setItem("pixiequeCheckout",
            JSON.stringify({ customer, ...data })
        );

        window.location.href = "pembayaran.html";
    });
}

function showPayment() {
    const area = document.getElementById("payment-summary");
    const form = document.getElementById("payment-form");

    if (!area || !form) return;

    const checkout = JSON.parse(
        localStorage.getItem("pixiequeCheckout") || "null"
    );

    if (!checkout) {
        area.innerHTML = "<p>Data checkout belum tersedia.</p>";
        form.style.display = "none";
        return;
    }

    area.innerHTML = `
        <h3>Total Pembayaran</h3>
        <h2>${formatRupiah(checkout.total)}</h2>
        <p>Nama: ${checkout.customer.nama}</p>
    `;

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const metode = new FormData(form).get("metode");

        const order = {
            ...checkout,
            metode: metode,
            status: "Menunggu konfirmasi",
            tanggal: new Date().toLocaleString("id-ID")
        };

        const orders = JSON.parse(
            localStorage.getItem("pixiequeOrders") || "[]"
        );

        orders.push(order);

        localStorage.setItem("pixiequeOrders",
            JSON.stringify(orders)
        );

        localStorage.removeItem("pixiequeCheckout");
        localStorage.removeItem("pixiequeCart");

        window.location.href = "pesanan.html";
    });
}

function showOrders() {
    const area = document.getElementById("order-list");
    if (!area) return;

    const orders = JSON.parse(
        localStorage.getItem("pixiequeOrders") || "[]"
    );

    if (orders.length === 0) {
        area.innerHTML = `
            <div class="order-card">
                <h3>Belum Ada Pesanan</h3>
                <p>Pesanan yang sudah dibuat akan muncul di sini.</p>
                <a href="toko.html" class="btn">Mulai Belanja</a>
            </div>
        `;
        return;
    }

    area.innerHTML = orders.map((order, index) => `
        <div class="order-card">
            <h3>Pesanan #${index + 1}</h3>
            <p><strong>Nama:</strong> ${order.customer.nama}</p>
            <p><strong>Nomor HP:</strong> ${order.customer.telepon}</p>
            <p><strong>Alamat:</strong> ${order.customer.alamat}</p>
            <p><strong>Produk:</strong></p>
            ${order.items.map(item => `
                <p>${item.name} x ${item.quantity}
                — ${formatRupiah(item.subtotal)}</p>
            `).join("")}
            <p><strong>Pembayaran:</strong> ${order.metode}</p>
            <p><strong>Total:</strong> ${formatRupiah(order.total)}</p>
            <p class="order-status">${order.status}</p>
            <small>${order.tanggal}</small>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", function() {
    showCheckout();
    saveCheckout();
    showPayment();
    showOrders();
});