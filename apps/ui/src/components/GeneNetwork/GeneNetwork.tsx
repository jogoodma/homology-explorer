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
import Graph from "graphology";
import GraphReducers from "../GraphReducers";
import DragNDrop from "../DragNDrop";

interface GeneNetworkProps {
  geneid: string;
  graph: Graph;
  height?: string;
  width?: string;
  sigmaRef?: any;
  hiddenNodes?: Set<string>;
  hiddenEdges?: Set<string>;
  showLinkcom?: boolean;
}
export const GeneNetwork = ({
  geneid,
  graph,
  height = "768px",
  width = "1024px",
  sigmaRef = () => {},
  hiddenNodes = new Set(),
  hiddenEdges = new Set(),
  showLinkcom = false,
}: GeneNetworkProps) => {
  const sigmaSettings = {
    renderEdgeLabels: true,
  };
  return (
    <SigmaContainer
      ref={sigmaRef}
      style={{ height, width }}
      settings={sigmaSettings}
    >
      <OrthologyGraphLoader geneid={geneid} graph={graph} />
      <ControlsContainer position={"top-right"}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control />
        <GraphReducers
          hiddenNodes={hiddenNodes}
          hiddenEdges={hiddenEdges}
          showLinkcom={showLinkcom}
        />
        <DragNDrop />
      </ControlsContainer>
      <ControlsContainer position={"bottom-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default GeneNetwork;
