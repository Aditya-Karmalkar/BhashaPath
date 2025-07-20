import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { Settings, CreditCard as Edit3, Award, Users, BookOpen, Bell, Volume2, Globe, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { useProgress } from '@/hooks/useProgress';
import { useRouter } from 'expo-router';

interface UserStats {
  totalLessons: number;
  streakDays: number;
  languages: number;
  level: number;
}

export default function ProfileScreen() {
  const { progress, loading } = useProgress();
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [userInfo] = useState({
    name: 'Arjun Patel',
    email: 'arjun.patel@email.com',
    joinDate: 'January 2024',
    currentLanguage: 'Marathi',
    nativeLanguage: 'English'
  });

  const handleMenuItemPress = (itemId: string) => {
    switch (itemId) {
      case 'edit-profile':
        console.log('Edit profile');
        break;
      case 'achievements':
        console.log('View achievements');
        break;
      case 'friends':
        console.log('View friends');
        break;
      case 'my-courses':
        router.push('/(tabs)/');
        break;
      case 'language':
        console.log('Change app language');
        break;
      case 'help':
        console.log('Help & support');
        break;
      case 'logout':
        console.log('Sign out');
        break;
    }
  };

  if (loading || !progress) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userStats: UserStats = {
    totalLessons: progress.completedLessons.length,
    streakDays: progress.streakDays,
    languages: Object.keys(progress.languageProgress).length,
    level: progress.currentLevel,
  };

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      icon: Edit3,
      color: '#1F2937',
      hasSwitch: false
    },
    {
      id: 'achievements',
      title: 'Achievements',
      icon: Award,
      color: '#FF7722',
      hasSwitch: false
    },
    {
      id: 'friends',
      title: 'Friends & Leaderboard',
      icon: Users,
      color: '#059669',
      hasSwitch: false
    },
    {
      id: 'my-courses',
      title: 'My Courses',
      icon: BookOpen,
      color: '#1E3A8A',
      hasSwitch: false
    }
  ];

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: '#6B7280',
      hasSwitch: true,
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled
    },
    {
      id: 'sound',
      title: 'Sound Effects',
      icon: Volume2,
      color: '#6B7280',
      hasSwitch: true,
      value: soundEnabled,
      onToggle: setSoundEnabled
    },
    {
      id: 'language',
      title: 'App Language',
      icon: Globe,
      color: '#6B7280',
      hasSwitch: false
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      color: '#6B7280',
      hasSwitch: false
    },
    {
      id: 'logout',
      title: 'Sign Out',
      icon: LogOut,
      color: '#DC2626',
      hasSwitch: false
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {userInfo.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
            <Text style={styles.joinDate}>Member since {userInfo.joinDate}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.languages}</Text>
              <Text style={styles.statLabel}>Languages</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>

        {/* Current Learning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Learning</Text>
          <View style={styles.languageCard}>
            <View style={styles.languageInfo}>
              <Text style={styles.currentLanguage}>{userInfo.currentLanguage}</Text>
              <Text style={styles.nativeLanguage}>From {userInfo.nativeLanguage}</Text>
            </View>
            <View style={styles.languageProgress}>
              <Text style={styles.progressText}>Level {userStats.level}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.id)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => !item.hasSwitch && handleMenuItemPress(item.id)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={[
                  styles.menuItemTitle,
                  item.id === 'logout' && styles.logoutText
                ]}>
                  {item.title}
                </Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#E5E7EB', true: '#FF7722' }}
                  thumbColor={'#FFFFFF'}
                />
              ) : (
                <Text style={[
                  styles.menuArrow,
                  item.id === 'logout' && styles.logoutText
                ]}>
                  ›
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.appInfo}>BhashaPath v1.0.0</Text>
          <Text style={styles.appSubInfo}>Made with ❤️ for language learners</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF7722',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  languageCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageInfo: {
    flex: 1,
  },
  currentLanguage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  nativeLanguage: {
    fontSize: 14,
    color: '#6B7280',
  },
  languageProgress: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7722',
    borderRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  logoutText: {
    color: '#DC2626',
  },
  appInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  appSubInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#D1D5DB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
});