import ThriftHappensApp from "./Components/ThriftHappens";
import "./App.css";
import { products } from "./data/data";
function App() {
  return (
    <>
      <ThriftHappensApp data={products} />
    </>
  );
}

export default App;
