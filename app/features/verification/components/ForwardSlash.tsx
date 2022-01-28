import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
import { useWindowScale } from "../../../common";

export type ForwardSlashProps = SvgProps & {
  readonly height: number;
  readonly width: number;
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

  return (
    <Svg {...props} width={svgWidth} height={svgHeight} fill="none">
      <Path stroke="#B3B3B3" d={pathString} />
    </Svg>
  );
};
