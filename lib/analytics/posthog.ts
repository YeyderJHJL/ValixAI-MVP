import posthog from 'posthog-js';

export function initPostHog() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://us.i.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      }
    });
  }
}

export async function trackEvent({ 
  event, 
  userId, 
  properties = {} 
}: {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
}) {
  // PostHog (frontend)
  if (typeof window !== 'undefined') {
    posthog.capture(event, properties);
  }
  
  // Supabase (backend para análisis SQL)
  if (userId) {
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    
    await supabase.from('eventos').insert({
      test_id: userId,
      evento_tipo: event,
      evento_data: properties
    });
  }
}

export const EVENTS = {
  TEST_STARTED: 'test_started',
  TEST_STEP_COMPLETED: 'test_step_completed',
  TEST_ABANDONED: 'test_abandoned',
  TEST_COMPLETED: 'test_completed',
  REPORT_VIEWED: 'report_viewed',
  WHATSAPP_CLICKED: 'whatsapp_clicked',
  PDF_DOWNLOADED: 'pdf_downloaded',
} as const;
