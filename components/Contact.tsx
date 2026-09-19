'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';

import SectionWrapper from '../hoc/SectionWrapper';
import { useCanRender3D } from '../hooks/useCanRender3D';
import { useInViewport } from '../hooks/useInViewport';
import {
  contactSchema,
  firstIssue,
  type ContactField,
} from '../lib/contact-schema';
import { styles } from '../styles';
import { slideIn } from '../utils';

import CanvasPlaceholder from './CanvasPlaceholder';

// Loaded on demand so three.js stays out of the initial bundle, and only once
// the section is approaching the viewport.
const EarthCanvas = dynamic(() => import('./canvas/Earth'), {
  ssr: false,
  loading: () => <CanvasPlaceholder />,
});

interface FormData {
  name: string;
  email: string;
  message: string;
  /** Honeypot: any value means an automated fill. */
  website: string;
}

const EMPTY_FORM: FormData = {
  name: '',
  email: '',
  message: '',
  website: '',
};

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const [loading, setLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  // Which input the current error belongs to, so only that one is marked
  // invalid. Undefined for errors that belong to no single field, such as a
  // failed request.
  const [errorField, setErrorField] = useState<ContactField | undefined>(
    undefined,
  );

  const canRender3D = useCanRender3D();
  const {
    ref: globeRef,
    mounted: globeMounted,
    paused: globePaused,
  } = useInViewport<HTMLDivElement>(canRender3D);

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
      setErrorField(undefined);
    }
  };

  const triggerConfetti = () => {
    // Canvas + requestAnimationFrame, so neither the reduced-motion CSS block
    // nor MotionConfig reaches it. Checked inline rather than through a hook
    // because this runs from an event handler.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

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

  // The success view replaces the form, so focus would otherwise be stranded on
  // a button that no longer exists.
  useEffect(() => {
    if (submitSuccess) {
      successRef.current?.focus();
    }
  }, [submitSuccess]);

  const resetForm = () => {
    setSubmitSuccess(false);
    setErrorMessage('');
    setErrorField(undefined);
    setForm(EMPTY_FORM);
  };

  const validateLocally = (): boolean => {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const issue = firstIssue(parsed.error);
      setErrorMessage(issue.message);
      setErrorField(issue.field);
      return false;
    }
    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setErrorMessage('');
    setErrorField(undefined);
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
          website: form.website,
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
      setErrorField(undefined);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <SectionWrapper idName='contact' label='Contact'>
      <div
        className={`flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row`}
      >
        <motion.div
          variants={slideIn('left', 'tween', 0.2, 1)}
          className='flex-[0.75] rounded-2xl bg-black-100 p-8'
        >
          {!submitSuccess ? (
            // Show Form
            <>
              <p className={styles.sectionSubText}>Get in touch</p>
              <h3 className={styles.sectionHeadText}>Contact.</h3>

              <form
                ref={formRef}
                onSubmit={handleSubmit}
                aria-busy={loading}
                className='mt-12 flex flex-col gap-8'
              >
                {/* Honeypot. `hidden`, not sr-only, so it takes no gap slot. */}
                <input
                  type='text'
                  name='website'
                  value={form.website}
                  onChange={handleChange}
                  className='hidden'
                  tabIndex={-1}
                  autoComplete='off'
                  aria-hidden='true'
                />

                <label htmlFor='contact-name' className='flex flex-col'>
                  <span className='mb-4 font-medium text-secondary'>
                    Your Name
                  </span>
                  <input
                    id='contact-name'
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    placeholder="What's your name?"
                    required
                    autoComplete='name'
                    aria-invalid={errorField === 'name'}
                    aria-describedby={
                      errorField === 'name' ? 'contact-error' : undefined
                    }
                    className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-secondary outline-none placeholder:text-secondary/50 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-color)]'
                  />
                </label>
                <label htmlFor='contact-email' className='flex flex-col'>
                  <span className='mb-4 font-medium text-secondary'>
                    Your email
                  </span>
                  <input
                    id='contact-email'
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    placeholder="What's your email address?"
                    required
                    autoComplete='email'
                    aria-invalid={errorField === 'email'}
                    aria-describedby={
                      errorField === 'email' ? 'contact-error' : undefined
                    }
                    className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-secondary outline-none placeholder:text-secondary/50 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-color)]'
                  />
                </label>
                <label htmlFor='contact-message' className='flex flex-col'>
                  <span className='mb-4 font-medium text-secondary'>
                    Your Message
                  </span>
                  <textarea
                    id='contact-message'
                    rows={7}
                    name='message'
                    value={form.message}
                    onChange={handleChange}
                    placeholder='Please type your message'
                    required
                    aria-invalid={errorField === 'message'}
                    aria-describedby={
                      errorField === 'message' ? 'contact-error' : undefined
                    }
                    className='rounded-lg border-none bg-tertiary px-6 py-4 font-medium text-secondary outline-none placeholder:text-secondary/50 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-color)]'
                  />
                </label>

                <button
                  type='submit'
                  className='w-fit rounded-xl bg-tertiary px-8 py-3 font-bold text-secondary shadow-md shadow-primary transition-colors outline-none hover:bg-tertiary/90 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-color)] disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    id='contact-error'
                    role='alert'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='mt-6 rounded-xl border border-red-400/20 bg-gradient-to-r from-red-400/10 to-orange-500/10 p-6 backdrop-blur-sm'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='flex-shrink-0'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-red-400'>
                          <svg
                            aria-hidden='true'
                            className='h-5 w-5 text-secondary'
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
                        <p className='mt-1 text-secondary'>{errorMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>
            </>
          ) : (
            // Show Success Message
            <motion.div
              ref={successRef}
              role='status'
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className='flex min-h-[500px] flex-col items-center justify-center text-center outline-none'
            >
              <div className='mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-400'>
                <svg
                  aria-hidden='true'
                  className='h-10 w-10 text-secondary'
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
              <p className='mb-2 text-xl text-secondary'>
                Thank you,{' '}
                <span className='font-semibold text-secondary'>
                  {form.name}
                </span>
                !
              </p>
              <p className='mb-8 max-w-md text-lg text-secondary'>
                I&apos;ve received your message and will get back to you as soon
                as possible.
              </p>

              <button
                onClick={resetForm}
                className='mb-4 rounded-xl bg-tertiary px-8 py-3 font-bold text-secondary shadow-md shadow-primary transition-colors outline-none hover:bg-tertiary/90 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-color)]'
              >
                Send Another Message
              </button>

              <p className='text-sm text-secondary/70'>
                This form will reset automatically in 10 seconds
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          ref={globeRef}
          variants={slideIn('right', 'tween', 0.2, 1)}
          className='h-[350px] md:h-[550px] xl:h-auto xl:flex-1'
        >
          {canRender3D && globeMounted ? (
            <EarthCanvas paused={globePaused} />
          ) : (
            <CanvasPlaceholder />
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
