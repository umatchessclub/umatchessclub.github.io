document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  const links = document.querySelector(".navlinks");

  if (menu && links) {
    menu.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      const month = button.dataset.filter;
      document.querySelectorAll("[data-month]").forEach((card) => {
        card.hidden = !(month === "All" || card.dataset.month === month);
      });
    });
  });

  const meetingDates = [
    "2026-10-16", "2026-10-17", "2026-10-23", "2026-10-24",
    "2026-10-30", "2026-10-31", "2026-11-06", "2026-11-07",
    "2026-11-13", "2026-11-14", "2026-11-20", "2026-11-21",
    "2026-11-27", "2026-11-28", "2026-12-04", "2026-12-05",
    "2026-12-11", "2026-12-12", "2026-12-18", "2026-12-19",
  ];
  const countdowns = document.querySelectorAll("[data-meeting-countdown]");
  const updateMeetingCountdown = () => {
    const todayParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Accra",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const value = (type) => todayParts.find((part) => part.type === type)?.value;
    const today = `${value("year")}-${value("month")}-${value("day")}`;
    const target = meetingDates.find((date) => date >= today);

    countdowns.forEach((countdown) => {
      const heading = countdown.querySelector("h2");
      const daysValue = countdown.querySelector("[data-meeting-days]");
      const daysLabel = countdown.querySelector("[data-meeting-label]");
      if (!target) {
        heading.textContent = "The published programme has ended";
        daysValue.textContent = "—";
        daysLabel.textContent = "check back for the next programme";
        return;
      }

      const targetDate = new Date(`${target}T00:00:00Z`);
      const todayDate = new Date(`${today}T00:00:00Z`);
      const daysRemaining = Math.max(
        0,
        Math.round((targetDate - todayDate) / 86_400_000),
      );
      heading.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(targetDate);
      daysValue.textContent = String(daysRemaining);
      daysLabel.textContent = daysRemaining === 0
        ? "meeting date is today"
        : daysRemaining === 1
          ? "day to meeting date"
          : "days to meeting date";
    });
  };

  if (countdowns.length) {
    updateMeetingCountdown();
    window.setInterval(updateMeetingCountdown, 60_000);
  }
});
