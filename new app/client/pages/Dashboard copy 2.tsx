import { PlaceholderPage } from './PlaceholderPage';

export default function Dashboard() {
  const features = [
    'Personalized grant recommendations',
    'Success rate and funding analytics',
    'Team collaboration tools',
    'Automated eligibility matching',
    'Calendar integration with deadlines',
    'Custom reporting and insights'
  ];

  return (
    <PlaceholderPage
      title="Grant Management Dashboard"
      description="Your central command center for all grant-related activities. Get personalized insights, track your team's progress, and discover new opportunities tailored to your organization's profile."
      comingSoonFeatures={features}
    />
  );
}
