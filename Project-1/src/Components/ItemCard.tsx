import type { ClothingProduct } from "../data/data";
import type { ItemInfo } from "./ThriftHappens";
import type { CartItem } from "./ThriftHappens";

interface ItemCardProps extends ClothingProduct {
  itemInfo: ItemInfo;
  handleQuantityAdjust: (delta: number) => void;
  handleAddToCart: (cartItem: CartItem) => void;
}

export default function ItemCard({
  id,
  name,
  image,
  fit,
  category,
  color,
  description,
  size,
  itemInfo,
  handleQuantityAdjust,
  handleAddToCart,
}: ItemCardProps) {
  return (
    <div className="ItemCard">
      <h2>{name}</h2>
      <img src={image} alt="" height="100px" />
      <br />
      <p>Fit: {fit}</p>
      <p>Category: {category}</p>
      <p>Color: {color}</p>
      <p>{description}</p>
      <p>Size: {size}</p>
      <p>
        <strong>Price: </strong>
        {itemInfo.price.toFixed(2)}$
      </p>
      <p>
        <strong>Quantity: {itemInfo.quantity}</strong>
      </p>

      {/* Arrow functions defer actions until a click; the parent enforces the floor. */}
      <div className="Quantity">
        <button onClick={() => handleQuantityAdjust(-1)}>{" - "}</button>
        <span>{itemInfo.itemQuantity}</span>
        <button onClick={() => handleQuantityAdjust(1)}>{" + "}</button>
      </div>
      {/* This preview derives its total from the current selection.
          toFixed(2) returns a display string; it does not change the numbers
          or apply formatting to values later passed to another component. */}
      <br />
      {/* Build a snapshot only when clicked. A fresh UUID distinguishes this
          cart entry from both the fruit ID and previous entries of the same fruit.
          Keep price and total numeric for calculations; cart components format
          their own displays. Later selection changes do not alter this snapshot. */}
      <button
        onClick={() =>
          handleAddToCart({
            id: crypto.randomUUID(),
            name,
            productId: id,
            image,
            quantity: itemInfo.itemQuantity,
            price: itemInfo.price,
            //itemQuantity: itemInfo.itemQuantity,
            total: itemInfo.itemQuantity * itemInfo.price,
          })
        }
        disabled={itemInfo.quantity === 0}
        value="Out of Stock"
      >
        {itemInfo.quantity > 0 ? "Add to Checkout" : "Out of Stock"}
      </button>
    </div>
  );
}
