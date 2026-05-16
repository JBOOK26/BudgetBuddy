import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
  isDark: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmColor = '#4CAF50',
  isDark,
  onCancel,
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.modal, { backgroundColor: isDark ? '#202225' : '#fff' }]}>
          <Text style={[styles.title, { color: isDark ? '#f1f1f1' : '#111' }]}>{title}</Text>
          {message && <Text style={[styles.message, { color: isDark ? '#c0c0c0' : '#555' }]}>{message}</Text>}

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                { backgroundColor: isDark ? '#3a3f45' : '#e0e0e0', opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={onCancel}
              disabled={isLoading}>
              <Text style={[styles.buttonText, { color: isDark ? '#f1f1f1' : '#333' }]}>
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.confirmButton,
                { backgroundColor: confirmColor, opacity: pressed || isLoading ? 0.8 : 1 },
              ]}
              onPress={onConfirm}
              disabled={isLoading}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    // Background color is set dynamically
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
