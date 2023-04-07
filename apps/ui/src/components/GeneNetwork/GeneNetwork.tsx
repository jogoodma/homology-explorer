import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import OrthologyGraphLoader from "../OrthologyGraphLoader";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import { useParams } from "react-router-dom";

export const GeneNetwork = () => {
  const { geneid } = useParams();

  if (!geneid) return null;

  return (
    <SigmaContainer style={{ height: "1024px", width: "1400px" }}>
      <OrthologyGraphLoader geneid={geneid} />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default GeneNetwork;
