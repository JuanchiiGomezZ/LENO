/* Cart Working */
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

let section = document.querySelector("#shop");
let h2 = document.createElement("h2");
h2.classList.add("section-title");
h2.textContent = "";

section.appendChild(h2);

/* Maiking Function */
function ready() {
  /* REMOVE ITEM */

  const productos1 = JSON.parse(localStorage.getItem("carrito") || "[]");
  for (const product of productos1) {
    addProductToCart(
      product.id,
      product.title,
      product.price,
      product.productImg
    );
  }

  let removeCartButtons = document.getElementsByClassName("cart-remove");
  for (let i = 0; i < removeCartButtons.length; i++) {
    let button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  let quantityInput = document.getElementsByClassName("cart-quantity");
  for (let i = 0; i < quantityInput.length; i++) {
    let input = quantityInput[i];
    input.addEventListener("change", quantityChanged);
  }
  /* Add To Cart */
  let addCart = document.getElementsByClassName("add-cart");
  for (let i = 0; i < addCart.length; i++) {
    let button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  /* Buy Button */
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}
/* Buy Button */
function buyButtonClicked() {
  Swal.fire({
    title:'Felicitaciones',
    text:'¡Tu orden está hecha!',
    icon:'success'
  })
  const productos1 = JSON.parse(localStorage.getItem("carrito") || "[]");
  for (let i = productos1.length; i > 0; i--) {
    productos1.pop();
  }
  localStorage.setItem("carrito", JSON.stringify(productos1));

  let contador = document.getElementById("contador");
  contador.textContent = 0;

  let cart = document.querySelector(".cart");
  cart.classList.remove("active");
  let cartContent = document.getElementsByClassName("cart-content")[0];
  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }
  updateTotal();
}

function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.remove();

  const id = buttonClicked.parentElement.id;
  const productos1 = JSON.parse(localStorage.getItem("carrito") || "[]");
  const nuevosProductos = productos1.filter((producto) => producto.id !== id);
  localStorage.setItem("carrito", JSON.stringify(nuevosProductos));

  updateTotal();
}
/* Quantity Changes */
function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
}
/* Add To cart */
function addCartClicked(event) {
  let button = event.target;
  let shopProducts = button.parentElement;

  let id = shopProducts.id;
  let title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  let price = shopProducts.getElementsByClassName("price")[0].innerText;
  let productImg = shopProducts.getElementsByClassName("product-img")[0].src;

  const productos1 = JSON.parse(localStorage.getItem("carrito") || "[]");

  const existeProducto = productos1.find((producto) => producto.id == id);
  if (!existeProducto) {
    localStorage.setItem(
      "carrito",
      JSON.stringify([...productos1, { id, title, price, productImg }])
    );
  }
  addProductToCart(id, title, price, productImg);
  updateTotal();
}

function addProductToCart(id, title, price, productImg) {
  let cartShopBox = document.createElement("div");
  cartShopBox.setAttribute("id", id);

  cartShopBox.classList.add("cart-box");
  let cartItems = document.getElementsByClassName("cart-content")[0];
  let cartItemsNames = document.getElementsByClassName("cart-product-title");
  for (let i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      
      Swal.fire({
        title:'¡Ya agregaste este producto en el carro!',
        text:'Modifica su cantidad dentro del carro',
        icon:'warning'
      })
      return;
    }
  }

  let cartBoxContent = `<img src="${productImg}" alt="" class="cart-img">
                          <div class="detail-box">
                              <div class="cart-product-title">${title}</div>
                              <div class="cart-price">${price}</div>   
                              <input type="number" value="1" class="cart-quantity">             
                          </div>
                          <i class='bx bxs-trash-alt cart-remove'></i>
  `;
  localStorage.setItem("cartBox", cartBoxContent);
  cartShopBox.innerHTML = localStorage.getItem("cartBox");
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
}
let counter = 0;
//Update total
function updateTotal() {
  let cartContent = document.getElementsByClassName("cart-content")[0];
  let cartBoxes = document.getElementsByClassName("cart-box");
  let total = 0;
  let counter = 0;
  for (let i = 0; i < cartBoxes.length; i++) {
    let cartBox = cartBoxes[i];
    let priceElement = cartBox.getElementsByClassName("cart-price")[0];
    let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    let quantity = quantityElement.value;

    total += price * quantity;

    let contador = document.getElementById("contador");
    counter = JSON.parse(localStorage.getItem("carrito")).length
    localStorage.setItem("counter", counter);
    contador.textContent = JSON.parse(localStorage.getItem("counter"));
  }
  
  total = Math.round(total * 100) / 100;
  localStorage.setItem("total", JSON.stringify(total));
  document.getElementsByClassName("total-price")[0].innerText =
    "$" + JSON.parse(localStorage.getItem("total"));
}
