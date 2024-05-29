
paypal
  .Buttons({
    createOrder: function () {
      return fetch("/payment/create", {
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
        async function () {
          const response = await fetch("/orders/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "orderId": data.orderID,
              "items": items,
              "totalPrice": totalPrice,
              "receiver": document.querySelector("#payment-name").value,
              "address": document.querySelector("#payment-address").value,
              "phone": document.querySelector("#payment-phone").value,
              "paymentMethod": "Paypal",
            }),
            // redirect: "follow",
          });
          // console.log(response)
          alert("Cảm ơn quý khách đã thanh toán đơn hàng!")
          setTimeout(() => {
            window.location.href = response.url;
          }, 1500);
        }
      );
    },
    oncancel: function (data) {
      window.location.href = "/";
    },
    onError: function (err) {
      console.error(err);
    }
  })
  .render("#paypal")
