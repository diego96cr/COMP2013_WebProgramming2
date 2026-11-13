import type { CartItem } from "./ThriftHappens";

// Displays one saved cart snapshot. The default export is imported as CartCard
// by the list component.
// Destructuring extracts fields from React's single props object.

interface CheckoutCardProps extends CartItem {
  handleRemoveFromCart: (id: string) => void;
}

export default function CheckoutCard({
  id,
  name,
  image,
  price,
  total,
  quantity,
  handleRemoveFromCart,
}: CheckoutCardProps) {
  return (
    <div className="CheckoutCard">
      <h2>{name}</h2>
      <img src={image} alt="" height="100px" />
      {/*<p>Item quantity: {itemQuantity}</p>*/}
      <p>Quantity: {quantity}</p>
      {/* Format each monetary value where it is displayed. toFixed returns a
          string and hides floating-point display artifacts; it does not mutate
          the numeric price or total stored in the cart. */}
      <p>price: {price.toFixed(2)}$</p>
      <p>total: {total.toFixed(2)}$</p>
      <button onClick={() => handleRemoveFromCart(id)}>Remove</button>
    </div>
  );
}
