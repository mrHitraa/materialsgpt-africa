CREATE TYPE public.extraction_status AS ENUM ('pending','in_progress','extracted','verified','failed');
CREATE TYPE public.verification_status AS ENUM ('unverified','verified','rejected');
CREATE TYPE public.material_type AS ENUM ('alloy','coating');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.literature_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 3 AND 500),
  authors text NOT NULL CHECK (length(btrim(authors)) BETWEEN 2 AND 1000),
  publication_year integer NOT NULL CHECK (publication_year BETWEEN 1900 AND 2100),
  journal text CHECK (journal IS NULL OR length(journal) <= 300),
  doi text UNIQUE CHECK (doi IS NULL OR doi ~* '^10\.\d{4,9}/\S+$'),
  source_url text CHECK (source_url IS NULL OR source_url ~* '^https?://'),
  full_text_url text CHECK (full_text_url IS NULL OR full_text_url ~* '^https?://'),
  source_database text CHECK (source_database IS NULL OR length(source_database) <= 100),
  extraction_status public.extraction_status NOT NULL DEFAULT 'pending',
  extraction_confidence numeric(4,3) CHECK (extraction_confidence IS NULL OR extraction_confidence BETWEEN 0 AND 1),
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT literature_has_reference CHECK (is_demo OR doi IS NOT NULL OR source_url IS NOT NULL)
);
CREATE TRIGGER literature_updated_at BEFORE UPDATE ON public.literature_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.candidate_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (length(btrim(name)) BETWEEN 2 AND 200),
  material_type public.material_type NOT NULL,
  description text,
  cost_tag text CHECK (cost_tag IS NULL OR cost_tag IN ('low','medium','high','unknown')),
  local_availability_tag text CHECK (local_availability_tag IS NULL OR local_availability_tag IN ('available','limited','imported','unknown')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.corrosion_observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  literature_record_id uuid NOT NULL REFERENCES public.literature_records(id) ON DELETE CASCADE,
  material_name text NOT NULL CHECK (length(btrim(material_name)) >= 2),
  salt_composition text NOT NULL CHECK (length(btrim(salt_composition)) >= 2),
  temperature_c numeric NOT NULL CHECK (temperature_c BETWEEN -273.15 AND 2000),
  exposure_time numeric CHECK (exposure_time IS NULL OR exposure_time > 0),
  exposure_time_unit text CHECK (exposure_time_unit IS NULL OR exposure_time_unit IN ('h','d','cycles')),
  corrosion_rate numeric CHECK (corrosion_rate IS NULL OR corrosion_rate >= 0),
  corrosion_rate_unit text CHECK (corrosion_rate_unit IS NULL OR corrosion_rate_unit IN ('µm/yr','mm/yr','mg/cm²','mg/cm²/h')),
  thermal_cycling_details text,
  test_method text,
  notes text,
  verification_status public.verification_status NOT NULL DEFAULT 'unverified',
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exposure_unit_required CHECK ((exposure_time IS NULL) = (exposure_time_unit IS NULL)),
  CONSTRAINT rate_unit_required CHECK ((corrosion_rate IS NULL) = (corrosion_rate_unit IS NULL))
);
CREATE INDEX ON public.corrosion_observations(literature_record_id);

CREATE TABLE public.benchmark_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.candidate_materials(id) ON DELETE CASCADE,
  source_observation_id uuid NOT NULL REFERENCES public.corrosion_observations(id) ON DELETE CASCADE,
  metric_name text NOT NULL CHECK (length(btrim(metric_name)) >= 2),
  metric_value numeric NOT NULL,
  metric_unit text NOT NULL CHECK (length(btrim(metric_unit)) >= 1),
  temperature_c numeric NOT NULL CHECK (temperature_c BETWEEN -273.15 AND 2000),
  salt_composition text NOT NULL,
  notes text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.benchmark_results(material_id);

GRANT SELECT, INSERT ON public.literature_records, public.corrosion_observations TO anon, authenticated;
GRANT SELECT ON public.candidate_materials, public.benchmark_results TO anon, authenticated;
GRANT ALL ON public.literature_records, public.corrosion_observations, public.candidate_materials, public.benchmark_results TO service_role;

ALTER TABLE public.literature_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrosion_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmark_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read literature" ON public.literature_records FOR SELECT USING (true);
CREATE POLICY "Public add non-demo literature" ON public.literature_records FOR INSERT WITH CHECK (is_demo = false AND extraction_status = 'pending');
CREATE POLICY "Public read observations" ON public.corrosion_observations FOR SELECT USING (true);
CREATE POLICY "Public add unverified observations" ON public.corrosion_observations FOR INSERT WITH CHECK (is_demo = false AND verification_status = 'unverified');
CREATE POLICY "Public read materials" ON public.candidate_materials FOR SELECT USING (true);
CREATE POLICY "Public read benchmarks" ON public.benchmark_results FOR SELECT USING (true);

INSERT INTO public.candidate_materials (name, material_type, description, cost_tag, local_availability_tag) VALUES
 ('316L stainless steel','alloy','Austenitic stainless steel','medium','unknown'),
 ('Inconel 625','alloy','Nickel-based superalloy','high','unknown'),
 ('P91','alloy','Ferritic-martensitic steel','medium','unknown'),
 ('A516 carbon steel','alloy','Carbon steel','low','unknown'),
 ('Stainless steel 430','alloy','Ferritic stainless. Included only if sufficient solar-salt evidence exists','low','unknown');
UPDATE public.candidate_materials SET active = false WHERE name = 'Stainless steel 430';

INSERT INTO public.literature_records (id, title, authors, publication_year, journal, source_database, extraction_status, extraction_confidence, is_demo) VALUES
 ('00000000-0000-4000-8000-000000000001','[DEMO] Placeholder study: stainless steel exposure in solar salt','Demo Author A; Demo Author B',2020,'Demo Journal (not a real publication)','demo','extracted',0.5,true),
 ('00000000-0000-4000-8000-000000000002','[DEMO] Placeholder study: nickel alloy exposure in solar salt','Demo Author C',2021,'Demo Journal (not a real publication)','demo','pending',NULL,true);

INSERT INTO public.corrosion_observations (literature_record_id, material_name, salt_composition, temperature_c, exposure_time, exposure_time_unit, corrosion_rate, corrosion_rate_unit, test_method, notes, is_demo) VALUES
 ('00000000-0000-4000-8000-000000000001','316L stainless steel','60 wt% NaNO₃ / 40 wt% KNO₃',565,1000,'h',10,'µm/yr','Static immersion (demo)','DEMO VALUE — illustrative only, not a measured result',true),
 ('00000000-0000-4000-8000-000000000002','Inconel 625','60 wt% NaNO₃ / 40 wt% KNO₃',565,1000,'h',5,'µm/yr','Static immersion (demo)','DEMO VALUE — illustrative only, not a measured result',true);