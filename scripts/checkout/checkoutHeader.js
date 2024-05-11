import {calculateCartQuantity} from "../../data/cart.js";

export function renderCheckoutHeader() {
  const CheckoutHeaderHTML = `
  Checkout (<a class="return-to-home-link js-return-to-home-link"
  href="amazon.html">${calculateCartQuantity()} items</a>)
  `;

  document.querySelector('.js-checkout-header-middle-section')
    .innerHTML = CheckoutHeaderHTML;
}