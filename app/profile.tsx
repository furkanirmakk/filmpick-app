import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        
        <View style={styles.header}>
  
  <TouchableOpacity
    style={styles.iconButton}
    onPress={() => router.back()}
    activeOpacity={0.8}
  >
    <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Profil</Text>

  <TouchableOpacity
    style={styles.iconButton}
    onPress={() => router.push("/settings")}
    activeOpacity={0.8}
  >
    <Feather name="sliders" size={20} color="#FFFFFF" />
  </TouchableOpacity>

</View>

        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/300",
              }}
              style={styles.avatar}
            />

            <Text style={styles.name}>Furkan Irmak</Text>
            <Text style={styles.subtitle}>Film keşfetmeyi seviyor 🎬</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Favori</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>34</Text>
              <Text style={styles.statLabel}>İzlenen</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Liste</Text>
            </View>
          </View>

          <View style={styles.menu}>
            
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="settings" size={20} color="#fff" />
              <Text style={styles.menuText}>Ayarlar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="share-2" size={20} color="#fff" />
              <Text style={styles.menuText}>Uygulamayı Paylaş</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="info" size={20} color="#fff" />
              <Text style={styles.menuText}>Uygulama Hakkında</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="info" size={20} color="#fff" />
              <Text style={styles.menuText}>Bize Ulaş</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

        <View style={styles.bottomNav}>
          
          <TouchableOpacity
  style={styles.navItem}
  activeOpacity={0.8}
  onPress={() => router.push("/explore")}
>
  <Feather name="search" size={20} color="#D6DCEC" />
  <Text style={styles.navText}>Keşfet</Text>
</TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="sparkles-outline" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Ana Sayfa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/favorites")}
          >
            <Ionicons name="heart-outline" size={20} color="#D6DCEC" />
            <Text style={styles.navText}>Favori</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
            <Text style={[styles.navText, styles.activeNavText]}>Profil</Text>
          </TouchableOpacity>

        </View>
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
  },


  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  profileCard: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    color: "#A9B7D1",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  statBox: {
    backgroundColor: "#182640",
    paddingVertical: 18,
    width: "30%",
    borderRadius: 16,
    alignItems: "center",
  },

  statNumber: {
    color: "#F3B42A",
    fontSize: 22,
    fontWeight: "800",
  },

  statLabel: {
    color: "#C7D3E8",
    marginTop: 4,
  },

  menu: {
    gap: 16,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#182640",
    padding: 16,
    borderRadius: 16,
  },

  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  bottomNav: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 12,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    marginTop: 4,
    fontSize: 12,
    color: "#D6DCEC",
  },

  activeNavText: {
    color: "#fff",
    fontWeight: "700",
  },

  header: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
},

iconButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "rgba(255,255,255,0.08)",
  alignItems: "center",
  justifyContent: "center",
},
});