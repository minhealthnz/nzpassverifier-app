import * as React from "react";
import { useMemo } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useWindowScale } from "../../../common";

export type ForwardSlashProps = {
  readonly height: number;
  readonly width: number;
  readonly paddingHorizontal: number;
};

/**
 * Component which renders a forward slash. Give it custom width and height to adjust
 *
 * @param props - {@link ForwardSlashProps}
 */
export const ForwardSlash: React.FC<ForwardSlashProps> = (props) => {
  const { scaleFont } = useWindowScale();

  const svgWidth = props.width ? props.width : 11;
  const svgHeight = scaleFont(props.height ? props.height : 34);

  const pathString = `M${svgWidth - 0.5} 0.5 1 ${svgHeight - 0.5}`;

  const style = useMemo(() => ({ paddingHorizontal: props.paddingHorizontal }), [props.paddingHorizontal]);

  return (
    <View style={style}>
      <Svg width={svgWidth} height={svgHeight} fill="none">
        <Path stroke="#B3B3B3" d={pathString} />
      </Svg>
    </View>
  );
};
