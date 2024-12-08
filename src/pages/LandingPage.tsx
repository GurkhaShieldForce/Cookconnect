// src/pages/LandingPage.tsx
import MainLayout from '../layouts/MainLayout';
import { Hero } from '../components/landing/Hero';
import { TrustIndicators } from '../components/landing/TrustIndicators';

export default function LandingPage() {
  return (
    <MainLayout>
      <Hero />
      <TrustIndicators />
    </MainLayout>
  );
}