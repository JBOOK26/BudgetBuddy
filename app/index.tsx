import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function Index() {
  const router = useRouter();
  const { resolvedTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8fbfa' }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {isDark ? (
          <View style={styles.darkLogoWrap}>
            <MaterialIcons name="savings" size={84} color="#5fd9a6" />
            <Text style={styles.darkLogoTitle}>BUDGET</Text>
            <Text style={styles.darkLogoSubtitle}>BUDDY</Text>
          </View>
        ) : (
          <Image source={require('../assets/logo.png')} style={styles.logo} contentFit="contain" />
        )}
        <Text style={[styles.subtitle, { color: isDark ? '#d3dbd7' : '#2f4f4f' }]}>Track smarter. Spend better.</Text>
        <Pressable style={styles.button} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbfa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: 18,
  },
  darkLogoWrap: {
    width: 260,
    height: 260,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkLogoTitle: {
    marginTop: 6,
    fontSize: 40,
    fontWeight: '900',
    color: '#f2f8f5',
    letterSpacing: 2,
  },
  darkLogoSubtitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#5fd9a6',
    letterSpacing: 2,
    marginTop: -6,
  },
  subtitle: {
    fontSize: 16,
    color: '#2f4f4f',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#18a558',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    minWidth: 210,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});