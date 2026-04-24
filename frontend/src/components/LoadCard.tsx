import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Load } from '@/types';

interface LoadCardProps {
  load: Load;
  onAccept?: (loadId: string) => Promise<void>;
  isAccepted?: boolean;
}

export const LoadCard: React.FC<LoadCardProps> = React.memo(({ load, onAccept, isAccepted }) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    if (!onAccept) return;
    setIsAccepting(true);
    try {
      await onAccept(load.id);
    } catch (error) {
      // Revert loading state only if it failed
      setIsAccepting(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.priceText}>${load.price.toLocaleString()}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{load.vehicleTypeRequired}</Text>
          </View>
          {isAccepted && (
            <View style={[styles.badgeContainer, styles.acceptedBadge]}>
              <Text style={[styles.badgeText, styles.acceptedBadgeText]}>✓ Accepted</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.originDot]} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>FROM</Text>
            <Text style={styles.locationText}>{load.origin}</Text>
          </View>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.destinationDot]} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>TO</Text>
            <Text style={styles.locationText}>{load.destination}</Text>
          </View>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Weight: {load.weight} kg</Text>
      </View>

      {!isAccepted && (
        <TouchableOpacity
          style={[styles.button, isAccepting && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={isAccepting}
          activeOpacity={0.8}
        >
          {isAccepting ? (
            <>
              <ActivityIndicator color="#ffffff" size="small" />
              <Text style={[styles.buttonText, styles.buttonTextLoading]}>Accepting...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Accept Load</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeContainer: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  acceptedBadge: {
    backgroundColor: '#dcfce7',
  },
  badgeText: {
    color: '#4338ca',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  acceptedBadgeText: {
    color: '#166534',
  },
  routeContainer: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeLine: {
    width: 1.5,
    height: 16,
    backgroundColor: '#d1d5db',
    marginLeft: 6,
    marginVertical: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  originDot: {
    backgroundColor: '#10b981',
  },
  destinationDot: {
    backgroundColor: '#f43f5e',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  locationText: {
    color: '#1f2937',
    fontWeight: '600',
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonTextLoading: {
    marginLeft: 8,
  },
});
