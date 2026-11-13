//Create an interface for the navbar
import NavBar from "./NavBar";
import { useState } from "react";
import type { ClothingProduct } from "../data/data";
import CheckoutContainer from "./CheckoutContainer";
import ItemContainer from "./ItemContainer";

interface ClothingData {
  // Catalog entries used to initialize state and supply card labels and options.
  data: ClothingProduct[];
}

export interface ItemInfo {
  // Links this state entry to the catalog item independently of array order.
  id: number;
  // Current selected quantity, kept nonnegative by FruitsApp's update function.
  itemQuantity: number;

  quantity: number;
  // Selected unit price, rather than the calculated total.
  price: number;
}

export interface CartItem {
  // A new UUID identifies each cart entry.
  id: string;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export default function ThriftHappensApp({ data }: ClothingData) {
  //Initialize the products
  const [itemInfo, setItemInfo] = useState<ItemInfo[]>(() =>
    data.map((item) => ({
      id: item.id,
      itemQuantity: item.itemQuantity,
      price: item.price,
      quantity: item.quantity,
    })),
  );

  // Start with an empty cart. Cart snapshots are independent of itemInfo:
  // changing a product's current quantity or price does not edit saved entries.
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  //Handlers

  // delta is the requested change (+1 or -1 from a card), not an absolute quantity.
  function handleAdjustQuantity(id: number, delta: number) {
    // A functional update uses the latest pending state, so successive clicks
    // build on previous updates even when React batches them.
    setItemInfo((prevData) =>
      // map creates a new array; spread copies only the matching object.
      // Preserve other entries and clamp the new quantity to zero.
      prevData.map((info) =>
        info.id === id
          ? {
              ...info,
              itemQuantity: Math.min(
                info.quantity,
                Math.max(0, info.itemQuantity + delta),
              ),
            }
          : info,
      ),
    );
  }

  //Handle to remove items from cart
  function handleRemoveFromCart(id: string) {
    // Find the cart item that has to be removed
    const itemToRemove = cartItems.find((item) => item.id === id);

    // Remove the item from the cart
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== id));

    // Restore the available stock
    setItemInfo((prevData) =>
      prevData.map((info) =>
        itemToRemove !== undefined && info.id === itemToRemove.productId
          ? {
              ...info,
              quantity: info.quantity + itemToRemove.quantity,
            }
          : info,
      ),
    );
  }

  // Functional updates preserve earlier additions when React batches updates.
  function handleAddToCart(cartItem: CartItem) {
    if (cartItem.quantity === 0) {
      return;
    }
    setCartItems((prevCart) => {
      // Check if the product already exists in the cart
      const existingItem = prevCart.find(
        (item) => item.productId === cartItem.productId,
      );

      // If there's an existing item, update its quantity and total
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === cartItem.productId
            ? {
                ...item,
                quantity: item.quantity + cartItem.quantity,
                total: (item.quantity + cartItem.quantity) * item.price,
              }
            : item,
        );
      }
      // else, add a new cart entry
      return [...prevCart, { ...cartItem }];
    });

    // Update stock after adding to cart
    setItemInfo((prevData) =>
      prevData.map((info) =>
        info.id === cartItem.productId
          ? {
              ...info,
              quantity: info.quantity - cartItem.quantity,
              itemQuantity: 0, //Update the quantity selector
            }
          : info,
      ),
    );
  }

  function handleEmptyCart() {
    // Restore the stock of every product in the cart
    setItemInfo((prevData) =>
      prevData.map((info) => {
        const cartItem = cartItems.find((item) => item.productId === info.id);
        return cartItem
          ? {
              ...info,
              quantity: info.quantity + cartItem.quantity,
            }
          : info;
      }),
    );
    // Empty the cart
    setCartItems([]);
  }

  return (
    <div>
      <NavBar />
      <br />
      <div className="Main">
        <ItemContainer
          data={data}
          itemInfo={itemInfo}
          handleAdjustQuantity={handleAdjustQuantity}
          handleAddToCart={handleAddToCart}
        />
        <CheckoutContainer
          cartData={cartItems}
          handleRemoveFromCart={handleRemoveFromCart}
          handleEmptyCart={handleEmptyCart}
        />
      </div>
    </div>
  );
}
