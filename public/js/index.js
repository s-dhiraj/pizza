
let addTocart = document.querySelectorAll(".add-to-cart");
let cart_number = document.querySelector(".cart-number");
function updateCart(pizza) {
  axios.post("/update-cart", pizza).then((res) => {
    //console.log(res);
    cart_number.innerText = res.data.totalQty;
    swal({
      title: "Added to cart",
      text: "Go to cart page!",
      icon: "success",
      button: "Ok",
      className: "sweet-alert-our",
    }).catch(err=>{
      swal ( "Oops" ,  "Something went wrong!" ,  "error" )    
    })
  })
}
addTocart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //let pizza=btn.dataset.pizza;
    //pizza=JSON.stringify(pizza);
    //pizza=JSON.parse(pizza);
    let pizza = JSON.parse(btn.dataset.pizza);

    // console.log(pizza);
    updateCart(pizza);

    //console.log(pizza);
  });
});

// removing seccess message after some time
const alertmsg = document.querySelector("#sucess-alert");
if (alertmsg) {
  setTimeout(() => {
    alertmsg.remove();
  }, 2000);
}

function initAdmin(socket) {
  const orderTableBody = document.querySelector("#orderTableBody");
  // console.log("done successfully");
  let orders = [];
  //   console.log(typeof (orders))
  let markup;

  axios
    .get("/admin/order", {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
    })
    .then((res) => {
      // console.log(typeof (res.data))
      orders = res.data;
      markup = generateMarkup(orders);

      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `
            <p>${menuItem.item.name} - ${menuItem.qty} pcs </p>
        `;
      })
      .join("");
  }

  function generateMarkup(orders) {
    return orders.map((order) => {
        return `
          <tr>
          <th scope="row">
              <p>${order._id}</p>
              <div>${renderItems(order.items)}</div>
          </th>
          <td>${order.customerId.name}</td>
          <td>${order.address}</td>
          <td>
              <div>
                <form action="/admin/order/status" method="post">
                <input type="hidden" name="orderId" value="${ order._id }">
                <select class="form-select" aria-label="Default select example" name="status" onchange="this.form.submit()">
                  
                <option value="order_placed"
                ${ order.status === 'order_placed' ? 'selected' : '' }>
                Placed</option>
            <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                Confirmed</option>
            <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                Prepared</option>
            <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                Delivered
            </option>
            <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                Completed
            </option>
                </select>
              </form>
              </div>
          </td>
          <td>
          ${moment(order.createdAt).format("hh:mm A")}<br>
          ${moment(order.createdAt).format("MM-DD-YYYY")}
      </td>
        </tr>
        `;
      })
      .join("");
  }
  //generateMarkup(orders)
      // Socket
      socket.on('orderPlaced', (order) => {
        // new Noty({
        //     type: 'success',
        //     timeout: 1000,
        //     text: 'New order!',
        //     progressBar: false,
        // }).show();
        orders.unshift(order)
        orderTableBody.innerHTML = ''
        orderTableBody.innerHTML = generateMarkup(orders)
    })
}



// change order status

let statuses = document.querySelectorAll('.status_timeline')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step_completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step_completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })
  

}

updateStatus(order);

// Socket
let socket = io()
// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
    initAdmin(socket)
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    // new Noty({
    //     type: 'success',
    //     timeout: 1000,
    //     text: 'Order updated',
    //     progressBar: false,
    // }).show();
})

