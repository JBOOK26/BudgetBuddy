import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import { validateEmail } from '@/lib/validation';
import FontAwesome from '@expo/vector-icons/FontAwesome';
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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { resolvedTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Navigation will happen automatically via auth state change
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      Alert.alert('Login Failed', errorMessage);
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
        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialIcons name="savings" size={60} color="#5fd9a6" />
          <Text style={[styles.logoText, { color: textColor }]}>BUDGET</Text>
          <Text style={[styles.logoSubtext, { color: textColor }]}>BUDDY</Text>
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
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor }]}>
            <MaterialIcons name="lock" size={20} color={isDark ? '#999' : '#666'} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Password"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color={isDark ? '#999' : '#666'}
              />
            </Pressable>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsRow}>
          <Pressable
            style={styles.rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
            disabled={loading}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: rememberMe ? '#1ec446' : 'transparent',
                  borderColor: rememberMe ? '#1ec446' : isDark ? '#999' : '#ccc',
                },
              ]}
            >
              {rememberMe && (
                <MaterialIcons name="check" size={16} color="#ffffff" />
              )}
            </View>
            <Text style={[styles.optionText, { color: textColor }]}>Remember me</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/auth/forgot-password')} disabled={loading}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            { opacity: pressed || loading ? 0.8 : 1 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>LOGIN</Text>
          )}
        </Pressable>

        {/* Sign Up Link */}
        <View style={styles.signupLinkContainer}>
          <Text style={[styles.signupText, { color: textColor }]}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/signup')} disabled={loading}>
            <Text style={styles.signupLink}>Sign up here</Text>
          </Pressable>
        </View>

        {/* Social Login */}
        <View style={styles.socialDivider}>
          <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
          <Text style={[styles.dividerText, { color: textColor }]}>or continue with account</Text>
          <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
        </View>

        <View style={styles.socialButtons}>
          <Pressable style={styles.socialButton} disabled={loading}>
            <FontAwesome name="facebook" size={24} color="#1877F2" />
          </Pressable>
          <Pressable style={styles.socialButton} disabled={loading}>
            <FontAwesome name="google" size={24} color="#EA4335" />
          </Pressable>
          <Pressable style={styles.socialButton} disabled={loading}>
            <FontAwesome name="apple" size={24} color={isDark ? '#ffffff' : '#000000'} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  logoSubtext: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionText: {
    fontSize: 14,
  },
  forgotPassword: {
    color: '#5fd9a6',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1ec446',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    color: '#5fd9a6',
    fontSize: 14,
    fontWeight: '600',
  },
  socialDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
