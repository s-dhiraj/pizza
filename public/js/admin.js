const moment=require('moment');
export function initAdmin(){
  const orderTableBody=document.querySelector('#orderTableBody');
  console.log("done successfully")
  let orders=[];
  let markup

  axios.get('/admin/orders',{
      headers:{
          "X-Requested-With":"XMLHttpRequest"
      }
  }.then(res =>{
      orders=res.data
      markup=generateMarkup(orders)
      orderTableBody.innerHTML=markup;
  })).catch(err=>{
      console.log(err);
  })

  function renderItems(items) {
    let parsedItems = Object.values(items)
    return parsedItems.map((menuItem) => {
        return `
            <p>${ menuItem.item.name } - ${ menuItem.qty } pcs </p>
        `
    }).join('')
  }
  
  function generateMarkup(orders){
      return orders.map(order => {
          return `
          <tr>
          <th scope="row">
              <p>${ order._id }</p>
              <div>${ renderItems(order.items)}</div>
          </th>
          <td>${ order.customerId.name }</td>
          <td>${ order.address }</td>
          <td>
              <div>
                <form action="" method="post">
                <select class="form-select" aria-label="Default select example">
                  <option selected>Placed</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </form>
              </div>
          </td>
          <td>${ moment(order.createdAt).format('hh:mm A') }</td>
        </tr>
        `
      }).join('')
  }
}
module.exports=initAdmin;