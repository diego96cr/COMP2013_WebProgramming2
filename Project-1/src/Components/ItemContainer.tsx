import type { ClothingProduct } from "../data/data";
import type { ItemInfo } from "./ThriftHappens";
import type { CartItem } from "./ThriftHappens";
import ItemCard from "./ItemCard";

// This component arranges cards and connects catalog items to their current state.
// It forwards actions to FruitsApp rather than implementing state updates itself.
interface ItemContainerProps {
  data: ClothingProduct[];
  itemInfo: ItemInfo[];
  // Container callbacks include the ID because they can update any fruit.
  handleAdjustQuantity: (id: number, delta: number) => void;
  // Unlike quantity/price callbacks, this accepts the complete cart snapshot.
  handleAddToCart: (cartItem: CartItem) => void;
}

// React supplies one props object; destructuring extracts its named properties.
export default function ItemContainer({
  data,
  itemInfo,
  handleAdjustQuantity,
  handleAddToCart,
}: ItemContainerProps) {
  return (
    <div className="ItemContainer">
      {data.map((item) => {
        // Match by stable ID rather than assuming the arrays have the same order.
        const info = itemInfo.find((info) => info.id === item.id);
        // Avoid rendering a card with undefined state if no matching entry exists.
        if (!info) return null;

        // key lets React track each card across list renders; it is not a card prop.
        // {...item} forwards catalog fields. The callbacks capture this item's ID,
        // so the card only supplies a quantity change.
        return (
          <ItemCard
            key={item.id}
            {...item}
            itemInfo={info}
            handleQuantityAdjust={(delta) =>
              handleAdjustQuantity(item.id, delta)
            }
            handleAddToCart={handleAddToCart}
          />
        );
      })}
    </div>
  );
}
