
  class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.itemlist;
      products = products.map(itemlist => {
        const { itemTitle, cost } = itemlist.fields;
        const { id } = itemlist.sys;
        const image = itemlist.fields.image.fields.file.url;
        return { itemTitle, cost, id, image };
      });
      return products;
    } catch (error) {
      console.log(err);
    }
  }
}

let products = new Products();
let productTitle = products.getProducts.itemTitle;
let productCost = products.getProducts.cost;
let productId = products.getProducts.id;
let productImage = products.getProducts.image;



let shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  productTitle;
  productCost;
  productId;
  productImage;

  const title = document.querySelector(".title");
  const description = document.querySelector(".description");
  const imageId = document.getElementById("imageId");

  cart = [];
  
  // Constructor
  function Item(name, price, title, description, imageId, count) {
    this.name = name;
    this.price = price;
    this.title = title;
    this.description = description;
    this.imageId = imageId;
    this.count = count;
  }
  
  // Save cart
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  let obj = {};



  
  // Add to cart
  obj.addItemToCart = function(name, price, title, description, imageId, count) {
    for(let item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    let item = new Item(name, price, title, description, imageId, count);
    cart.push(item);
    saveCart();
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(let i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(let item in cart) {
        if(cart[item].name === name) {
          cart[item].count --;
          if(cart[item].count === 0) {
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(let item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  }

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  }

  // Count cart 
  obj.totalCount = function() {
    let totalCount = 0;
    for(let item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart
  obj.totalCart = function() {
    let totalCart = 0;
    for(let item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  }

  // List cart
  obj.listCart = function() {
    let cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy)
    }
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
$('.add-to-cart').click(function(event) {
  event.preventDefault();
  let name = $(this).data('name');
  let price = Number($(this).data('price'));
  let title = $(this).data('title');
  let description = $(this).data('description');
  let imageId = $(this).data('imageId');
  shoppingCart.addItemToCart(name, price, title, description, imageId, 1);
  displayCart();
});

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});




function displayCart() {
  let cartArray = shoppingCart.listCart();
  let output = "";
  for(let i in cartArray) {
    output += "<tr>"
    + "<td>(" + cartArray[i].imageId + ")</td>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td>(" + cartArray[i].price + ")</td>"
      + "<td>(" + cartArray[i].title + ")</td>"
      + "<td>(" + cartArray[i].description + ")</td>"
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function(event) {
  let name = $(this).data('name')
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function(event) {
  let name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function(event) {
  let name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
   let name = $(this).data('name');
   let count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();



// $(document).ready(function(){
//   let image = new Array ();
//     image[0] = "images/product-9.jpg";
//     let size = image.length
//     let x = Math.floor(size*Math.random());
//     let backgroundImageFile = image[x];
// $('#imageId')[0].setAttribute('src',backgroundImageFile);
// });

let image = new Array ();
image[0] = "images/product-9.jpg";
let size = image.length
let x = Math.floor(size*Math.random())
let backgroundImageFile = image[x];
let backgroundImageUrl = "url('" + backgroundImageFile + "')";
$('#imageId').css('background-image', 'backgroundImageUrl');
function op()
{
document.getElementById('imageId').innerHTML=backgroundImageUrl;
}