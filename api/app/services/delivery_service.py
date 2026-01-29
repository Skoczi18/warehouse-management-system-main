from datetime import datetime

from app.models.delivery import Delivery, DeliveryStatus
from app.models.delivery_item import DeliveryItem


class DeliveryService:
    def __init__(self, deliveries_repo, products_repo, locations_repo, suppliers_repo, inventory_service, audit_service):
        self.deliveries_repo = deliveries_repo
        self.products_repo = products_repo
        self.locations_repo = locations_repo
        self.suppliers_repo = suppliers_repo
        self.inventory_service = inventory_service
        self.audit_service = audit_service

    def create_delivery(self, payload, user_id: int):
        supplier = self.suppliers_repo.by_id(payload.supplier_id)
        if not supplier:
            raise ValueError("Supplier not found")

        if not payload.items:
            raise ValueError("Delivery items required")

        delivery = Delivery(
            document_no=payload.document_no,
            supplier_id=payload.supplier_id,
            status=DeliveryStatus.W_TRAKCIE,
            created_by=user_id,
            approved_by=None,
            approved_at=None,
        )
        self.deliveries_repo.create(delivery)
        self.deliveries_repo.flush()

        for item in payload.items:
            if item.qty <= 0:
                raise ValueError("Item quantity must be positive")
            product = self.products_repo.by_sku(item.sku)
            if not product:
                raise ValueError(f"Product not found for SKU: {item.sku}")

            self.deliveries_repo.add_item(
                DeliveryItem(
                    delivery_id=delivery.id,
                    product_id=product.id,
                    qty=item.qty,
                )
            )

        self.audit_service.log(
            "CREATE_DELIVERY",
            user_id,
            entity="delivery",
            entity_id=delivery.id,
            details={"document_no": payload.document_no},
        )
        return delivery

    def putaway_delivery(self, delivery, items, user_id: int):
        if delivery.status == DeliveryStatus.ANULOWANA:
            raise ValueError("Delivery canceled")
        if delivery.status == DeliveryStatus.ZATWIERDZONA:
            raise ValueError("Delivery already stocked")

        for item in items:
            if item.qty <= 0:
                raise ValueError("Item quantity must be positive")
            product = self.products_repo.by_sku(item.sku)
            if not product:
                raise ValueError(f"Product not found for SKU: {item.sku}")
            locations = (
                self.locations_repo.by_code_in_warehouse(item.location_code, item.warehouse_id)
                if item.warehouse_id
                else self.locations_repo.by_code(item.location_code)
            )
            if not locations:
                raise ValueError(f"Location not found for code: {item.location_code}")
            if len(locations) > 1:
                raise ValueError(f"Location code ambiguous: {item.location_code}")
            location = locations[0]
            if location.is_blocked:
                raise ValueError(f"Location blocked: {item.location_code}")

            self.inventory_service.increase_stock(product.id, location.id, item.qty)

        delivery.status = DeliveryStatus.ZATWIERDZONA
        delivery.approved_by = user_id
        delivery.approved_at = datetime.utcnow()
        self.audit_service.log(
            "PUTAWAY_DELIVERY",
            user_id,
            entity="delivery",
            entity_id=delivery.id,
        )
        return delivery

    def cancel_delivery(self, delivery, user_id: int):
        if delivery.status == DeliveryStatus.ANULOWANA:
            raise ValueError("Delivery already canceled")

        delivery.status = DeliveryStatus.ANULOWANA
        self.audit_service.log(
            "CANCEL_DELIVERY",
            user_id,
            entity="delivery",
            entity_id=delivery.id,
        )
        return delivery
