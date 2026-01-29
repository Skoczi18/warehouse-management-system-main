class AuditService:
    def __init__(self, repo):
        self.repo = repo

    def log(self, action, user_id=None, **kw):
        self.repo.log(action=action, user_id=user_id, **kw)
