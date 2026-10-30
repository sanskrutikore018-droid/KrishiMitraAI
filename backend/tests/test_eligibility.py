import pytest
from app.models.schemas import FarmerProfile
from app.services.schemes_service import SchemesService
from app.services.eligibility import (
    evaluate_pm_kisan,
    evaluate_pmfby,
    evaluate_demo_micro_irrigation,
    evaluate_demo_agri_equipment,
    evaluate_demo_soil_improvement,
    evaluate_all_schemes
)

@pytest.fixture
def schemes_map():
    schemes = SchemesService.load_schemes()
    return {s["id"]: s for s in schemes}

def test_pm_kisan_eligible_owner(schemes_map):
    profile = FarmerProfile(
        district="Belagavi",
        land_area_acres=3.5,
        crops=["paddy"],
        ownership_type="owner",
        is_income_tax_payer=False
    )
    result = evaluate_pm_kisan(schemes_map["pm-kisan"], profile)
    assert result.overall_status == "eligible"
    assert result.scheme_id == "pm-kisan"
    assert len(result.missing_fields_for_scheme) == 0

def test_pm_kisan_tenant_ineligible(schemes_map):
    profile = FarmerProfile(
        district="Mandya",
        land_area_acres=4.0,
        crops=["sugarcane"],
        ownership_type="tenant",
        is_income_tax_payer=False
    )
    result = evaluate_pm_kisan(schemes_map["pm-kisan"], profile)
    assert result.overall_status == "ineligible"
    assert any(r.rule_key == "ownership_type" and r.status == "not_satisfied" for r in result.rules_breakdown)

def test_pm_kisan_income_tax_payer_ineligible(schemes_map):
    profile = FarmerProfile(
        district="Shimoga",
        land_area_acres=2.0,
        crops=["arecanut"],
        ownership_type="owner",
        is_income_tax_payer=True
    )
    result = evaluate_pm_kisan(schemes_map["pm-kisan"], profile)
    assert result.overall_status == "ineligible"
    assert any(r.rule_key == "tax_exclusion" and r.status == "not_satisfied" for r in result.rules_breakdown)

def test_pm_kisan_missing_data_needs_more_info(schemes_map):
    profile = FarmerProfile(
        district="Dharwad",
        land_area_acres=None,
        ownership_type=None
    )
    result = evaluate_pm_kisan(schemes_map["pm-kisan"], profile)
    assert result.overall_status == "needs_more_info"
    assert "ownership_type" in result.missing_fields_for_scheme
    assert "land_area_acres" in result.missing_fields_for_scheme

def test_pmfby_tenant_with_notified_crop_eligible(schemes_map):
    # PMFBY explicitly covers tenants with notified crops
    profile = FarmerProfile(
        district="Raichur",
        land_area_acres=5.0,
        crops=["cotton"],
        ownership_type="tenant"
    )
    result = evaluate_pmfby(schemes_map["pmfby"], profile)
    assert result.overall_status == "eligible"
    assert any(r.rule_key == "crop_notified" and r.status == "satisfied" for r in result.rules_breakdown)
    assert any(r.rule_key == "ownership_type" and r.status == "satisfied" for r in result.rules_breakdown)

def test_pmfby_kannada_crop_name(schemes_map):
    # Kannada crop input 'ಭತ್ತ' should match canonical 'paddy'
    profile = FarmerProfile(
        district="Udupi",
        land_area_acres=2.0,
        crops=["ಭತ್ತ"],
        ownership_type="owner"
    )
    result = evaluate_pmfby(schemes_map["pmfby"], profile)
    assert result.overall_status == "eligible"

def test_pmfby_missing_crops_needs_more_info(schemes_map):
    profile = FarmerProfile(
        district="Mysuru",
        land_area_acres=3.0,
        crops=[],
        ownership_type="owner"
    )
    result = evaluate_pmfby(schemes_map["pmfby"], profile)
    assert result.overall_status == "needs_more_info"
    assert "crops" in result.missing_fields_for_scheme

def test_micro_irrigation_holding_and_source(schemes_map):
    # Small farmer with irrigation -> eligible
    profile = FarmerProfile(
        district="Haveri",
        land_area_acres=3.0,
        crops=["maize"],
        ownership_type="owner",
        has_irrigation=True
    )
    result = evaluate_demo_micro_irrigation(schemes_map["demo-micro-irrigation"], profile)
    assert result.overall_status == "eligible"
    assert result.is_demo is True
    assert result.watermark_notice is not None

    # Exceeding 12.5 acre cap -> ineligible
    large_profile = FarmerProfile(
        district="Haveri",
        land_area_acres=15.0,
        crops=["maize"],
        ownership_type="owner",
        has_irrigation=True
    )
    result_large = evaluate_demo_micro_irrigation(schemes_map["demo-micro-irrigation"], large_profile)
    assert result_large.overall_status == "ineligible"

    # No irrigation -> ineligible
    no_water_profile = FarmerProfile(
        district="Haveri",
        land_area_acres=4.0,
        crops=["maize"],
        ownership_type="owner",
        has_irrigation=False
    )
    result_no_water = evaluate_demo_micro_irrigation(schemes_map["demo-micro-irrigation"], no_water_profile)
    assert result_no_water.overall_status == "ineligible"

def test_farm_mechanization_equipment(schemes_map):
    # Owner with 4 acres -> eligible
    profile = FarmerProfile(
        district="Gadag",
        land_area_acres=4.0,
        crops=["groundnut"],
        ownership_type="owner"
    )
    result = evaluate_demo_agri_equipment(schemes_map["demo-agri-equipment"], profile)
    assert result.overall_status == "eligible"

    # Tenant -> ineligible for machinery title pledge
    tenant_profile = FarmerProfile(
        district="Gadag",
        land_area_acres=4.0,
        crops=["groundnut"],
        ownership_type="tenant"
    )
    assert evaluate_demo_agri_equipment(schemes_map["demo-agri-equipment"], tenant_profile).overall_status == "ineligible"

    # Sub-acre holding (< 1.0) -> ineligible
    tiny_profile = FarmerProfile(
        district="Gadag",
        land_area_acres=0.5,
        crops=["groundnut"],
        ownership_type="owner"
    )
    assert evaluate_demo_agri_equipment(schemes_map["demo-agri-equipment"], tiny_profile).overall_status == "ineligible"

def test_soil_improvement_open_access(schemes_map):
    # Open to both owners and tenants
    profile = FarmerProfile(
        district="Kolar",
        land_area_acres=2.5,
        crops=["tomato"],
        ownership_type="tenant"
    )
    result = evaluate_demo_soil_improvement(schemes_map["demo-soil-improvement"], profile)
    assert result.overall_status == "eligible"

def test_evaluate_all_schemes_robustness(schemes_map):
    # Empty profile must not raise exceptions and correctly tag all as needs_more_info
    empty_profile = FarmerProfile()
    all_schemes = list(schemes_map.values())
    evaluations = evaluate_all_schemes(all_schemes, empty_profile)
    assert len(evaluations) == 5
    for ev in evaluations:
        assert ev.overall_status in ["needs_more_info", "ineligible"]

