document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function (evt) {
    const applyBtn = document.querySelector('#apply_discount_btn');
    const codeInput = document.querySelector('#discount_code_');
    const message = document.querySelector('#discount_message_');
    if(evt.target.id == 'apply_discount_btn'){
      const code = codeInput.value.trim();
      if (!code) {
        message.textContent = 'Please enter a discount code.';
        message.style.color = 'red';
        return;
      }

      fetch(window.Shopify.routes.root + 'cart/update.js', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          discount: code,
          sections: ["cart-drawer"]
        }),
      })
        .then(resp => resp.json())
        .then(result => {
          const parser = new DOMParser();
          const html = parser.parseFromString(result.sections['cart-drawer'], 'text/html');
          const oldDrawer = document.querySelector('cart-drawer');
          const newDrawer = html.querySelector('cart-drawer');
          if (oldDrawer && newDrawer) {
            oldDrawer.innerHTML = newDrawer.innerHTML;
          }
        });
    }
  });
});

// infinite scrolling 

  document.addEventListener("DOMContentLoaded", function() {
    var endlessScroll = new Ajaxinate({
      method: 'scroll', 
      container: '#product-grid',
      pagination: '#AjaxinatePagination'
    });
  });


  