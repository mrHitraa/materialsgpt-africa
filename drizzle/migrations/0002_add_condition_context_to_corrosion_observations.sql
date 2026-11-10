ALTER TABLE public.corrosion_observations
  ADD COLUMN material_form text CHECK (
    material_form IS NULL OR length(btrim(material_form)) BETWEEN 2 AND 200
  ),
  ADD COLUMN manufacturing_route text CHECK (
    manufacturing_route IS NULL OR length(btrim(manufacturing_route)) BETWEEN 2 AND 200
  ),
  ADD COLUMN atmosphere text CHECK (
    atmosphere IS NULL OR length(btrim(atmosphere)) BETWEEN 2 AND 200
  );