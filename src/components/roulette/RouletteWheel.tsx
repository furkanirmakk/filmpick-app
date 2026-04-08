import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";

type RouletteWheelProps = {
  spinKey: number;
  targetIndex: number | null;
  isSpinning: boolean;
  onSpinEnd?: () => void;
};

const SIZE = 320;
const RADIUS = SIZE / 2;
const SLOT_COUNT = 36;

const NUMBERS = [
"0","32","15","19","4","21","2","25","17","34","6","27",
"13","36","11","30","8","23","10","5","24","16","33","1",
"20","14","31","9","22","18","29","7","28","12","35","3"
];
const SLOT_COLORS = [
"#16A34A",
"#DC2626","#111827","#DC2626","#111827","#DC2626","#111827",
"#DC2626","#111827","#DC2626","#111827","#DC2626","#111827",
"#DC2626","#111827","#DC2626","#111827","#DC2626","#111827",
"#DC2626","#111827","#DC2626","#111827","#DC2626","#111827",
"#DC2626","#111827","#DC2626","#111827","#DC2626","#111827",
"#DC2626","#111827","#DC2626","#111827","#DC2626","#111827"
];

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeRingSlice(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const p1 = polarToCartesian(cx, cy, outerRadius, startAngle);
  const p2 = polarToCartesian(cx, cy, outerRadius, endAngle);
  const p3 = polarToCartesian(cx, cy, innerRadius, endAngle);
  const p4 = polarToCartesian(cx, cy, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `
    M ${p1.x} ${p1.y}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}
    L ${p3.x} ${p3.y}
    A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}
    Z
  `;
}

export default function RouletteWheel({
  spinKey,
  targetIndex,
  isSpinning,
  onSpinEnd,
}: RouletteWheelProps) {
  const wheelAnim = useRef(new Animated.Value(0)).current;
  const ballAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const slotAngle = 360 / SLOT_COUNT;

  const slots = useMemo(() => {
    return Array.from({ length: SLOT_COUNT }).map((_, index) => {
      const start = index * slotAngle;
      const end = start + slotAngle;
      const mid = start + slotAngle / 2;
      const labelPoint = polarToCartesian(RADIUS, RADIUS, RADIUS - 46, mid);

      return {
        index,
        number: NUMBERS[index],
        color: SLOT_COLORS[index],
        path: describeRingSlice(RADIUS, RADIUS, RADIUS - 18, RADIUS - 56, start, end),
        labelPoint,
        labelRotate: mid + 90,
      };
    });
  }, [slotAngle]);

  useEffect(() => {
    if (!isSpinning || targetIndex === null) return;

    wheelAnim.stopAnimation();
    ballAnim.stopAnimation();
    glowAnim.stopAnimation();

    wheelAnim.setValue(0);
    ballAnim.setValue(0);
    glowAnim.setValue(0);

    const centerAngle = targetIndex * slotAngle + slotAngle / 2;

    // hedef slot pointer altında üstte bitsin
    const wheelFinal = 360 * 6 + (360 - centerAngle);

    const BALL_OFFSET = 4; // küçük kayma

    const ballFinal = -(360 * 9 + (360 - centerAngle) + BALL_OFFSET);

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 280,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.35,
          duration: 280,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );

    glowLoop.start();

    Animated.parallel([
      Animated.timing(wheelAnim, {
        toValue: wheelFinal,
        duration: 4200,
        easing: Easing.bezier(0.12, 0.8, 0.18, 1),
        useNativeDriver: true,
      }),
      Animated.timing(ballAnim, {
        toValue: ballFinal,
        duration: 4200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      glowLoop.stop();
      glowAnim.setValue(0);
      onSpinEnd?.();
    });
  }, [spinKey, isSpinning, targetIndex, slotAngle, wheelAnim, ballAnim, glowAnim, onSpinEnd]);

  const wheelRotation = wheelAnim.interpolate({
    inputRange: [0, 3600],
    outputRange: ["0deg", "3600deg"],
    extrapolate: "clamp",
  });

  const ballRotation = ballAnim.interpolate({
    inputRange: [-3600, 0],
    outputRange: ["-3600deg", "0deg"],
    extrapolate: "clamp",
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.22],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.glow,
          {
            transform: [{ scale: glowScale }],
            opacity: glowOpacity,
          },
        ]}
      />

      <View style={styles.pointerWrap}>
        <View style={styles.pointerOuter} />
        <View style={styles.pointerInner} />
      </View>

      <Animated.View
        style={[
          styles.ballOrbitLayer,
          {
            transform: [{ rotate: ballRotation }],
          },
        ]}
        pointerEvents="none"
      >
        <View style={styles.ballTrack}>
          <View style={styles.ball} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.wheelShell,
          {
            transform: [{ rotate: wheelRotation }],
          },
        ]}
      >
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <Circle cx={RADIUS} cy={RADIUS} r={RADIUS - 6} fill="#4A1B06" />
          <Circle cx={RADIUS} cy={RADIUS} r={RADIUS - 10} fill="none" stroke="#C07A2C" strokeWidth={12} />
          <Circle cx={RADIUS} cy={RADIUS} r={RADIUS - 28} fill="#5B2209" stroke="#8A4A16" strokeWidth={4} />

          <G>
            {slots.map((slot) => (
              <Path
                key={slot.index}
                d={slot.path}
                fill={slot.color}
                stroke="#E5E7EB"
                strokeWidth={2}
              />
            ))}
          </G>

          <Circle cx={RADIUS} cy={RADIUS} r={RADIUS - 62} fill="#311004" stroke="#D1D5DB" strokeWidth={6} />
          <Circle cx={RADIUS} cy={RADIUS} r={78} fill="#5E240A" stroke="#2A0E03" strokeWidth={3} />
          <Circle cx={RADIUS} cy={RADIUS} r={36} fill="#D6D6D6" stroke="#7C7C7C" strokeWidth={4} />
          <Circle cx={RADIUS} cy={RADIUS} r={17} fill="#B8B8B8" stroke="#8A8A8A" strokeWidth={3} />

          {Array.from({ length: 24 }).map((_, index) => {
            const point = polarToCartesian(RADIUS, RADIUS, RADIUS - 14, index * 15);
            return (
              <Circle
                key={`dot-${index}`}
                cx={point.x}
                cy={point.y}
                r={3}
                fill={index % 2 === 0 ? "#F6D98A" : "#C8902D"}
                stroke="#7A4B12"
                strokeWidth={0.8}
              />
            );
          })}
        </Svg>

        <View style={styles.numberLayer} pointerEvents="none">
          {slots.map((slot) => (
            <View
              key={`label-${slot.index}`}
              style={[
                styles.numberWrap,
                {
                  left: slot.labelPoint.x - 14,
                  top: slot.labelPoint.y - 9,
                  transform: [{ rotate: `${slot.labelRotate}deg` }],
                },
              ]}
            >
              <Text style={styles.numberText}>{slot.number}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  glow: {
    position: "absolute",
    width: SIZE - 6,
    height: SIZE - 6,
    borderRadius: (SIZE - 6) / 2,
    backgroundColor: "#D4AF37",
  },

  wheelShell: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#2B0F04",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 15,
  },

  pointerWrap: {
    position: "absolute",
    top: -2,
    zIndex: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  pointerOuter: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 30,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#D4AF37",
  },

  pointerInner: {
    position: "absolute",
    top: 3,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFF1B8",
  },

  ballOrbitLayer: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    zIndex: 35,
    alignItems: "center",
    justifyContent: "center",
  },

  ballTrack: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  ball: {
    marginTop: 29,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#A1A1AA",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.7,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  numberLayer: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },

  numberWrap: {
    position: "absolute",
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});