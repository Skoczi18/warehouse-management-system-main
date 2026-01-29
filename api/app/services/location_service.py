from app.models.location import Location


class LocationService:
    def __init__(self, locations_repo, audit_service):
        self.locations_repo = locations_repo
        self.audit_service = audit_service

    def list_by_warehouse(self, warehouse_id: int):
        return self.locations_repo.list_by_warehouse(warehouse_id)

    def get(self, location_id: int):
        return self.locations_repo.by_id(location_id)

    def set_blocked(self, location: Location, is_blocked: bool, user_id: int):
        location.is_blocked = is_blocked
        self.locations_repo.save(location)
        self.audit_service.log(
            "BLOCK_LOCATION",
            user_id,
            entity="location",
            entity_id=location.id,
            details={"is_blocked": is_blocked},
        )
        return location

    def create(self, payload, user_id: int):
        location = Location(
            warehouse_id=payload.warehouse_id,
            code=payload.code,
            description=payload.description,
            kind=payload.kind,
            geometry_json=payload.geometry_json,
            is_blocked=payload.is_blocked,
        )
        self.locations_repo.save(location)
        self.locations_repo.flush()
        self.audit_service.log(
            "CREATE_LOCATION",
            user_id,
            entity="location",
            entity_id=location.id,
            details={"warehouse_id": payload.warehouse_id, "code": payload.code},
        )
        return location

    def update(self, location: Location, payload, user_id: int):
        if payload.warehouse_id is not None:
            location.warehouse_id = payload.warehouse_id
        if payload.code is not None:
            location.code = payload.code
        if payload.description is not None:
            location.description = payload.description
        if payload.kind is not None:
            location.kind = payload.kind
        if payload.geometry_json is not None:
            location.geometry_json = payload.geometry_json
        if payload.is_blocked is not None:
            location.is_blocked = payload.is_blocked
        self.locations_repo.save(location)
        self.audit_service.log(
            "UPDATE_LOCATION",
            user_id,
            entity="location",
            entity_id=location.id,
            details={"warehouse_id": location.warehouse_id, "code": location.code},
        )
        return location

    def delete(self, location: Location, user_id: int):
        self.audit_service.log(
            "DELETE_LOCATION",
            user_id,
            entity="location",
            entity_id=location.id,
            details={"warehouse_id": location.warehouse_id, "code": location.code},
        )
        self.locations_repo.delete(location)
