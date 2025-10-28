'use client';
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

import SectionWrapper from '../hoc/SectionWrapper';
import { styles } from '../styles';
import { slideIn } from '../utils';

import { EarthCanvas } from './canvas';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });

    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const triggerConfetti = () => {
    // Trigger confetti effect from center of form area
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: {
          x: 0.4, // Center-left where form is positioned
          y: 0.5,
        },
      });
    });
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setErrorMessage('');
    setForm({
      name: '',
      email: '',
      message: '',
    });
  };

  const validateLocally = (): boolean => {
    // Name validation
    if (!form.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }

    if (form.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters');
      return false;
    }

    if (form.name.trim().length > 100) {
      setErrorMessage('Name must be less than 100 characters');
      return false;
    }

    // Email validation
    if (!form.email.trim()) {
      setErrorMessage('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim().toLowerCase())) {
      setErrorMessage('Please provide a valid email address');
      return false;
    }

    // Message validation
    if (!form.message.trim()) {
      setErrorMessage('Message is required');
      return false;
    }

    if (form.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters');
      return false;
    }

    if (form.message.trim().length > 5000) {
      setErrorMessage('Message must be less than 5000 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitSuccess(false);

    // Validate locally first
    if (!validateLocally()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (response.ok) {
        setLoading(false);
        setSubmitSuccess(true);
        triggerConfetti();

        // Reset form after a delay to let user see success message
        setTimeout(() => {
          resetForm();
        }, 10000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error sending message:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <SectionWrapper idName='contact'>
      <div
        className={`flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row`}
      >
        <motion.div
          variants={slideIn('left', 'tween', 0.2, 1) as any}
          className='bg-black-100 flex-[0.75] rounded-2xl p-8'
        >
          {!submitSuccess ? (
            // Show Form
            <>
              <p className={styles.sectionSubText}>Get in touch</p>
              <h3 className={styles.sectionHeadText}>Contact.</h3>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className='mt-12 flex flex-col gap-8'
              >
                <label className='flex flex-col'>
                  <span className='text-secondary mb-4 font-medium'>
                    Your Name
                  </span>
                  <input
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your name?"
                    className='bg-tertiary placeholder:text-secondary text-secondary rounded-lg border-none px-6 py-4 font-medium outline-none'
                  />
                </label>
                <label className='flex flex-col'>
                  <span className='text-secondary mb-4 font-medium'>
                    Your email
                  </span>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your email address?"
                    className='bg-tertiary placeholder:text-secondary text-secondary rounded-lg border-none px-6 py-4 font-medium outline-none'
                  />
                </label>
                <label className='flex flex-col'>
                  <span className='text-secondary mb-4 font-medium'>
                    Your Message
                  </span>
                  <textarea
                    rows={7}
                    name='message'
                    value={form.message}
                    onChange={handleChange}
                    placeholder='Please type your message'
                    className='bg-tertiary placeholder:text-secondary text-secondary rounded-lg border-none px-6 py-4 font-medium outline-none'
                  />
                </label>

                <button
                  type='submit'
                  className='bg-tertiary text-secondary shadow-primary hover:bg-tertiary/90 w-fit rounded-xl px-8 py-3 font-bold shadow-md transition-colors outline-none disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='mt-6 rounded-xl border border-red-400/20 bg-gradient-to-r from-red-400/10 to-orange-500/10 p-6 backdrop-blur-sm'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='flex-shrink-0'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-red-400'>
                          <svg
                            className='text-secondary h-5 w-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-medium text-red-400'>
                          Oops! Something went wrong
                        </h3>
                        <p className='text-secondary mt-1'>{errorMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </>
          ) : (
            // Show Success Message
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className='flex min-h-[500px] flex-col items-center justify-center text-center'
            >
              <div className='mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-400'>
                <svg
                  className='text-secondary h-10 w-10'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>

              <h2 className='mb-4 text-4xl font-bold text-green-400'>
                Message Sent!
              </h2>
              <p className='text-secondary mb-2 text-xl'>
                Thank you,{' '}
                <span className='text-secondary font-semibold'>
                  {form.name}
                </span>
                !
              </p>
              <p className='text-secondary mb-8 max-w-md text-lg'>
                I&apos;ve received your message and will get back to you as soon
                as possible.
              </p>

              <button
                onClick={resetForm}
                className='bg-tertiary text-secondary shadow-primary hover:bg-tertiary/90 mb-4 rounded-xl px-8 py-3 font-bold shadow-md transition-colors outline-none'
              >
                Send Another Message
              </button>

              <p className='text-secondary/70 text-sm'>
                This form will reset automatically in 10 seconds
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={slideIn('right', 'tween', 0.2, 1) as any}
          className='h-[350px] md:h-[550px] xl:h-auto xl:flex-1'
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
