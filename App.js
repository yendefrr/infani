import React, { useState, useEffect } from "react";
import { View, Image, FlatList, RefreshControl, StyleSheet } from "react-native";

const baseApiURL = "https://api.tinyfox.dev";

export default function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImage = async () => {
    try {
      const response = await fetch(`${baseApiURL}/img.json?animal=capy`);
      const result = await response.json();

      if (result && result.loc) {
        const imageUrl = `${baseApiURL}${result.loc}`;
        return imageUrl;
      } else {
        console.error("Unexpected API response:", result);
        return null;
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  const fetchImages = async () => {
    const newImages = [];

    while (newImages.length < 5) {
      const imageUrl = await fetchImage();
      if (imageUrl) {
        newImages.push(imageUrl);
      }
    }

    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const renderItem = ({ item }) => <Image style={styles.imageContainer} source={{ uri: item }} />;

  const keyExtractor = (item, index) => index.toString();

  const handleRefresh = async () => {
    setRefreshing(true);
    setSelectedImages([]);
    await fetchImages();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedImages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={fetchImages}
        onEndReachedThreshold={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D2313",
    paddingTop: 50,
    alignItems: "center",
  },
  imageContainer: {
    width: 340,
    height: 440,
    marginBottom: 20,
    borderRadius: 20,
  },
});
