import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resolvedTheme, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();
  const isDark = resolvedTheme === 'dark';
  const profileName = user?.displayName?.trim() || user?.email?.split('@')[0] || 'User';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: isDark ? '#f4f4f4' : '#111' }]}>Settings</Text>

      {/* User Info */}
      <View style={[styles.userCard, { backgroundColor: isDark ? '#1e2124' : '#fff' }]}>
        <View style={[styles.avatarWrap, { backgroundColor: isDark ? '#2a2f35' : '#e8e8e8' }]}>
          <MaterialIcons name="account-circle" size={40} color={isDark ? '#5fd9a6' : '#666'} />
        </View>
        <View>
          <Text style={[styles.userName, { color: isDark ? '#f4f4f4' : '#111' }]}>
            {profileName}
          </Text>
          <Text style={[styles.userEmail, { color: isDark ? '#aaa' : '#666' }]}>
            {user?.email || 'email@example.com'}
          </Text>
        </View>
      </View>

      {/* Appearance Section */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#aaa' : '#666' }]}>Appearance</Text>
      <View style={[styles.settingRow, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}>
        <View style={styles.settingContent}>
          <MaterialIcons name="brightness-4" size={24} color={isDark ? '#ffd180' : '#fb8c00'} />
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>Theme</Text>
            <Text style={[styles.settingDesc, { color: isDark ? '#aaa' : '#666' }]}>
              Choose your preferred look
            </Text>
          </View>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#ccc', true: '#5fd9a6' }}
          thumbColor={isDark ? '#0d7a52' : '#f4f4f4'}
        />
      </View>

      {/* General Section */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#aaa' : '#666' }]}>General</Text>
      <Pressable
        style={[styles.settingRow, { backgroundColor: isDark ? '#1e2124' : '#fff', borderColor: isDark ? '#2f3439' : '#e0e8e4' }]}
        onPress={() => router.push('/about-modal')}
      >
        <View style={styles.settingContent}>
          <MaterialIcons name="info" size={24} color={isDark ? '#90caf9' : '#1e88e5'} />
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: isDark ? '#f4f4f4' : '#111' }]}>About</Text>
            <Text style={[styles.settingDesc, { color: isDark ? '#aaa' : '#666' }]}>
              App info and version
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={isDark ? '#666' : '#ccc'} />
      </Pressable>

      {/* Account Section */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#aaa' : '#666' }]}>Account</Text>
      <Pressable
        style={[styles.logoutButton]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>LOGOUT</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
