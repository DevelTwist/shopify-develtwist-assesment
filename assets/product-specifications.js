/**
 * <product-specifications>
 *
 * Swaps the specification grid values when the customer changes variant.
 * It reads a pre-rendered, per-variant value map (keyed by variant id) and
 * subscribes to Dawn's global `variant-change` pub/sub event.
 *
 * No network calls are made: every value is rendered up-front by Liquid, so
 * variant switching is instant and works even if the AJAX product update fails.
 */
if (!customElements.get('product-specifications')) {
  customElements.define(
    'product-specifications',
    class ProductSpecifications extends HTMLElement {
      constructor() {
        super();
        this.data = {};
        this.valueElements = [];
        this.unsubscribe = undefined;
      }

      connectedCallback() {
        const dataScript = this.querySelector('[data-specifications-data]');

        try {
          this.data = dataScript ? JSON.parse(dataScript.textContent) : {};
        } catch (error) {
          // Malformed JSON should never break the page; just keep the
          // server-rendered values in place.
          console.warn('product-specifications: could not parse data map', error);
          this.data = {};
        }

        this.valueElements = Array.from(this.querySelectorAll('[data-spec-value]'));

        if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
            const variant = event && event.data && event.data.variant;
            if (variant && variant.id != null) {
              this.render(variant.id);
            }
          });
        }
      }

      disconnectedCallback() {
        if (this.unsubscribe) this.unsubscribe();
      }

      render(variantId) {
        const specs = this.data[variantId];
        if (!Array.isArray(specs)) return;

        this.valueElements.forEach((element) => {
          const index = Number(element.dataset.specIndex);
          if (Number.isInteger(index) && index < specs.length) {
            // textContent (not innerHTML) keeps the values inert against injection.
            element.textContent = specs[index];
          }
        });
      }
    }
  );
}
