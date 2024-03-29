import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  ZoomControl,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import OrthologyGraphLoader from "../OrthologyGraphLoader";
import Graph from "graphology";
import GraphReducers from "../GraphReducers";
import DragNDrop from "../DragNDrop";
import { HoveredNodes, LayoutType } from "../../types";
import GeneInfoDisplayTrigger, {
  GeneInfoDisplayTriggerProps,
} from "../GeneInfoDisplayTrigger";
import GeneHoverEvent, {
  GeneHoverEventProps,
} from "../GeneHoverEvent/GeneHoverEvent";

interface GeneNetworkProps {
  geneid: string;
  graph: Graph;
  height?: string;
  width?: string;
  sigmaRef?: any;
  hiddenNodes?: Set<string>;
  hiddenEdges?: Set<string>;
  showLinkcom?: boolean;
  showPagerank?: boolean;
  layout?: LayoutType;
  onClick: GeneInfoDisplayTriggerProps["onClick"];
  onEnterNode: GeneHoverEventProps["onEnterNode"];
  onLeaveNode: GeneHoverEventProps["onLeaveNode"];
  hoveredNodes: HoveredNodes | null;
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
  showPagerank = false,
  layout = "forceatlas2",
  onClick,
  onEnterNode,
  onLeaveNode,
  hoveredNodes,
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
      <OrthologyGraphLoader geneid={geneid} graph={graph} layout={layout} />
      <ControlsContainer position={"top-right"}>
        <ZoomControl />
        <FullScreenControl />
        <GraphReducers
          hiddenNodes={hiddenNodes}
          hiddenEdges={hiddenEdges}
          showLinkcom={showLinkcom}
          showPagerank={showPagerank}
          hoveredNodes={hoveredNodes}
        />
      </ControlsContainer>
      <DragNDrop />
      <GeneHoverEvent onEnterNode={onEnterNode} onLeaveNode={onLeaveNode} />
      <GeneInfoDisplayTrigger onClick={onClick} />
      <ControlsContainer position={"bottom-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default GeneNetwork;
