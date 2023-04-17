import {
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
} from "@chakra-ui/react";
import { useState } from "react";
import Sigma from "sigma";

interface ScoreSliderProps {
  sigma: Sigma | null;
  onChange: (edgeIds: Set<string>) => void;
}
const ScoreSlider = ({ sigma, onChange }: ScoreSliderProps) => {
  const [sliderValue, setSliderValue] = useState([1, 16]);

  const handleOnChangeEnd = (values: number[]) => {
    const [min, max] = values;
    if (!sigma) {
      return null;
    }
    const graph = sigma.getGraph();
    const allEdges = new Set(graph.edges());
    const selectedEdges = new Set(
      [...allEdges].filter((edgeId) => {
        const weight = graph.getEdgeAttribute(edgeId, "weight");
        return min <= weight && weight <= max;
      })
    );
    const edgesToHide = new Set(
      [...allEdges].filter((x) => !selectedEdges.has(x))
    );
    onChange(edgesToHide);
  };
  return (
    <div className={"ml-5 w-72"}>
      <h4 className={"font-bold mb-10 -ml-5"}>Ortholog Score:</h4>
      <RangeSlider
        aria-label={["min", "max"]}
        defaultValue={[1, 16]}
        min={1}
        max={16}
        step={1}
        onChangeEnd={handleOnChangeEnd}
        onChange={(value) => setSliderValue(value)}
      >
        <RangeSliderMark value={1} mt="1" ml="-1.5" fontSize="sm">
          1
        </RangeSliderMark>
        <RangeSliderMark value={4} mt="1" ml="-1.5" fontSize="sm">
          4
        </RangeSliderMark>
        <RangeSliderMark value={8} mt="1" ml="-1.5" fontSize="sm">
          8
        </RangeSliderMark>
        <RangeSliderMark value={12} mt="1" ml="-1.5" fontSize="sm">
          12
        </RangeSliderMark>
        <RangeSliderMark value={16} mt="1" ml="-1.5" fontSize="sm">
          16
        </RangeSliderMark>
        <RangeSliderMark
          value={sliderValue[0]}
          textAlign="center"
          bg="gray.400"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {sliderValue[0]}
        </RangeSliderMark>
        <RangeSliderMark
          value={sliderValue[1]}
          textAlign="center"
          bg="gray.400"
          color="white"
          mt="-10"
          ml="-5"
          w="12"
        >
          {sliderValue[1]}
        </RangeSliderMark>
        <RangeSliderTrack bg={"gray.300"}>
          <RangeSliderFilledTrack bg={"indigo"} />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} bg={"indigo"} />
        <RangeSliderThumb index={1} bg={"indigo"} />
      </RangeSlider>
    </div>
  );
};

export default ScoreSlider;
