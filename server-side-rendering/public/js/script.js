const logout_form = document.querySelector("#logout_form");
if (logout_form) {
  const logout_btn = document.querySelector("#logout_btn");
  if (logout_btn) {
    logout_btn.addEventListener("click", (e) => {
      logout_form.submit();
    });
  }
}
function incQuantity() {
  var value = parseInt(document.getElementById("product-quantity").value, 10);
  value = isNaN(value) ? 1 : value;
  value++;
  document.getElementById("product-quantity").value = value;
}

function decQuantity() {
  var value = parseInt(document.getElementById("product-quantity").value, 10);
  value = isNaN(value) ? 1 : value;
  value = value <= 1 ? 1 : value - 1;
  document.getElementById("product-quantity").value = value;
}

// tăng giảm sản phẩm ở /cart
// function dec_Quantity(productId) {
//   var quantityInput = document.getElementById("product-quantity-" + productId);
//   var currentQuantity = parseInt(quantityInput.value);

//   if (currentQuantity > 1) {
//     quantityInput.value = currentQuantity - 1;
//   }
// }

// function inc_Quantity(productId) {
//   var quantityInput = document.getElementById("product-quantity-" + productId);
//   var currentQuantity = parseInt(quantityInput.value);

//   quantityInput.value = currentQuantity + 1;
//   console.log(productId);
// }
function dec_Quantity(productId) {
  var quantityInput = document.getElementById("product-quantity-" + productId);
  var currentQuantity = parseInt(quantityInput.value);

  if (currentQuantity > 1) {
    quantityInput.value = currentQuantity - 1;
    updateQuantity(productId, currentQuantity - 1); // Gọi hàm cập nhật số lượng
  }
}

function inc_Quantity(productId) {
  var quantityInput = document.getElementById("product-quantity-" + productId);
  var currentQuantity = parseInt(quantityInput.value);

  quantityInput.value = currentQuantity + 1;
  updateQuantity(productId, currentQuantity + 1); // Gọi hàm cập nhật số lượng
}
     
async function updateQuantity(productId, newQuantity) {
  try {
    const response = await fetch(`/cart/update/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to update quantity");
    }
    const { totalPrice, cartTotal } = await response.json();
    console.log(totalPrice, cartTotal)
    document.querySelector("#total-price").innerText = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalPrice);
    document.querySelector("#cart-total").innerText = cartTotal;
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

const btnAddToCart = document.querySelector("#add-to-cart");
if (btnAddToCart) {
  console.log(btnAddToCart);
  const formUserService = document.querySelector("#form-user-service");
  if (formUserService) {
    btnAddToCart.addEventListener("click", (e) => {a
      const productId = formUserService.getAttribute("data-product-id");
      formUserService.action = `/cart/${productId}`;
      formUserService.submit();
    });
  }    
}

const replyCommentProduct = document.querySelectorAll(".reply-comment-product");
if (replyCommentProduct.length > 0) {
  replyCommentProduct.forEach((replyComment) => {
    replyComment.addEventListener("click", (e) => {
      e.preventDefault();
      const formReplyComment = replyComment.nextElementSibling;
      formReplyComment.classList.toggle("d-none");
    });
  });
}
const ratingValue = document.querySelectorAll(".rating-value");
if (ratingValue.length > 0) {
  console.log(ratingValue);
  ratingValue.forEach((rating) => {
    rating.addEventListener("change", async (e) => {
      if (rating.checked == true) {
        const ratingValue = e.target.getAttribute("data-rating");
        const query = rating.closest('div[product-id]');
        const productId = query.getAttribute('product-id');
        // const userId = query.getAttribute('user-id');

        const response = await fetch(`/products/rating/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating: ratingValue }),
        });
        if (!response.ok) {
          throw new Error("Failed to rate product");
        } else {
        }
      }

    })
  });
}

const rating = document.querySelector("div[current-rating]");
if (rating && rating.getAttribute("current-rating") > 0) {
  const star = document.querySelector(`#star${rating.getAttribute("current-rating")}`);
  star.click();
}
