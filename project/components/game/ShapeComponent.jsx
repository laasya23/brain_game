import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect, Polygon, Path } from 'react-native-svg';

export default function ShapeComponent({ shape, size = 60, color = '#FF6B6B' }) {
  const renderShape = () => {
    const halfSize = size / 2;

    switch (shape) {
      case 'circle':
        return (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle cx={halfSize} cy={halfSize} r={halfSize - 2} fill={color} />
          </Svg>
        );

      case 'square':
        return (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Rect x={2} y={2} width={size - 4} height={size - 4} fill={color} />
          </Svg>
        );

      case 'triangle':
        const points = `${halfSize},${4} ${size - 4},${size - 4} ${4},${size - 4}`;
        return (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Polygon points={points} fill={color} />
          </Svg>
        );

      case 'star':
        const starPoints = generateStarPoints(halfSize, halfSize, 5, halfSize - 4, (halfSize - 4) * 0.4);
        return (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Polygon points={starPoints} fill={color} />
          </Svg>
        );

      case 'heart':
        const heartPath = `M ${halfSize} ${size * 0.9}
          C ${halfSize} ${size * 0.9}, ${4} ${size * 0.6}, ${4} ${size * 0.35}
          C ${4} ${size * 0.15}, ${size * 0.25} ${4}, ${halfSize} ${size * 0.35}
          C ${size * 0.75} ${4}, ${size - 4} ${size * 0.15}, ${size - 4} ${size * 0.35}
          C ${size - 4} ${size * 0.6}, ${halfSize} ${size * 0.9}, ${halfSize} ${size * 0.9} Z`;
        return (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Path d={heartPath} fill={color} />
          </Svg>
        );

      default:
        return (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle cx={halfSize} cy={halfSize} r={halfSize - 2} fill={color} />
          </Svg>
        );
    }
  };

  return <View style={styles.container}>{renderShape()}</View>;
}

function generateStarPoints(centerX, centerY, points, outerRadius, innerRadius) {
  let starPoints = '';
  const angle = Math.PI / points;

  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const currAngle = i * angle - Math.PI / 2;
    const x = centerX + r * Math.cos(currAngle);
    const y = centerY + r * Math.sin(currAngle);
    starPoints += `${x},${y} `;
  }

  return starPoints.trim();
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
