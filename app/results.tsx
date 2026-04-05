import { View, Text, StyleSheet } from "react-native";

export default function ResultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎬 Recommendations</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});