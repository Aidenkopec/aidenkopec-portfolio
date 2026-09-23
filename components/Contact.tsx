'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import SectionHeader from '@/components/chart/SectionHeader';
import SectionWrapper from '@/components/layout/SectionWrapper';
import {
  contactSchema,
  firstIssue,
  type ContactField,
} from '@/lib/contact-schema';

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

  // The swarm's galaxy beside the form reacts to each send. A counter makes
  // every result a new value, so two sends in a row each register.
  const sendCountRef = useRef(0);
  const [lastSend, setLastSend] = useState('');

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
        setLastSend(`sent-${++sendCountRef.current}`);

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
      setLastSend(`error-${++sendCountRef.current}`);
      console.error('Error sending message:', error);
      setErrorField(undefined);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  const fieldClass =
    'border-0 border-b border-white-100/20 bg-transparent px-0 py-3 text-[17px] text-white-100 outline-none transition-colors placeholder:text-white-100/35 focus-visible:border-[var(--text-color-variable)] focus-visible:shadow-[0_1px_0_0_var(--text-color-variable)] aria-[invalid=true]:border-[var(--text-color-variable)]';

  return (
    <SectionWrapper idName='contact' label='Contact'>
      <SectionHeader
        title='Contact'
        intro="Have a project in mind, or a question about something here? Send a message and I'll reply by email."
      />

      <div className='mt-12 grid gap-10 xl:grid-cols-[1.1fr_1fr] xl:gap-16'>
        {/* The swarm draws a galaxy over this box, and the flight path ends
            in it. No transform on it, since the swarm only re-reads its rect
            on scroll and resize. */}
        <div
          aria-hidden='true'
          data-swarm-slot='galaxy'
          data-swarm-send={loading ? 'sending' : lastSend}
          data-waypoint
          className='galaxy-slot min-h-[320px] md:min-h-[460px]'
        />

        <div className='self-center'>
          {!submitSuccess ? (
            <form
              onSubmit={handleSubmit}
              aria-busy={loading}
              className='flex flex-col gap-8'
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

              <label htmlFor='contact-name' className='flex flex-col gap-1'>
                <span className='text-[14px] text-white-100/60'>Name</span>
                <input
                  id='contact-name'
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete='name'
                  aria-invalid={errorField === 'name'}
                  aria-describedby={
                    errorField === 'name' ? 'contact-error' : undefined
                  }
                  className={fieldClass}
                />
              </label>
              <label htmlFor='contact-email' className='flex flex-col gap-1'>
                <span className='text-[14px] text-white-100/60'>Email</span>
                <input
                  id='contact-email'
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete='email'
                  aria-invalid={errorField === 'email'}
                  aria-describedby={
                    errorField === 'email' ? 'contact-error' : undefined
                  }
                  className={fieldClass}
                />
              </label>
              <label htmlFor='contact-message' className='flex flex-col gap-1'>
                <span className='text-[14px] text-white-100/60'>Message</span>
                <textarea
                  id='contact-message'
                  rows={5}
                  name='message'
                  value={form.message}
                  onChange={handleChange}
                  placeholder='What are you working on?'
                  required
                  aria-invalid={errorField === 'message'}
                  aria-describedby={
                    errorField === 'message' ? 'contact-error' : undefined
                  }
                  className={`${fieldClass} resize-none`}
                />
              </label>

              <button
                type='submit'
                className='w-fit rounded-full bg-[var(--text-color-variable)] px-7 py-3 font-semibold text-[var(--primary-color)] transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--primary-color)] disabled:opacity-50'
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>

              {errorMessage && (
                <motion.div
                  id='contact-error'
                  role='alert'
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='border-l-2 border-[var(--text-color-variable)] pl-4'
                >
                  <p className='font-medium text-white-100'>Message not sent</p>
                  <p className='mt-1 text-white-100/70'>{errorMessage}</p>
                </motion.div>
              )}
            </form>
          ) : (
            <motion.div
              ref={successRef}
              role='status'
              tabIndex={-1}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className='outline-none'
            >
              <h3 className='chart-title'>Message sent</h3>
              <p className='mt-6 max-w-md text-[17px] leading-[1.7] text-white-100/80'>
                Thanks, {form.name}. I&apos;ll reply by email.
              </p>

              <button
                onClick={resetForm}
                className='mt-8 rounded-full bg-[var(--text-color-variable)] px-7 py-3 font-semibold text-[var(--primary-color)] transition-opacity outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--text-color-variable)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--primary-color)] disabled:opacity-50'
              >
                Send another message
              </button>

              <p className='mt-4 text-sm text-white-100/50'>
                This form resets on its own in 10 seconds.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
