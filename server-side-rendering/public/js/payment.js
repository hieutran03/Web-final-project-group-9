paypal
  .Buttons({
    createOrder: function () {
      return fetch("/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "totalPrice": totalPrice,
          "items": items,
        }),
      }).then(res => {
          if (res.ok) return res.json();
          return res.json().then(json => Promise.reject(json));
        })
        .then(({ id }) => {
          return id;
        })
        .catch(e => {
          console.error(e.error);
        })
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(
        function () {
          window.location.href = "/";
        }
      );
    },
  })
  .render("#paypal")
