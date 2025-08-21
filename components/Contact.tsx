'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { EarthCanvas } from './canvas';
import SectionWrapper from '../hoc/SectionWrapper';
import { slideIn } from '../utils';

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSubmitSuccess(false);

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
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error sending message:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <SectionWrapper idName="contact">
      <div
        className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
      >
        <motion.div
          variants={slideIn('left', 'tween', 0.2, 1) as any}
          className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
        >
          {!submitSuccess ? (
            // Show Form
            <>
              <p className={styles.sectionSubText}>Get in touch</p>
              <h3 className={styles.sectionHeadText}>Contact.</h3>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-12 flex flex-col gap-8"
              >
                <label className="flex flex-col">
                  <span className="text-secondary  font-medium mb-4">
                    Your Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your name?"
                    className="bg-tertiary py-4 px-6 placeholder:text-secondary text-secondary  rounded-lg outline-none border-none font-medium"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-secondary  font-medium mb-4">
                    Your email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your email address?"
                    className="bg-tertiary py-4 px-6 placeholder:text-secondary text-secondary  rounded-lg outline-none border-none font-medium"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-secondary  font-medium mb-4">
                    Your Message
                  </span>
                  <textarea
                    rows={7}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Please type your message"
                    className="bg-tertiary py-4 px-6 placeholder:text-secondary text-secondary  rounded-lg outline-none border-none font-medium"
                  />
                </label>

                <button
                  type="submit"
                  className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-secondary  font-bold shadow-md shadow-primary hover:bg-tertiary/90 transition-colors disabled:opacity-50"
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
                    className="mt-6 p-6 bg-gradient-to-r from-red-400/10 to-orange-500/10 border border-red-400/20 rounded-xl backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-secondary "
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-red-400">
                          Oops! Something went wrong
                        </h3>
                        <p className="text-secondary mt-1">{errorMessage}</p>
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
              className="flex flex-col items-center justify-center min-h-[500px] text-center"
            >
              <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mb-8 mx-auto">
                <svg
                  className="w-10 h-10 text-secondary "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="text-4xl font-bold text-green-400 mb-4">
                Message Sent!
              </h2>
              <p className="text-xl text-secondary mb-2">
                Thank you,{' '}
                <span className="text-secondary  font-semibold">
                  {form.name}
                </span>
                !
              </p>
              <p className="text-lg text-secondary mb-8 max-w-md">
                I've received your message and will get back to you as soon as
                possible.
              </p>

              <button
                onClick={resetForm}
                className="bg-tertiary py-3 px-8 rounded-xl outline-none text-secondary  font-bold shadow-md shadow-primary hover:bg-tertiary/90 transition-colors mb-4"
              >
                Send Another Message
              </button>

              <p className="text-sm text-secondary/70">
                This form will reset automatically in 10 seconds
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={slideIn('right', 'tween', 0.2, 1) as any}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
