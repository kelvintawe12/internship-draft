import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailIcon, UserIcon, MessageSquareIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

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
          Get in Touch with Us
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Have questions or feedback? We're here to help!
        </p>
      </div>
    </motion.section>
  );
};

const Contact: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit: SubmitHandler<ContactForm> = async (data) => {
    setIsLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      toast.success('Your message has been sent! We’ll respond soon.', {
        theme: 'light',
      });
      setIsSubmitted(true);
      reset();
    } catch (error: any) {
      toast.error('Failed to send message. Please try again.', { theme: 'light' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeroSection />
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              {isSubmitted ? 'Message Sent!' : 'Contact Form'}
            </h2>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Thank you for reaching out. We’ll get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                  aria-label="Send Another Message"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <UserIcon size={16} className="mr-2 text-indigo-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MailIcon size={16} className="mr-2 text-indigo-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MessageSquareIcon size={16} className="mr-2 text-indigo-600" />
                    Message
                  </label>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters',
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 resize-y"
                    aria-invalid={errors.message ? 'true' : 'false'}
                    placeholder="Your message..."
                    rows={5}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
                  aria-label="Send Message"
                >
                  {isLoading && <Spinner loading={true} variant="inline" />}
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;