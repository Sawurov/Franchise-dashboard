export default {
  /** → [{ x:'2024-03', y:300000 }]  или  [{ x:'Partner A', y:450000 }] */
  chartData() {
    const rows = Array.isArray(getBonusesByPartner.data)
      ? getBonusesByPartner.data
      : [];

    // ---------- Admin: группируем по партнёру ----------
    if (utils.isAdmin(appsmith.user.email)) {
      const byPartner = {};
      rows.forEach(r => {
        const partner = r.partner_name      // <-- своё поле с названием партнёра
                     || r.partner           // запасной вариант
                     || r.partner_id;       // числовой id — тоже сойдёт
        if (!partner) return;

        const bonus = Number(String(r.bonus_sum) // <-- поле с суммой бонуса
                             .replace(/\D/g, ""));
        byPartner[partner] = (byPartner[partner] || 0) + bonus;
      });

      return Object.entries(byPartner)        // → [{x:'Partner 1', y:123000}, …]
        .map(([name, total]) => ({ x: name, y: total }));
    }

    // ---------- Партнёр: группируем по месяцам ----------
    const pid   = utils.partnerId(appsmith.user.email);
    const byMon = {};
    rows
      .filter(r => r.partner_id == pid)       // только его строки
      .forEach(r => {
        const month = String(r.period || r.date)    // поле с датой
                        .slice(0, 7);               // "YYYY-MM"
        if (!month) return;

        const bonus = Number(String(r.bonus_sum).replace(/\D/g, ""));
        byMon[month] = (byMon[month] || 0) + bonus;
      });

    return Object.entries(byMon)
      .map(([m, total]) => ({ x: m, y: total }))
      .sort((a, b) => new Date(a.x) - new Date(b.x));   // по времени
  }
};