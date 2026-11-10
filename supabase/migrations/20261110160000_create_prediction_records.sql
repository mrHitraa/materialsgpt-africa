CREATE TABLE public.prediction_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name text NOT NULL CHECK (length(btrim(model_name)) BETWEEN 2 AND 200),
  model_version text NOT NULL CHECK (length(btrim(model_version)) BETWEEN 1 AND 100),
  model_reference_url text NOT NULL CHECK (
    length(model_reference_url) <= 1000 AND model_reference_url ~* '^https?://[^[:space:]]+$'
  ),
  material_name text NOT NULL CHECK (length(btrim(material_name)) BETWEEN 2 AND 200),
  salt_composition text NOT NULL CHECK (length(btrim(salt_composition)) BETWEEN 2 AND 500),
  temperature_c numeric NOT NULL CHECK (temperature_c BETWEEN -273.15 AND 2000),
  model_input_summary text NOT NULL CHECK (length(btrim(model_input_summary)) BETWEEN 3 AND 2000),
  failure_criterion text NOT NULL CHECK (length(btrim(failure_criterion)) BETWEEN 3 AND 1000),
  metric_name text NOT NULL CHECK (length(btrim(metric_name)) BETWEEN 2 AND 100),
  predicted_value numeric NOT NULL CHECK (predicted_value >= 0),
  metric_unit text NOT NULL CHECK (length(btrim(metric_unit)) BETWEEN 1 AND 50),
  uncertainty text CHECK (
    uncertainty IS NULL OR length(btrim(uncertainty)) BETWEEN 1 AND 1000
  ),
  assumptions text NOT NULL CHECK (length(btrim(assumptions)) BETWEEN 3 AND 3000),
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX prediction_records_created_at_idx ON public.prediction_records(created_at DESC);
CREATE INDEX prediction_records_material_idx ON public.prediction_records(material_name);

GRANT SELECT, INSERT ON public.prediction_records TO anon, authenticated;
GRANT ALL ON public.prediction_records TO service_role;

ALTER TABLE public.prediction_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read prediction records"
  ON public.prediction_records FOR SELECT USING (true);
CREATE POLICY "Public add non-demo prediction records"
  ON public.prediction_records FOR INSERT
  WITH CHECK (is_demo = false);
