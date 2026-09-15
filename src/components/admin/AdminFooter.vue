<template>
  <footer class="admin-footer">
    <span>© 2026 CampusSwap Admin Panel</span>
    <span>v2.0.0</span>
  </footer>
</template>

<style scoped>
.admin-footer {
  background: #1a1a2e;
  color: rgba(255,255,255,0.4);
  padding: 12px 32px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

@media (max-width: 768px) {
  .admin-footer {
    padding: 10px 16px;
    font-size: 11px;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
}
</style>
