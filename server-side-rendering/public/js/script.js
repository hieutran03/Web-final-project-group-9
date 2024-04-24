const logout_form = document.querySelector('#logout_form');
if(logout_form){
  const logout_btn = document.querySelector('#logout_btn');
  if(logout_btn){
    logout_btn.addEventListener('click', (e)=>{
      logout_form.submit();
    })
  }
  
}
function incQuantity() {
  var value = parseInt(document.getElementById('product-quantity').value, 10);
  value = isNaN(value) ? 1 : value;
  value++;
  document.getElementById('product-quantity').value = value;
}

function decQuantity() {
  var value = parseInt(document.getElementById('product-quantity').value, 10);
  value = isNaN(value) ? 1 : value;
  value = value <= 1 ? 1 : value - 1;
  document.getElementById('product-quantity').value = value;
}
const btnAddToCart = document.querySelector('#add-to-cart');
if(btnAddToCart){
  console.log(btnAddToCart);
  const formUserService = document.querySelector('#form-user-service');
  if(formUserService){
    btnAddToCart.addEventListener('click', (e)=>{
      const productId = formUserService.getAttribute('data-product-id');
      formUserService.action = `/cart/${productId}`;
      formUserService.submit();
    })
  }
  
}