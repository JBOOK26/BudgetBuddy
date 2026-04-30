import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { validateEmail } from '@/lib/validation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { resolvedTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!validateEmail(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email. Please check your inbox.'
      );
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err.code);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDark ? '#121212' : '#f8fbfa';
  const textColor = isDark ? '#ffffff' : '#000000';
  const inputBgColor = isDark ? '#2a2a2a' : '#ffffff';
  const borderColor = isDark ? '#444444' : '#e0e0e0';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <MaterialIcons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </Pressable>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: textColor }]}>Forgot Password</Text>
          <Text style={[styles.description, { color: isDark ? '#aaa' : '#666' }]}>
            Enter your email address to receive a reset link and regain access to your account.
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor }]}>
            <MaterialIcons name="email" size={20} color={isDark ? '#999' : '#666'} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Email address"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Continue Button */}
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            { opacity: pressed || loading ? 0.8 : 1 },
          ]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </Pressable>

        {/* Back to Login */}
        <View style={styles.backLinkContainer}>
          <Pressable onPress={() => router.push('/auth/login')} disabled={loading}>
            <Text style={styles.backLink}>Back to Login</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  continueButton: {
    backgroundColor: '#1ec446',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLinkContainer: {
    alignItems: 'center',
  },
  backLink: {
    color: '#5fd9a6',
    fontSize: 14,
    fontWeight: '600',
  },
});
