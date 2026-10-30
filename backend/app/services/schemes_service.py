import json
import os
from typing import List, Dict, Any, Optional

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "schemes.json")

class SchemesService:
    _cached_schemes: Optional[List[Dict[str, Any]]] = None

    @classmethod
    def load_schemes(cls) -> List[Dict[str, Any]]:
        if cls._cached_schemes is None:
            if not os.path.exists(DATA_FILE):
                raise FileNotFoundError(f"Schemes dataset not found at {DATA_FILE}")
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                cls._cached_schemes = json.load(f)
        return cls._cached_schemes

    @classmethod
    def get_scheme_by_id(cls, scheme_id: str) -> Optional[Dict[str, Any]]:
        schemes = cls.load_schemes()
        for s in schemes:
            if s["id"] == scheme_id:
                return s
        return None

