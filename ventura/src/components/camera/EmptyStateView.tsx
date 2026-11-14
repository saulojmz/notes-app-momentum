import { Camera } from 'lucide-react';
import { EmptyState } from '@/components/kit';

export const EmptyStateView = () => (
  <EmptyState icon={Camera} title="Your discoveries will appear here" description="Capture a landmark to start your collection." />
);
