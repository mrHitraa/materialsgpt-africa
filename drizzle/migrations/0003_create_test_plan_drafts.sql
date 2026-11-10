CREATE TABLE public.test_plan_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 3 AND 200),
  candidate_materials text NOT NULL CHECK (length(btrim(candidate_materials)) BETWEEN 1 AND 1000),
  salt_composition text NOT NULL CHECK (length(btrim(salt_composition)) BETWEEN 1 AND 500),
  target_temperature text NOT NULL CHECK (length(btrim(target_temperature)) BETWEEN 1 AND 100),
  lab_capabilities text NOT NULL CHECK (length(btrim(lab_capabilities)) BETWEEN 1 AND 2000),
  coupon_specifications text NOT NULL CHECK (length(btrim(coupon_specifications)) BETWEEN 1 AND 1500),
  test_mode text NOT NULL CHECK (length(btrim(test_mode)) BETWEEN 1 AND 1000),
  atmosphere text NOT NULL CHECK (length(btrim(atmosphere)) BETWEEN 1 AND 500),
  exposure_duration text NOT NULL CHECK (length(btrim(exposure_duration)) BETWEEN 1 AND 500),
  replicate_count text NOT NULL CHECK (length(btrim(replicate_count)) BETWEEN 1 AND 300),
  controls text NOT NULL CHECK (length(btrim(controls)) BETWEEN 1 AND 1000),
  characterization_methods text NOT NULL CHECK (length(btrim(characterization_methods)) BETWEEN 1 AND 1500),
  safety_review text NOT NULL CHECK (length(btrim(safety_review)) BETWEEN 1 AND 1500),
  open_questions text NOT NULL CHECK (length(btrim(open_questions)) BETWEEN 1 AND 2000),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready_for_review', 'approved')),
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT approved_plan_has_no_tbd CHECK (
    status <> 'approved' OR (
      lower(concat_ws(' ', title, candidate_materials, salt_composition, target_temperature,
        lab_capabilities, coupon_specifications, test_mode, atmosphere, exposure_duration,
        replicate_count, controls, characterization_methods, safety_review, open_questions))
        NOT LIKE '%tbd%'
    )
  )
);

CREATE INDEX test_plan_drafts_created_at_idx ON public.test_plan_drafts(created_at DESC);
CREATE TRIGGER test_plan_drafts_updated_at
  BEFORE UPDATE ON public.test_plan_drafts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT, INSERT, UPDATE ON public.test_plan_drafts TO anon, authenticated;
GRANT ALL ON public.test_plan_drafts TO service_role;

ALTER TABLE public.test_plan_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read test plan drafts"
  ON public.test_plan_drafts FOR SELECT USING (true);
CREATE POLICY "Public add test plan drafts"
  ON public.test_plan_drafts FOR INSERT WITH CHECK (status = 'draft' AND is_demo = false);
CREATE POLICY "Public update test plan drafts"
  ON public.test_plan_drafts FOR UPDATE
  USING (status = 'draft' AND is_demo = false)
  WITH CHECK (status = 'draft' AND is_demo = false);