import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const AnimatedView = Animated.createAnimatedComponent(View);

const SIZE = 300;
const RADIUS = SIZE / 2;
const CENTER_CIRCLE = 78;

const segments = [
  { label: "Action", color: "#F3B42A" },
  { label: "Drama", color: "#7B61FF" },
  { label: "Comedy", color: "#3296F3" },
  { label: "Thriller", color: "#39D17D" },
  { label: "Sci-Fi", color: "#FF6B6B" },
  { label: "Romance", color: "#7C63F5" },
  { label: "Animation", color: "#FF7A1A" },
  { label: "Crime", color: "#2ECC71" },
];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArcSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `
    M ${cx} ${cy}
    L ${start.x} ${start.y}
    A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    Z
  `;
}

export default function RouletteScreen() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const [baseRotation, setBaseRotation] = useState(0);

  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const anglePerSlice = 360 / segments.length;

  const svgSlices = useMemo(() => {
    return segments.map((segment, index) => {
      const startAngle = index * anglePerSlice;
      const endAngle = startAngle + anglePerSlice;
      const midAngle = startAngle + anglePerSlice / 2;

      const path = describeArcSlice(RADIUS, RADIUS, RADIUS, startAngle, endAngle);

      const textRadius = RADIUS * 0.7;
      const textPosition = polarToCartesian(RADIUS, RADIUS, textRadius, midAngle);

      return {
        ...segment,
        path,
        textX: textPosition.x,
        textY: textPosition.y,
        textRotation: midAngle,
      };
    });
  }, [anglePerSlice]);

  const wheelRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${baseRotation}deg`, `${baseRotation}deg`],
  });

  const [animatedRotation, setAnimatedRotation] = useState<any>(`${baseRotation}deg`);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const targetIndex = Math.floor(Math.random() * segments.length);
    const selectedSegment = segments[targetIndex];

    const sliceCenterAngle = targetIndex * anglePerSlice + anglePerSlice / 2;

    // Pointer üstte, hedef dilimin ortası pointer'a gelsin
    const targetWheelAngle = 360 - sliceCenterAngle;

    const extraSpins = 5;
    const newRotation = baseRotation + extraSpins * 360 + targetWheelAngle;

    rotateAnim.setValue(0);

    const nextAnimatedRotation = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [`${baseRotation}deg`, `${newRotation}deg`],
    });

    setAnimatedRotation(nextAnimatedRotation);

    Animated.timing(rotateAnim, {
  toValue: 1,
  duration: 4200,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true,
}).start(() => {
  // Çarkı son açıda sabitle
  setBaseRotation(newRotation);
  setAnimatedRotation(`${newRotation}deg`);
  setIsSpinning(false);

  // Hemen resetleme yapma, önce kullanıcı son durumu görsün
  navigationTimeoutRef.current = setTimeout(() => {
    router.push({
      pathname: "/roulette-result",
      params: {
        category: selectedSegment.label,
      },
    });

    // Sonraki giriş için animasyon value'sunu temizle
    rotateAnim.setValue(0);
  }, 300);
});
  };
    useEffect(() => {
      return () => {
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
        }
      };
    }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isSpinning ? "Rulet Dönüyor" : "Film Ruleti"}
          </Text>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Feather name="clock" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isSpinning ? (
          <>
            <View style={styles.spinningWheelArea}>
              <View style={styles.pointer} />

              <AnimatedView
                style={[
                  styles.wheelWrapper,
                  {
                    transform: [{ rotate: animatedRotation }],
                  },
                ]}
              >
                <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                  {svgSlices.map((slice) => (
                    <Path key={slice.label} d={slice.path} fill={slice.color} />
                  ))}

                  {svgSlices.map((slice) => (
                    <SvgText
                      key={`${slice.label}-text`}
                      x={slice.textX}
                      y={slice.textY}
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${slice.textRotation} ${slice.textX} ${slice.textY})`}
                    >
                      {slice.label}
                    </SvgText>
                  ))}

                  <Circle
                    cx={RADIUS}
                    cy={RADIUS}
                    r={CENTER_CIRCLE / 2}
                    fill="#2E3147"
                  />
                </Svg>

                <View style={styles.centerOverlay}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              </AnimatedView>
            </View>

            <View style={styles.spinningInfo}>
              <Text style={styles.spinningTitle}>Senin için film seçiyoruz</Text>
              <Text style={styles.spinningText}>
                Rulet birkaç saniye içinde duracak.
              </Text>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Ruleti çevir. Durduğu yerdeki kategoriye göre{"\n"}
              sana film önerelim.
            </Text>

            <View style={styles.wheelSection}>
              <View style={styles.pointer} />

              <AnimatedView
                style={[
                  styles.wheelWrapper,
                  {
                    transform: [{ rotate: animatedRotation }],
                  },
                ]}
              >
                <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                  {svgSlices.map((slice) => (
                    <Path key={slice.label} d={slice.path} fill={slice.color} />
                  ))}

                  {svgSlices.map((slice) => (
                    <SvgText
                      key={`${slice.label}-text`}
                      x={slice.textX}
                      y={slice.textY}
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      transform={`rotate(${slice.textRotation} ${slice.textX} ${slice.textY})`}
                    >
                      {slice.label}
                    </SvgText>
                  ))}

                  <Circle
                    cx={RADIUS}
                    cy={RADIUS}
                    r={CENTER_CIRCLE / 2}
                    fill="#2E3147"
                  />
                </Svg>

                <View style={styles.centerOverlay}>
                  <Text style={styles.centerText}>SPIN</Text>
                </View>
              </AnimatedView>
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.9}
              onPress={spinWheel}
            >
              <Feather name="sparkles" size={18} color="#081120" />
              <Text style={styles.primaryButtonText}>Çevir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9}>
              <Text style={styles.secondaryButtonText}>Nasıl Çalışır?</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#020B18",
  },

  screen: {
    flex: 1,
    backgroundColor: "#041225",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 28,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(130,160,255,0.12)",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    minHeight: 48,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  description: {
    color: "#BFD0EA",
    textAlign: "center",
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 24,
  },

  wheelSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  spinningWheelArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 36,
  },

  pointer: {
    position: "absolute",
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 22,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#F3B42A",
    zIndex: 20,
    transform: [{ rotate: "180deg" }],
  },

  wheelWrapper: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  centerOverlay: {
    position: "absolute",
    width: CENTER_CIRCLE,
    height: CENTER_CIRCLE,
    borderRadius: CENTER_CIRCLE / 2,
    backgroundColor: "#2E3147",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  centerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F3B42A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },

  primaryButtonText: {
    color: "#081120",
    fontSize: 19,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  spinningInfo: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },

  spinningTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },

  spinningText: {
    color: "#BFD0EA",
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 260,
  },
});