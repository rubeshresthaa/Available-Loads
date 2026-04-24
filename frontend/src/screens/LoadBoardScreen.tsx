import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LoadCard } from '@/components/LoadCard';
import { useGetLoadsQuery, useGetAcceptedLoadsQuery, useAcceptLoadMutation } from '@/store/apiSlice';

const DRIVER_ID = 'TEST_DRIVER_123'; // Hardcoded driverId for testing

export const LoadBoardScreen = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'accepted'>('available');
  
  const { 
    data: pendingData, 
    isLoading: isLoadingPending, 
    isError: isErrorPending, 
    error: errorPending, 
    refetch: refetchPending, 
    isFetching: isFetchingPending 
  } = useGetLoadsQuery();

  const { 
    data: acceptedData, 
    isLoading: isLoadingAccepted, 
    isError: isErrorAccepted, 
    error: errorAccepted, 
    refetch: refetchAccepted, 
    isFetching: isFetchingAccepted 
  } = useGetAcceptedLoadsQuery(DRIVER_ID);

  const [acceptLoad] = useAcceptLoadMutation();

  const loads = useMemo(() => 
    activeTab === 'available' ? (pendingData?.data || []) : (acceptedData?.data || []),
  [activeTab, pendingData, acceptedData]);

  const isLoading = activeTab === 'available' ? isLoadingPending : isLoadingAccepted;
  const isFetching = activeTab === 'available' ? isFetchingPending : isFetchingAccepted;
  const isError = activeTab === 'available' ? isErrorPending : isErrorAccepted;
  const error = activeTab === 'available' ? errorPending : errorAccepted;

  useEffect(() => {
    if (isError) {
      const message =
        (error as any)?.error ||
        (error as any)?.data?.message ||
        'Could not fetch loads. Is the backend running?';
      Alert.alert('Connection Error', message);
    }
  }, [isError, error]);

  const handleRefresh = useCallback(async () => {
    if (activeTab === 'available') {
      await refetchPending();
    } else {
      await refetchAccepted();
    }
  }, [activeTab, refetchPending, refetchAccepted]);

  const handleAcceptLoad = useCallback(async (loadId: string) => {
    try {
      await acceptLoad({ loadId, driverId: DRIVER_ID }).unwrap();
      Alert.alert('Success', 'Load successfully accepted!');
    } catch (err: any) {
      const message =
        err?.data?.message ||
        err?.message ||
        'Failed to accept load. Please try again.';
      Alert.alert('Error', message);
      throw err;
    }
  }, [acceptLoad]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <LoadCard 
      load={item} 
      onAccept={activeTab === 'available' ? handleAcceptLoad : undefined} 
      isAccepted={activeTab === 'accepted'}
    />
  ), [activeTab, handleAcceptLoad]);

  const listHeader = useMemo(() => (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Load Board</Text>
        <Text style={styles.headerSubtitle}>Manage your loads</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'available' && styles.activeTab]} 
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Available</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'accepted' && styles.activeTab]} 
          onPress={() => setActiveTab('accepted')}
        >
          <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>Accepted</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [activeTab]);

  const listEmptyComponent = useMemo(() => {
    if (isLoading && !isFetching) {
      return (
        <View style={styles.contentLoadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Fetching loads...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIcon}>{activeTab === 'available' ? '📦' : '✅'}</Text>
        </View>
        <Text style={styles.emptyTitle}>
          {activeTab === 'available' ? 'No available loads' : 'No accepted loads yet'}
        </Text>
        <Text style={styles.emptySubtitle}>Pull down to refresh</Text>
      </View>
    );
  }, [isLoading, isFetching, activeTab]);

  return (
    <View style={styles.container}>
      <FlatList
        data={loads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleRefresh}
            tintColor="#4f46e5"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        // Optimization props
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentLoadingContainer: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 52,
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#4f46e5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIconContainer: {
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    color: '#4b5563',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 30,
  },
});
