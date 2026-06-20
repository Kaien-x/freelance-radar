import { useEffect } from 'react';
import { logEvent } from '../api/activity.api';

// Call at the top of any page component to record a page visit.
// Fires once on mount; silently ignores errors so tracking never breaks the UI.
export default function useTrackPage(pageName) {
  useEffect(() => {
    logEvent('page_view', pageName);
  }, [pageName]);
}
