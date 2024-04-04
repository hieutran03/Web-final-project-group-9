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