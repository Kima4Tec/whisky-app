# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

Godt valg med **React Native + Expo** 👍 — du kan faktisk opfylde _alle kravene_ ret clean med det setup.

Jeg viser dig ikke bare hvad du skal gøre, men også **hvordan du strukturerer det rigtigt**, så det ligner en “rigtig” app (ikke bare skolekode).

---

# 🧱 1. Overordnet arkitektur (så du rammer Mål 11/12 også)

```txt
📱 App (React Native / Expo)
 ├── screens/
 ├── components/
 ├── services/   ← API calls (Repository)
 ├── hooks/
 ├── storage/
```

---

# ✅ 2. Gennemgang af krav + løsning

---

## 📱 Cross-platform (Mål 1 & 2)

Du har allerede valgt Expo → det er korrekt.

### Kør app:

```bash
npx expo start
```

Scan med:

- Expo Go (iOS)
- Expo Go (Android)

✔️ Opfyldt automatisk

---

## 📋 Menu (Mål 3)

Brug **Expo Router (du bruger det allerede)**

### Eksempel: tabs menu

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="whiskies" options={{ title: "Whiskies" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
```

✔️ 3 menupunkter ✔️

---

## 📐 Responsivt design (Mål 7)

Brug `useWindowDimensions`

```tsx
import { useWindowDimensions } from "react-native";

const { width } = useWindowDimensions();

const isTablet = width > 600;
```

```tsx
<View style={{ flexDirection: isTablet ? "row" : "column" }}>
```

✔️ Skifter layout mellem portrait/landscape

---

## 📃 Dynamisk liste (Mål 4)

```tsx
import { FlatList, Text, TouchableOpacity } from "react-native";

<FlatList
  data={whiskies}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => setSelected(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  )}
/>;
```

✔️ Liste + klik

---

## 💾 Lokal storage (Mål 5)

Brug:
👉 `@react-native-async-storage/async-storage`

```bash
npx expo install @react-native-async-storage/async-storage
```

### Gem data

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";

await AsyncStorage.setItem("favorite", JSON.stringify(whisky));
```

### Hent data

```ts
const data = await AsyncStorage.getItem("favorite");
```

✔️ Opfylder kravet

---

## 📱 Sensor (Mål 6)

Brug:
👉 `expo-sensors`

```bash
npx expo install expo-sensors
```

### Eksempel: ændr baggrund med telefon tilt

```tsx
import { Accelerometer } from "expo-sensors";

useEffect(() => {
  Accelerometer.addListener((data) => {
    setBgColor(`rgb(${Math.abs(data.x) * 255},100,150)`);
  });
}, []);
```

✔️ Simpel + virker

---

## 🧠 Repository Pattern (Mål 11/12 – BONUS)

Lav en service:

```ts
// services/whiskyService.ts
export const getWhiskies = async () => {
  const res = await fetch("https://whiskyhunter.net/api/distilleries_info/");
  return res.json();
};
```

Brug i komponent:

```ts
useEffect(() => {
  getWhiskies().then(setWhiskies);
}, []);
```

✔️ UI ≠ data → god arkitektur

---

## ⏳ Async kald (Mål 13)

Du gør det allerede med `fetch` + `useEffect`

```tsx
useEffect(() => {
  const load = async () => {
    const data = await getWhiskies();
    setWhiskies(data);
  };
  load();
}, []);
```

✔️ Async ✔️

---

## 🌐 Web API (Mål 14)

Brug fx:

👉 `https://whiskyhunter.net/api/distilleries_info/`

```ts
const res = await fetch("https://whiskyhunter.net/api/distilleries_info/");
```

✔️ Opfyldt

---

# 🧩 3. Minimum funktionel app (så du består)

Hvis du vil gøre det simpelt men godt:

### Skærme:

- 🏠 Home (dit billede)
- 🥃 Whiskies (liste fra API)
- ⚙️ Settings (gem preference)

---

# 🔥 4. Ekstra (giver højere karakter)

Hvis du lige vil løfte den:

- ⭐ Favorites (AsyncStorage)
- 🔍 Search
- 📱 Smooth UI (cards)
- 🌙 Dark mode toggle

---

# 🎯 Konklusion

Du er faktisk på helt rigtig vej.

Det vigtigste du mangler er:

1. ✅ API integration (brug WhiskyHunter)
2. ✅ FlatList
3. ✅ AsyncStorage
4. ✅ Sensor (meget nemt point)
5. ✅ Tabs menu (du er tæt på allerede)

---

# 💬 Vil du have næste step?

Jeg kan bygge en **færdig starter-struktur til din app**, fx:

- `whiskies screen` med API + liste
- `favorites system`
- `settings + storage`
- `sensor feature (cool effect)`

Fra index.tsx med smarte funktioner:
{/_ Reviews _/}
<ThemedView style={styles.stepContainer}>
<Link href="/reviews">
<Link.Trigger>
<ThemedText type="subtitle">Anmeldelser</ThemedText>
</Link.Trigger>
<Link.Preview />
<Link.Menu>
<Link.MenuAction
title="Action"
icon="cube"
onPress={() => alert("Action pressed")}
/>
<Link.MenuAction
title="Share"
icon="square.and.arrow.up"
onPress={() => alert("Share pressed")}
/>
<Link.Menu title="More" icon="ellipsis">
<Link.MenuAction
title="Delete"
icon="trash"
destructive
onPress={() => alert("Delete pressed")}
/>
</Link.Menu>
</Link.Menu>
</Link>
<ThemedText>
{`Her kan du finde links til forskellige anmeldelser af whisky.`}
</ThemedText>
</ThemedView>
