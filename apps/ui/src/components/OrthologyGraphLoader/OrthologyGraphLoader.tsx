import { useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import { useLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import Graph from "graphology";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { useLayoutCirclepack } from "@react-sigma/layout-circlepack";
import { LayoutType } from "../../types";
import { useLayoutForce } from "@react-sigma/layout-force";
import { useLayoutNoverlap } from "@react-sigma/layout-noverlap";
import { useLayoutRandom } from "@react-sigma/layout-random";

interface OrthologyGraphLoaderProps {
  geneid: string;
  graph: Graph;
  layout?: LayoutType;
}

/**
 * Loader used by react-sigma to load the graphology graph data.
 * Data is pre-fetched by react-router and passed into this component
 * as a property.
 *
 * See the loader for the /network/gene route in `src/main.tsx`.
 *
 * @param geneid - The gene ID
 * @param graph - The graphology graph object.
 * @param layout - The graph Layout to use.
 */
const OrthologyGraphLoader = ({
  geneid,
  graph,
  layout = "forceatlas2",
}: OrthologyGraphLoaderProps) => {
  const circular = useLayoutCircular();
  const circlepack = useLayoutCirclepack();
  const forceatlas2 = useLayoutForceAtlas2();
  const force = useLayoutForce();
  const noverlap = useLayoutNoverlap();
  const random = useLayoutRandom();

  const Layouts: Record<LayoutType, () => void> = {
    forceatlas2: forceatlas2.assign,
    circular: circular.assign,
    circlepack: circlepack.assign,
    force: force.assign,
    noverlap: noverlap.assign,
    random: random.assign,
  };

  const assign = Layouts[layout];
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const initGraph = () => {
      loadGraph(graph);
      assign();
    };
    initGraph();
  }, [loadGraph, assign]);

  return null;
};

export default OrthologyGraphLoader;
