import { getCookie } from "./util"

var cart = JSON.parse(getCookie('cart'))

if (cart == undefined){
    cart = {}
    // console.log('Cart Created!', cart)
    document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
}

export function addCookieItem(action, product_id){
	// console.log('User is not authenticated')

	if (action == 'add'){
		if (cart[product_id] == undefined){
		cart[product_id] = {'quantity':1}

		}else{
			cart[product_id]['quantity']++
		}
	}

	if (action == 'remove'){
		cart[product_id]['quantity']--

		if (cart[product_id]['quantity'] <= 0){
			// console.log('Item should be deleted')
			delete cart[product_id];
		}
	}
	// console.log('CART:', cart)
	document.cookie ='cart=' + JSON.stringify(cart) + ";domain=;path=/"
	this.props.updatedToggler()
  this.props.cartUpdatedToggler()
	// location.reload()
}


export function addOrRemoveItemHandler(action, product_id) {
    const jwtToken = localStorage.getItem('access');
    const requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
        'Authorization': `JWT ${jwtToken}`
    },
      body: JSON.stringify({
        "action": action,
        "product_id": product_id
      })
    }
    fetch("/api/update-cart/", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data)
      if (data.message === 'Cart updated successfully') {
        this.setState(prevState => ({
          item_list: prevState.item_list.filter(item => item.product.id !== product_id || item.quantity !== 0)
        }));
        this.props.cartUpdatedToggler()
      }
      
    })
  }

export function handleOrderedItem(product_id) {
    // console.log('is being called')
    const jwtToken = localStorage.getItem('access');
    // console.log(getCookie("csrftoken"))
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
        'Authorization': `JWT ${jwtToken}`
    },
      body: JSON.stringify({"product_id": product_id})
    }
    fetch('/api/create-order/', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // console.log(data)
      this.props.updatedToggler()
    })
    .catch(error => console.error(`Fetch Error =\n`, error));
  }

export async function cookieCart() {
    const items = [];
    const order = { get_cart_total: 0, get_cart_items: 0, shipping: false };
    let cartItems = order.get_cart_items;

    for (const productId in cart) {
      try {
        if (cart[productId].quantity > 0) {
          cartItems += cart[productId].quantity;
          // console.log(productId)
          // Assuming you have an array 'products' that contains your product data
          const product = await fetch(`/api/product/${productId}`)
          .then((response) => {
            // console.log(response)
            if(response.ok) {
              return response.json()
            } else {
              this.setState({error: 'Product not found'})
            }
          })
          .then(data => {
            return data
          })
          .catch(error => console.log(error));
          console.log(product)
          if (product) {
            const total = product.price * cart[productId].quantity;

            order.get_cart_total += total;
            order.get_cart_items += cart[productId].quantity;

            const item = {
              id: product.id,
              product: product.name,
              price: product.price,
              image: product.image,
              quantity: cart[productId].quantity,
              // total_completed_orders: product.total_completed_orders,
              total: total,
            };

            items.push(item);

            if (!product.digital) {
              order.shipping = true;
            }
          }
        }
      } catch (error) {
        console.error('Error processing cart item:', error);
      }
    }

    return {total_items: order.get_cart_items,
      total_cost: order.get_cart_total,
      items: items,
      shipping: order.shipping
    }
  }

  // Utility function to get a cookie by name
