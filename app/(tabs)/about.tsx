import { useAppTheme } from '@/hooks/use-app-theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { resolvedTheme, toggleTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 }]}
      showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: isDark ? '#f4f4f4' : '#111' }]}>About</Text>
      <View style={styles.logoWrap}>
        <Image
          source={isDark ? require('../../assets/logo-dark.png') : require('../../assets/logo-light.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: isDark ? '#2a2f35' : '#fff7e6' }]}>
            <MaterialIcons name="emoji-events" size={18} color={isDark ? '#ffd180' : '#fb8c00'} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>About Budget Buddy</Text>
          </View>
        </View>
        <Text style={[styles.paragraph, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>
          Budget Buddy is a personal finance tracker mobile app built by students, for students. It was created to solve a
          common problem — not knowing where your money goes.
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>
          With Budget Buddy, you can easily log your daily income and expenses, organize them by category, and visualize
          your spending through interactive charts. Everything is saved in real time using Firebase Firestore, so your data
          is always up to date and never lost.
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>
          The app was built using React Native and Expo for the mobile interface, and Firebase for the cloud database. It
          features a clean and simple design so anyone can use it without any learning curve.
        </Text>
        <Text style={[styles.paragraph, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>
          Whether you're tracking your allowance, freelance income, or daily expenses — Budget Buddy gives you a clear
          and honest picture of your finances in one place.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: isDark ? '#2a2f35' : '#eef6ff' }]}>
            <MaterialIcons name="memory" size={18} color={isDark ? '#90caf9' : '#1e88e5'} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>Tech Stack</Text>
          </View>
        </View>
        <Text style={[styles.metaBody, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>
          React Native • Expo • Firebase Firestore • React Native Chart Kit
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: isDark ? '#2a2f35' : '#f0eaff' }]}>
            <MaterialIcons name="groups" size={18} color={isDark ? '#d1c4e9' : '#7e57c2'} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>Developed by</Text>
          </View>
        </View>
        <Text style={[styles.metaBody, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>
          Bucod, Justin B. • Berboso, Kim Gharleck • Escobar, Kurt Roy
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: isDark ? '#2a2f35' : '#e8f5e9' }]}>
            <MaterialIcons name="menu-book" size={18} color={isDark ? '#a5d6a7' : '#43a047'} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>Course</Text>
          </View>
        </View>
        <Text style={[styles.metaBody, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>ADV 102 — IT Elective 2</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, { backgroundColor: isDark ? '#2a2f35' : '#fff3e0' }]}>
            <MaterialIcons name="school" size={18} color={isDark ? '#ffcc80' : '#fb8c00'} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>Teacher</Text>
          </View>
        </View>
        <Text style={[styles.metaBody, { color: isDark ? '#d0d6d3' : '#3d4f4d' }]}>Rosselyn Cedeño</Text>
      </View>

      <Pressable
        onPress={toggleTheme}
        style={[
          styles.themeToggle,
          { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#d3e2da' },
        ]}>
        <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={18} color={isDark ? '#f7d66b' : '#223'} />
        <Text style={[styles.themeToggleText, { color: isDark ? '#f4f4f4' : '#111' }]}>
          Switch to {isDark ? 'Light' : 'Dark'} mode
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 124,
    height: 124,
    borderRadius: 62,
  },
  card: {
    marginTop: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  paragraph: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
  },
  metaBody: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  themeToggle: {
    marginTop: 14,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  themeToggleText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
