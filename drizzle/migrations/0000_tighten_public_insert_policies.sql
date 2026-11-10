DROP POLICY IF EXISTS "Anyone can insert visitor data" ON public.visitors;
CREATE POLICY "Anyone can insert visitor data" ON public.visitors FOR INSERT TO anon, authenticated
WITH CHECK (
  length(session_id) BETWEEN 1 AND 100
  AND length(page_path) BETWEEN 1 AND 500
  AND (referrer IS NULL OR length(referrer) <= 1000)
  AND (user_agent IS NULL OR length(user_agent) <= 1000)
  AND (country IS NULL OR length(country) <= 100)
  AND (city IS NULL OR length(city) <= 100)
);

DROP POLICY IF EXISTS "Anyone can insert visitor events" ON public.visitor_events;
CREATE POLICY "Anyone can insert visitor events" ON public.visitor_events FOR INSERT TO anon, authenticated
WITH CHECK (
  length(session_id) BETWEEN 1 AND 100
  AND length(page_path) BETWEEN 1 AND 500
  AND length(event_type) BETWEEN 1 AND 50
  AND (element_tag IS NULL OR length(element_tag) <= 50)
  AND (element_text IS NULL OR length(element_text) <= 500)
  AND (element_id IS NULL OR length(element_id) <= 200)
  AND (element_class IS NULL OR length(element_class) <= 500)
);

DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND (user_id IS NULL OR user_id = auth.uid())
  AND length(name) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(subject) BETWEEN 1 AND 200
  AND length(message) BETWEEN 1 AND 5000
);