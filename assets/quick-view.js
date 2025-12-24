document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("QuickViewModal");
  const modalBody = document.getElementById("qv-body");
  document.body.addEventListener("click", function(e) {
    if (e.target.classList.contains("quick-view-btn")) {
      const handle = e.target.dataset.handle;
      modal.style.display = "flex";
      modalBody.innerHTML = "Loading...";
      fetch(`/products/${handle}?view=quick-view`)
        .then(res => res.text())
        .then(html => {
          modalBody.innerHTML = html;
          initSlider();
          initVariantChange();
          initAddToCart();
        });
    }
  });

  document.getElementById("qv-close").addEventListener("click", () => {
    modal.style.display = "none";
  });

  function initSlider() {
    const slides = document.querySelectorAll(".qv-slide-img");
    slides.forEach(img => img.style.cursor = "pointer");
  }

//  function initVariantChange() {
//   const select = document.getElementById("qv-variants");
//   const price = document.getElementById("qv-price");
//   if (!select) return;

//   select.addEventListener("change", () => {
//     const id = select.value;

//     fetch(`/variants/${id}.js`)
//       .then(r => r.json())
//       .then(v => {
//         const formattedPrice = Shopify.formatMoney(
//           v.price,
//           window.theme.moneyFormat || "{{ amount_no_decimals_with_comma_separator }}"
//         );

//         price.innerHTML = formattedPrice;
//       })
//       .catch(console.error);
//   });
// }


function initVariantChange() {
  const select = document.getElementById("qv-variants");
  const priceEl = document.getElementById("qv-price");
  const slider = document.querySelector(".qv-slider"); 
  if (!select || !priceEl || !slider) return;

  select.addEventListener("change", () => {
    const variantId = select.value;
    if (!variantId) return;

    fetch(`/variants/${variantId}.js`)
      .then(res => res.json())
      .then(variant => {
        let formattedPrice;
        if (window.Shopify && Shopify.formatMoney) {
          formattedPrice = Shopify.formatMoney(
            variant.price,
            window.theme && window.theme.moneyFormat
              ? window.theme.moneyFormat
              : "{{ amount_no_decimals_with_comma_separator }}"
          );
        } else {
          formattedPrice = " ₹"+ (variant.price / 100).toFixed(2); 
        }
        priceEl.innerHTML = formattedPrice;
        if (variant.featured_image && variant.featured_image.src) {
          slider.innerHTML = `<img src="${variant.featured_image.src}" class="qv-slide-img">`;
        }
      })
      .catch(err => console.error("Variant fetch error:", err));
  });
}

// Call after modal content is ready
document.addEventListener("DOMContentLoaded", initVariantChange);


  function initAddToCart() {
    const btn = document.getElementById("qv-add-cart");
    const select = document.getElementById("qv-variants");
    btn.addEventListener("click", () => {
    const activeVariant = document.querySelector(".qv-variant-btn.active");
    const variantId = activeVariant ? activeVariant.dataset.id : (select ? select.value : null);
    if (!variantId) {
      alert("Please select a variant");
      return;
    }
    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: {
        id: variantId,
        quantity: 1
      },
      dataType: "json",
      success: function (data) {
        $('.cartbtnicon').click();
        $('cart-drawer').removeClass('is-empty');
        $('.drawer__inner-empty').hide();
        $('cart-drawer').load(location.href + ' #CartDrawer');
        $('#cart-icon-bubble').load(location.href + ' #cart-icon-bubble');
        setTimeout(() => {
          $('.drawer').addClass('active');
        }, 1500);
        // $('.drawer').addClass('active');
        modal.style.display = "none";
        btn.innerText = "Added!";
        setTimeout(() => btn.innerText = "Add to Cart", 1500);
      },
      error: function (xhr, status, error) {
      console.log("Add to Cart Error:", error);
    }
  });
  });
}
});
