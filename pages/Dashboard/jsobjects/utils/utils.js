export default {
  /** вспомогалка: вытаскиваем массив e-mail админов из getAdmins */
  adminList() {
    // Если запрос ещё не выполнен, вернётся []
    return (getAdmins?.data || []).map((row) =>
      String(row.email || row.login || "").toLowerCase()
    );
  },

  /** true, если пользователь есть в админ-листе */
  isAdmin(email) {
    return this.adminList().includes(String(email).toLowerCase());
  },

  /** partner_id для текущего пользователя */
  partnerId(email) {
    const row = getPartners.data.find(
      (p) => String(p.email).toLowerCase() === String(email).toLowerCase()
    );
    return row?.partner_id || null;
  },

  /** фильтр для бонусов */
  bonusFilter(email) {
    if (this.isAdmin(email)) return {}; // админ видит всё

    const pid = this.partnerId(email);
    if (!pid)
      return { condition: "AND", children: [] }; // ничего не найдено

    return {
      condition: "AND",
      children: [
        { column: "partner_id", operator: "EQ", value: pid },
      ],
    };
  },
};