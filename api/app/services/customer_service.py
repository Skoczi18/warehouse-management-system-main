from app.models.customer import Customer


class CustomerService:
    def __init__(self, repo):
        self.repo = repo

    def create(self, payload):
        customer = Customer(
            name=payload.name,
            contact_data=payload.contact_data,
        )
        return self.repo.create(customer)

    def update(self, customer: Customer, payload):
        if payload.name is not None:
            customer.name = payload.name
        if payload.contact_data is not None:
            customer.contact_data = payload.contact_data
        return customer

    def delete(self, customer: Customer):
        self.repo.delete(customer)
