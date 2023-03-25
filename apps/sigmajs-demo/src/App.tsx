import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import GexfGraphLoader from "./components/GexfGraphLoader";

export const App = () => {
  return (
    <SigmaContainer style={{ height: "1024px", width: "1024px" }}>
      <GexfGraphLoader />
    </SigmaContainer>
  );
};

export default App;
