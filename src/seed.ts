import 'dotenv/config';
import mongoose from 'mongoose';
import Feature from './models/Feature.js';
import Setting from './models/Setting.js';

// Same content as the frontend's mock fallback in src/lib/content-api.ts
const features = [
  { title: 'Smart Scheduling', description: 'Automated booking system with calendar sync, timezone detection, and buffer time management.', icon: 'Calendar' },
  { title: 'Client Management', description: 'Track client progress, session notes, and outcomes with a centralized roster.', icon: 'Users' },
  { title: 'Video Sessions', description: 'Host, record, and manage video coaching sessions with built-in screen sharing.', icon: 'Video' },
  { title: 'Payments & Invoicing', description: 'Accept payments, send invoices, and manage subscriptions — all in one dashboard.', icon: 'CreditCard' }
];

// hero_content and about_content mirror the defaults in the frontend (Hero.astro, about.astro),
// so a seeded database shows the same copy as an unseeded one.
const settings = {
  hero_content: {
    headline: 'Run your coaching practice from one place.',
    subheadline:
      'Clients book and pay, you meet on video, and notes and progress stay with the client. Built for solo coaches, tutors and mentors.',
    ctaPrimary: 'Join the waitlist',
    ctaSecondary: 'See features'
  },
  about_content: {
    mission: 'Our mission is to empower coaches, tutors, and mentors with the tools they need to build thriving businesses.',
    preamble:
      'NexusHQ was born from a simple observation: coaches spend more time on admin than on coaching.\n\nWe built a platform that handles scheduling, payments, client management, and video sessions, so you can focus on what you do best.',
    vision: 'A world where every great coach has the tools to scale their impact, without the overhead.'
  },
  mentorship_content: {
    title: 'Expert Coaching Tools',
    description: 'Everything you need to run a professional coaching business.',
    benefits: [
      'Automated scheduling and booking management',
      'Client progress tracking and analytics',
      'Integrated video session hosting'
    ]
  }
};

if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing');
await mongoose.connect(process.env.MONGODB_URI);

for (const [order, f] of features.entries()) {
  await Feature.updateOne({ title: f.title }, { $set: { ...f, order } }, { upsert: true });
}
for (const [key, value] of Object.entries(settings)) {
  await Setting.updateOne({ key }, { $set: { value } }, { upsert: true });
}

console.log(`Seeded ${features.length} features and ${Object.keys(settings).length} settings`);
await mongoose.disconnect();
