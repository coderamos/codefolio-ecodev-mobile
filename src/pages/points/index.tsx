import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ViewMap, { Marker } from "react-native-maps";
import { SvgUri } from "react-native-svg";
import api from "../../services/api";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

interface Item {
  id: number;
  title: string;
  image_url: string;
}
const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    api.get("/items").then((response) => setItems(response.data));
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail() {
    navigation.navigate("Detail");
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id);
    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          <ViewMap
            style={styles.map}
            initialRegion={{
              latitude: -23.487394,
              longitude: -46.8737503,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}
          >
            <Marker
              style={styles.mapMarker}
              coordinate={{
                latitude: -23.487394,
                longitude: -46.8737503,
              }}
              onPress={handleNavigateToDetail}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri:
                      "https://images.unsplash.com/photo-1545601445-4d6a0a0565f0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
                  }}
                />
                <Text style={styles.mapMarkerTitle}>Mercado</Text>
              </View>
            </Marker>
          </ViewMap>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
          }}
        >
          {items &&
            items.map((item) => (
              <TouchableOpacity
                key={String(item.id)}
                style={[
                  styles.item,
                  selectedItems.includes(item.id) ? styles.selectedItem : {},
                ]}
                activeOpacity={0.6}
                onPress={() => handleSelectItem(item.id)}
              >
                <SvgUri width={42} height={42} uri={item.image_url} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 20,
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    marginTop: 4,
  },

  mapContainer: {
    borderRadius: 10,
    flex: 1,
    marginTop: 16,
    overflow: "hidden",
    width: "100%",
  },

  map: {
    height: "100%",
    width: "100%",
  },

  mapMarker: {
    height: 80,
    width: 90,
  },

  mapMarkerContainer: {
    alignItems: "center",
    backgroundColor: "#34CB79",
    borderRadius: 8,
    flexDirection: "column",
    height: 70,
    overflow: "hidden",
    width: 90,
  },

  mapMarkerImage: {
    height: 45,
    resizeMode: "cover",
    width: 90,
  },

  mapMarkerTitle: {
    color: "#FFF",
    flex: 1,
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: "row",
    marginBottom: 32,
    marginTop: 16,
  },

  item: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderRadius: 8,
    borderWidth: 2,
    height: 120,
    justifyContent: "space-between",
    marginRight: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    textAlign: "center",
    width: 120,
  },

  selectedItem: {
    borderColor: "#34CB79",
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    textAlign: "center",
  },
});

export default Points;
