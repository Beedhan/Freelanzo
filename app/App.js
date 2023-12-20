import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NativeWindStyleSheet } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import Login from "./Components/Login/Login";
import Screen1 from "./app/WalkThrough/Screen1";

NativeWindStyleSheet.setOutput({
  default:"native"
})
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      <Screen1 />
    </View>
  );
}
