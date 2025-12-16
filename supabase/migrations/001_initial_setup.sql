-- Migration: 001_initial_setup.sql
-- Beschreibung: Erstellt alle Tabellen für die Gumb Fussball App
-- Ausführung: Manuell im Supabase SQL-Editor ausführen

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Tabelle (erweitert Supabase Auth)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Tabelle
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'Training',
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location TEXT NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Utensilien Tabelle
CREATE TABLE public.utensils (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL, -- emoji or icon identifier
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Responses (Zusagen/Absagen)
CREATE TABLE public.event_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    response_type TEXT NOT NULL CHECK (response_type IN ('zusage', 'absage')),
    guest_count INTEGER DEFAULT 0 CHECK (guest_count >= 0),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Utensil Assignments (Wer bringt was mit)
CREATE TABLE public.utensil_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    utensil_id UUID NOT NULL REFERENCES public.utensils(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, utensil_id, user_id)
);

-- Indexes für Performance
CREATE INDEX idx_events_date ON public.events(event_date DESC);
CREATE INDEX idx_event_responses_event ON public.event_responses(event_id);
CREATE INDEX idx_event_responses_user ON public.event_responses(user_id);
CREATE INDEX idx_utensil_assignments_event ON public.utensil_assignments(event_id);

-- Row Level Security (RLS) aktivieren
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utensils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utensil_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies für users
CREATE POLICY "Users können ihr eigenes Profil sehen"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Alle authentifizierten User können alle User sehen"
    ON public.users FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users können ihr eigenes Profil aktualisieren"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- RLS Policies für events
CREATE POLICY "Alle authentifizierten User können Events sehen"
    ON public.events FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Nur Admins können Events erstellen"
    ON public.events FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

CREATE POLICY "Nur Admins können Events aktualisieren"
    ON public.events FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

CREATE POLICY "Nur Admins können Events löschen"
    ON public.events FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND is_admin = TRUE
        )
    );

-- RLS Policies für utensils
CREATE POLICY "Alle authentifizierten User können Utensilien sehen"
    ON public.utensils FOR SELECT
    USING (auth.role() = 'authenticated');

-- RLS Policies für event_responses
CREATE POLICY "Alle authentifizierten User können Responses sehen"
    ON public.event_responses FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users können ihre eigenen Responses erstellen"
    ON public.event_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users können ihre eigenen Responses aktualisieren"
    ON public.event_responses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users können ihre eigenen Responses löschen"
    ON public.event_responses FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies für utensil_assignments
CREATE POLICY "Alle authentifizierten User können Assignments sehen"
    ON public.utensil_assignments FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users können ihre eigenen Assignments erstellen"
    ON public.utensil_assignments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users können ihre eigenen Assignments löschen"
    ON public.utensil_assignments FOR DELETE
    USING (auth.uid() = user_id);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_responses_updated_at BEFORE UPDATE ON public.event_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Initiale Utensilien einfügen
INSERT INTO public.utensils (name, icon, sort_order) VALUES
    ('Ball', '⚽', 1),
    ('Pumpe', '💨', 2),
    ('Überzieher', '👕', 3);

-- Kommentar: Nach dieser Migration müssen User manuell in der Supabase Auth angelegt werden
-- und dann in der users Tabelle mit ihrem Nickname eingetragen werden.
