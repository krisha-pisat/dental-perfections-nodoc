import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBlogPosts } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard'; // Import the card

// Define categories manually for filtering
const categories = ['All', 'Oral Health', 'Treatments', 'Cosmetic Dentistry', 'Emergency Care'];

const BlogPage = () => {
  const [posts, setPosts] = useState([]); // State for fetched posts
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch blog posts from Django API
  useEffect(() => {
    setLoading(true);
    getBlogPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      });
  }, []);

  // Filter posts based on the selected category
  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div>
      <Navbar />
      {/* Header Section */}
      <section className="bg-gradient-to-b from-white via-blue-50 to-white pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#d1fae5] text-[#065f46] text-sm font-medium rounded-full mb-4 shadow-sm">
              ✨ Patient Resources
            </span>
            <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-[#1e3a8a] mb-5">
              Your Dental Health Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert advice, tips, and insights to help you maintain a healthy, beautiful smile.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-[72px] md:top-[88px] z-40 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#1e3a8a] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="bg-gray-50 py-20 px-6 lg:px-8 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-10">Loading posts...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <BlogCard
                    key={post.id || post.slug} // Use id or slug from API
                    post={{
                      slug: post.slug,
                      category: post.category,
                      title: post.title,
                      excerpt: post.excerpt,
                      date: post.publish_date, // Use field name from Django
                      readTime: post.read_time, // Use field name from Django
                      imageUrl: post.image_url, // Use field name from Django
                      external_url: post.external_url // Use field name from Django
                    }}
                    index={index}
                  />
                ))
              ) : (
                <p className="text-gray-500 md:col-span-2 lg:col-span-3 text-center py-10">No posts found in this category.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;