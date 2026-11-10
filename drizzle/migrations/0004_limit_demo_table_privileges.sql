REVOKE ALL PRIVILEGES ON public.literature_records, public.corrosion_observations, public.candidate_materials, public.benchmark_results, public.prediction_records, public.test_plan_drafts FROM anon, authenticated;
GRANT SELECT, INSERT ON public.literature_records, public.corrosion_observations, public.prediction_records TO anon, authenticated;
GRANT SELECT ON public.candidate_materials, public.benchmark_results TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.test_plan_drafts TO anon, authenticated;
GRANT ALL ON public.literature_records, public.corrosion_observations, public.candidate_materials, public.benchmark_results, public.prediction_records, public.test_plan_drafts TO service_role;