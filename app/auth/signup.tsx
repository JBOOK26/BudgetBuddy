import { useAuth } from '@/contexts/AuthContext';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors';
import {
    validateEmail,
    validateName,
    validatePassword,
    validatePasswordMatch,
} from '@/lib/validation';
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

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const { resolvedTheme } = useAppTheme();
  const isDark = resolvedTheme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    const passwordValidation = validatePassword(password);
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(email, password, name);
      // Navigation will happen automatically via auth state change
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      Alert.alert('Signup Failed', errorMessage);
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
        {/* Header */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <MaterialIcons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </Pressable>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialIcons name="savings" size={60} color="#5fd9a6" />
          <Text style={[styles.logoText, { color: textColor }]}>BUDGET</Text>
          <Text style={[styles.logoSubtext, { color: textColor }]}>BUDDY</Text>
        </View>

        <Text style={[styles.title, { color: textColor }]}>CREATE ACCOUNT</Text>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor }]}>
            <MaterialIcons name="person" size={20} color={isDark ? '#999' : '#666'} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Name"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              editable={!loading}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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

        {/* Confirm Password Input */}
        <View style={styles.inputGroup}>
          <View style={[styles.inputContainer, { backgroundColor: inputBgColor, borderColor }]}>
            <MaterialIcons name="lock" size={20} color={isDark ? '#999' : '#666'} />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Confirm Password"
              placeholderTextColor={isDark ? '#888' : '#999'}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color={isDark ? '#999' : '#666'}
              />
            </Pressable>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Signup Button */}
        <Pressable
          style={({ pressed }) => [
            styles.signupButton,
            { opacity: pressed || loading ? 0.8 : 1 },
          ]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.signupButtonText}>CREATE ACCOUNT</Text>
          )}
        </Pressable>

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={[styles.loginText, { color: textColor }]}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/auth/login')} disabled={loading}>
            <Text style={styles.loginLink}>Sign in here</Text>
          </Pressable>
        </View>

        {/* Social Signup */}
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
    paddingTop: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
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
  signupButton: {
    backgroundColor: '#1ec446',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
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
