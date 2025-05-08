import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { InfoIcon } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <motion.section
      className="bg-indigo-600 text-white py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          About Mount Meru SoyCo
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Crafting quality cooking oils with a commitment to sustainability and community
        </p>
        <Link
          to="/contact"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg focus:ring-2 focus:ring-green-500"
          aria-label="Contact Us"
        >
          Get in Touch
        </Link>
      </div>
    </motion.section>
  );
};

const About: React.FC = () => {
  return (
    <>
      <HeroSection />
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-12">
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon className="mr-2 text-indigo-600" />
                Our Mission
              </h3>
              <p className="text-gray-600">
                At Mount Meru SoyCo, we are dedicated to producing high-quality, healthy cooking oils that enhance every meal. Our mission is to promote sustainable agriculture and empower Rwandan farmers through fair trade practices.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon className="mr-2 text-indigo-600" />
                Our Vision
              </h3>
              <p className="text-gray-600">
                We aim to be East Africa's leading cooking oil brand, known for quality, innovation, and environmental responsibility. By 2030, we plan to expand our reach while maintaining our commitment to local communities.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <InfoIcon className="mr-2 text-indigo-600" />
                Our History
              </h3>
              <p className="text-gray-600">
                Founded in 2010 in Kigali, Mount Meru SoyCo started as a small processing unit. Over the past decade, we’ve grown into a trusted name, serving households, restaurants, and institutions across Rwanda with our premium oils.
              </p>
            </motion.div>
            <motion.div
              className="bg-white shadow-md rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Join Our Journey</h3>
              <p className="text-gray-600 mb-4">
                Discover our products or reach out to learn more about our initiatives.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/products"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                  aria-label="View Products"
                >
                  View Products
                </Link>
                <Link
                  to="/contact"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
                  aria-label="Contact Us"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;