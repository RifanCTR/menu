
document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const toolItems = document.querySelectorAll(".tool-item");
  const toolCards = document.querySelectorAll(".tool-card");
  const emptyMessage = document.getElementById("emptyMessage");

  // ERUDA BOOKMARKLET
  const erudaBookmarklet = `javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/eruda';s.onload=function(){if(window.eruda){window.eruda.init();}};document.body.appendChild(s);})();`;

  const erudaCode = document.getElementById("erudaCode");

  if (erudaCode) {
    erudaCode.textContent = erudaBookmarklet;
  }

  // BUKA DAN TUTUP DETAIL PANEL
  toolCards.forEach((card) => {

    card.addEventListener("click", () => {

      const currentItem = card.closest(".tool-item");
      const currentPanel = currentItem.querySelector(".detail-panel");

      const isAlreadyOpen = currentPanel.classList.contains("show");

      // Tutup semua panel
      document.querySelectorAll(".detail-panel").forEach((panel) => {
        panel.classList.remove("show");
      });

      // Hapus status aktif semua card
      toolCards.forEach((item) => {
        item.classList.remove("active");
      });

      // Buka panel yang dipilih
      if (!isAlreadyOpen) {
        currentPanel.classList.add("show");
        card.classList.add("active");
      }

    });

  });

  // SEARCH TOOLS
  searchInput.addEventListener("input", () => {

    const keyword = searchInput.value
      .toLowerCase()
      .trim();

    let visibleCount = 0;

    toolItems.forEach((item) => {

      const card = item.querySelector(".tool-card");

      const title = card.textContent.toLowerCase();
      const keywords = (
        card.dataset.search || ""
      ).toLowerCase();

      const matched =
        title.includes(keyword) ||
        keywords.includes(keyword);

      item.style.display = matched ? "block" : "none";

      if (matched) {
        visibleCount++;
      } else {
        item.querySelector(".detail-panel").classList.remove("show");
        card.classList.remove("active");
      }

    });

    emptyMessage.style.display =
      visibleCount === 0 ? "block" : "none";

  });

  // COPY TEXT / CODE
  document.querySelectorAll(".copy-btn").forEach((button) => {

    button.addEventListener("click", async (event) => {

      event.stopPropagation();

      const targetId = button.dataset.copy;
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      const text = targetElement.textContent;

      try {

        await navigator.clipboard.writeText(text);

      } catch (error) {

        // Fallback untuk browser yang tidak mendukung Clipboard API
        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand("copy");

        textarea.remove();

      }

      const originalText = button.textContent;

      button.textContent = "Copied!";

      setTimeout(() => {
        button.textContent = originalText;
      }, 1200);

    });

  });

});
fetch("script.txt")
  .then(response => {
    if (!response.ok) throw new Error("File tidak ditemukan");
    return response.text();
  })
  .then(code => {
    document.getElementById("auPassCode").textContent = code;
  })
  .catch(() => {
    document.getElementById("auPassCode").textContent =
      "Gagal memuat JavaScript.";
  });