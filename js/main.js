function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const textElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, span, li, a"
  );

  textElements.forEach((element) => {
    if (element.getAttribute("data-id")) {
      const id = element.getAttribute("data-id");
      element.setAttribute("data-id", id);

      const savedContent = localStorage.getItem(id);
      if (savedContent) {
        element.innerHTML = savedContent;
      }

      element.setAttribute("contenteditable", "true");

      const saveContent = () => {
        localStorage.setItem(id, element.innerHTML);
        createRipple(element);
      };

      const debouncedSaveContent = debounce(saveContent, 1000);

      element.addEventListener("input", debouncedSaveContent);

      element.addEventListener("blur", () => {
        saveContent();
      });

      element.classList.add("ripple");
    }
  });
});

function createRipple(element) {
  const ripple = document.createElement("div");
  ripple.className = "ripple-effect";
  ripple.style.left = "50%";
  ripple.style.top = "50%";
  element.appendChild(ripple);

  ripple.addEventListener("animationend", () => {
    ripple.remove();
  });
}

function removeRippleEffects() {
  document.querySelectorAll(".ripple-effect").forEach((ripple) => {
    ripple.remove();
  });
}

function downloadPDF() {
  removeRippleEffects();

  const opt = {
    filename: "resume.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, windowWidth: 794, width: 794, height: 2200 },
  };

  html2pdf().set(opt).from(document.body).save();
}

document
  .querySelector("#downloadButton")
  .addEventListener("click", function () {
    downloadPDF();
  });
