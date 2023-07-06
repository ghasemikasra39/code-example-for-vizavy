import * as React from "react"
import Svg, {G, Path, Circle} from "react-native-svg"

export default function MuteIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G fill="none" fillRule="evenodd">
        <G fill="#9A9A9A" fillRule="nonzero">
          <Path
            d="M19.468 16.906a6.682 6.682 0 01-2.39-5.123V8.996c0-3.517-2.626-6.429-6.027-6.917V1C11.05.448 10.6 0 10.046 0c-.555 0-1.005.447-1.005 1v1.08c-3.402.487-6.027 3.399-6.027 6.916v2.787a6.69 6.69 0 01-2.4 5.131c-.39.333-.614.817-.614 1.329 0 .964.789 1.749 1.758 1.749h16.576c.97 0 1.758-.785 1.758-1.75a1.75 1.75 0 00-.624-1.336zM10.046 23.999c1.82 0 3.341-1.29 3.69-2.999h-7.38a3.769 3.769 0 003.69 2.999z"/>
        </G>
        <G transform="translate(12 12)">
          <Circle
            stroke="#FFF"
            strokeWidth={0.5}
            fill="#9A9A9A"
            cx={5.75}
            cy={5.75}
            r={6}
          />
          <G fill="#FFF">
            <Path
              d="M9.448 3.54a.588.588 0 010 .848L5.206 8.46a.638.638 0 01-.884 0 .588.588 0 010-.849L8.564 3.54a.638.638 0 01.884 0z"/>
            <Path
              d="M5.128 8.409a.638.638 0 01-.884 0L2.122 6.372a.588.588 0 010-.848.638.638 0 01.884 0L5.128 7.56a.588.588 0 010 .849z"/>
          </G>
        </G>
      </G>
    </Svg>
  )
}
