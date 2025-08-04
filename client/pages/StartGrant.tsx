import { PlaceholderPage } from '../components/PlaceholderPage';

export default function StartGrant() {
  const features = [
    'AI-powered grant application assistant',
    'Smart form builder with auto-suggestions',
    'Document templates and examples',
    'Eligibility checker and requirements guide',
    'Progress tracking and deadline reminders',
    'PDF export and submission tools'
  ];

  return (
    <PlaceholderPage
      title="Start a Grant Application"
      description="Our intelligent grant application builder will guide you through the entire process, from initial eligibility checks to final submission. Get personalized recommendations and AI assistance every step of the way."
      comingSoonFeatures={features}
    />
  );
}
