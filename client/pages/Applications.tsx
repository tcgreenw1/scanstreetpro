import { PlaceholderPage } from '../components/PlaceholderPage';

export default function Applications() {
  const features = [
    'Track all submitted applications in one place',
    'Real-time status updates and notifications',
    'Document management and version control',
    'Deadline alerts and renewal reminders',
    'Success rate analytics and insights',
    'Integration with agency portals'
  ];

  return (
    <PlaceholderPage
      title="My Grant Applications"
      description="Manage and track all your grant applications from a single dashboard. Monitor progress, receive updates, and never miss an important deadline with our comprehensive tracking system."
      comingSoonFeatures={features}
    />
  );
}
