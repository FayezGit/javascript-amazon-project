import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js';
import {loadFromStorage,cart} from '../../data/cart.js'
import {getProduct, loadProductsFetch} from '../../data/products.js';
import {formatCurrency} from '../../scripts/utils/money.js';

describe('test suite: renderOrderSummary', () => {
  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';
  let productObject1 = '';
  let productObject2 = '';
  beforeAll((done) => {
    loadProductsFetch().then(() => {
      productObject1 = getProduct(productId1);
      productObject2 = getProduct(productId2);
      done();
    });
  });
  
  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    document.querySelector('.js-test-container')
      .innerHTML = `
        <div class="js-order-summary"></div>
        <div class="js-payment-summary"></div>
        <div class="js-checkout-header-middle-section"></div>
      `
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      }]);
    });
    loadFromStorage();
    renderOrderSummary();
  });

  afterEach(() => {
    document.querySelector('.js-test-container')
      .innerHTML = '';
  });

  it('displays the cart', () => {
    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(2);
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain('Quantity: 2');
    expect(
      document.querySelector(`.js-product-quantity-${productId2}`).innerText
    ).toContain('Quantity: 1');
    expect(
      document.querySelector(`.js-product-name-${productId1}`).innerText
    ).toEqual(`${productObject1.name}`);
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual(`${productObject2.name}`);
    expect(
      document.querySelector(`.js-product-price-${productId1}`).innerText
    ).toEqual(`$${formatCurrency(productObject1.priceCents)}`);
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual(`$${formatCurrency(productObject2.priceCents)}`);
  });

  it('remove a product', () => {
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(1);
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId2);
    expect(
      document.querySelector(`.js-product-name-${productId2}`).innerText
    ).toEqual(`${productObject2.name}`);
    expect(
      document.querySelector(`.js-product-price-${productId2}`).innerText
    ).toEqual(`$${formatCurrency(productObject2.priceCents)}`);
  });

  it('update the delivery option', () => {
    document.querySelector(`.js-delivery-option-${productId1}-3`).click();
    expect(
      document.querySelector(`.js-delivery-option-input-${productId1}-3`).checked
    ).toEqual(true);
    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId1);
    expect(cart[0].deliveryOptionId).toEqual('3');
    expect(
      document.querySelector('.js-shipping-cost').innerText
    ).toEqual('$14.98');
    expect(
      document.querySelector('.js-total-cost').innerText
    ).toEqual('$63.50');
  })
});