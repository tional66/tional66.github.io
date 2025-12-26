document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input[name]");

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const targetKey = input.dataset.target;
      const placeholder = document.querySelector(
        `[data-placeholder="${targetKey}"]`
      );

      if (!placeholder) return;

      placeholder.textContent = input.value || placeholder.dataset.default;
    });
  });
});
