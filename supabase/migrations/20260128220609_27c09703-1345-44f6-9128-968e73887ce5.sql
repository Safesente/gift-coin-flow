-- Create table for tracking visitor interactions/events
CREATE TABLE public.visitor_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'click', 'scroll', 'form_submit', 'button_click'
  element_tag TEXT, -- 'button', 'a', 'input', etc.
  element_text TEXT, -- button text or link text
  element_id TEXT, -- element id if available
  element_class TEXT, -- element classes
  x_position INTEGER, -- click x position
  y_position INTEGER, -- click y position
  viewport_width INTEGER,
  viewport_height INTEGER,
  scroll_depth INTEGER, -- percentage scrolled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous tracking)
CREATE POLICY "Anyone can insert visitor events"
ON public.visitor_events
FOR INSERT
WITH CHECK (true);

-- Only admins can view events
CREATE POLICY "Admins can view all visitor events"
ON public.visitor_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete events
CREATE POLICY "Admins can delete visitor events"
ON public.visitor_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for efficient querying
CREATE INDEX idx_visitor_events_session ON public.visitor_events(session_id);
CREATE INDEX idx_visitor_events_page ON public.visitor_events(page_path);
CREATE INDEX idx_visitor_events_type ON public.visitor_events(event_type);
CREATE INDEX idx_visitor_events_created ON public.visitor_events(created_at DESC);