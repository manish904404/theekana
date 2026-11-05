import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import type { HealthResponse, ApiErrorResponse } from '@thikana/shared';

// Android emulator routes host machine's localhost to 10.0.2.2
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export default function App(): React.JSX.Element {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setHealthStatus(null);
    setIsSuccess(null);

    const endpoint = `${DEFAULT_API_URL}/v1/health`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': `mobile-check-${Date.now()}`,
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ApiErrorResponse;
        setIsSuccess(false);
        setHealthStatus(
          `Error ${response.status}: [${errorData.error?.code || 'UNKNOWN'}] ${
            errorData.error?.message || 'Server error'
          }`
        );
        return;
      }

      const data = (await response.json()) as HealthResponse;
      setIsSuccess(true);
      setHealthStatus(`Server OK: ${JSON.stringify(data)}`);
    } catch (err: unknown) {
      setIsSuccess(false);
      const message = err instanceof Error ? err.message : 'Failed to reach API';
      setHealthStatus(`Network Error: ${message} (Target: ${endpoint})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>THIKANA v0.1</Text>
        </View>

        <Text style={styles.title}>Thikana</Text>
        <Text style={styles.tagline}>jahan dost milte hain</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend Health Check</Text>
          <Text style={styles.cardSubtitle}>
            Target: {DEFAULT_API_URL}/v1/health
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={checkHealth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Check Server Health</Text>
            )}
          </TouchableOpacity>

          {healthStatus !== null && (
            <View
              style={[
                styles.resultBox,
                isSuccess ? styles.resultSuccess : styles.resultError,
              ]}
            >
              <Text style={styles.resultLabel}>
                {isSuccess ? 'Response Received:' : 'Check Failed:'}
              </Text>
              <Text style={styles.resultText}>{healthStatus}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  badgeText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 6,
    marginBottom: 36,
  },
  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: '#064E3B20',
    borderColor: '#10B981',
  },
  resultError: {
    backgroundColor: '#7F1D1D20',
    borderColor: '#EF4444',
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  resultText: {
    fontSize: 13,
    color: '#F1F5F9',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
