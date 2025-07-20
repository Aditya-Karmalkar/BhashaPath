import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { MessageCircle, Heart, Share2, Plus, Search, Filter } from 'lucide-react-native';

interface CommunityPost {
  id: string;
  author: string;
  authorLevel: number;
  content: string;
  language: string;
  type: 'question' | 'tip' | 'achievement' | 'translation';
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function CommunityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [posts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Priya Sharma',
      authorLevel: 12,
      content: 'Just completed my first week of Marathi! The pronunciation exercises are really helping. Any tips for rolling the "र" sound correctly?',
      language: 'Marathi',
      type: 'question',
      timestamp: '2 hours ago',
      likes: 15,
      comments: 8,
      isLiked: false
    },
    {
      id: '2',
      author: 'Raj Patel',
      authorLevel: 8,
      content: 'Pro tip: When learning Hindi numbers, practice with real-life scenarios like shopping or telling time. It makes memorization much easier! 💡',
      language: 'Hindi',
      type: 'tip',
      timestamp: '4 hours ago',
      likes: 23,
      comments: 12,
      isLiked: true
    },
    {
      id: '3',
      author: 'Anita Desai',
      authorLevel: 15,
      content: '🎉 Just reached Level 15 in Gujarati! 100 lessons completed. Special thanks to this amazing community for all the support!',
      language: 'Gujarati',
      type: 'achievement',
      timestamp: '6 hours ago',
      likes: 45,
      comments: 20,
      isLiked: true
    },
    {
      id: '4',
      author: 'Vikram Singh',
      authorLevel: 6,
      content: 'Can someone help me understand the difference between "आप" and "तुम" in Hindi? When should I use which one?',
      language: 'Hindi',
      type: 'question',
      timestamp: '8 hours ago',
      likes: 12,
      comments: 15,
      isLiked: false
    }
  ]);

  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'question', label: 'Questions' },
    { id: 'tip', label: 'Tips' },
    { id: 'achievement', label: 'Achievements' },
    { id: 'translation', label: 'Translations' }
  ];

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return '#1E3A8A';
      case 'tip': return '#059669';
      case 'achievement': return '#FF7722';
      case 'translation': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓';
      case 'tip': return '💡';
      case 'achievement': return '🏆';
      case 'translation': return '🔄';
      default: return '📝';
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === 'all' || post.type === selectedFilter;
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.language.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLikePost = (postId: string) => {
    // In a real app, this would update the backend
    console.log('Liked post:', postId);
  };

  const handleCommentPost = (postId: string) => {
    // In a real app, this would open a comment modal
    console.log('Comment on post:', postId);
  };

  const handleSharePost = (postId: string) => {
    // In a real app, this would open share options
    console.log('Share post:', postId);
  };

  const handleCreatePost = () => {
    // In a real app, this would open a create post modal
    console.log('Create new post');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Learn together, grow together</Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts, people, languages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts */}
      <ScrollView style={styles.postsContainer} showsVerticalScrollIndicator={false}>
        {filteredPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.avatarText}>
                    {post.author.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.authorDetails}>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <View style={styles.authorMeta}>
                    <Text style={styles.authorLevel}>Level {post.authorLevel}</Text>
                    <Text style={styles.postTime}>{post.timestamp}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.postMeta}>
                <View style={[styles.postTypeBadge, { backgroundColor: getPostTypeColor(post.type) }]}>
                  <Text style={styles.postTypeText}>
                    {getPostTypeIcon(post.type)} {post.type}
                  </Text>
                </View>
                <Text style={styles.postLanguage}>{post.language}</Text>
              </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.postActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleLikePost(post.id)}
              >
                <Heart 
                  size={20} 
                  color={post.isLiked ? '#DC2626' : '#6B7280'} 
                  fill={post.isLiked ? '#DC2626' : 'none'}
                />
                <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCommentPost(post.id)}
              >
                <MessageCircle size={20} color="#6B7280" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleSharePost(post.id)}
              >
                <Share2 size={20} color="#6B7280" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  searchSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  filtersContainer: {
    marginHorizontal: -5,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 5,
  },
  filterChipActive: {
    backgroundColor: '#FF7722',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  postsContainer: {
    flex: 1,
    padding: 20,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorLevel: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  postTypeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  postLanguage: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  postContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  likedText: {
    color: '#DC2626',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF7722',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});