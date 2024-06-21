import {orders} from '../data/orders.js';
import { formatCurrency } from './utils/money.js';
import { loadProductsFetch ,getProduct } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
async function loadPage() {
  await loadProductsFetch();

  let orderHTML = '';

  orders.forEach((order) => {
    console.log(order);
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');
    orderHTML += `
        <div class="order-container">      
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
              <div>${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">${productListHTML(order)}</div>
        </div>
      `
  });

  function productListHTML(order) {
    let productListHTML = '';
    order.products.forEach((product) => {
      const matchingProduct = getProduct(product.productId);
      
      productListHTML += `
        <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${
              dayjs(product.estimatedDeliveryTime).format('MMMM, D')
            }
          </div>
          <div class="product-quantity">
            Quantity: ${product.quantity}
          </div>
          <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `
    });

    return productListHTML;
  }

  document.querySelector('.js-order-grid').innerHTML = orderHTML;

}
loadPage();
