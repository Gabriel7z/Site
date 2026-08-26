(function () {
  // Única URL da API na internet. Quando o dono criar o Render DELE, troque só esta linha.
  const RENDER_API_URL = "https://ceme-checkout.onrender.com";

  const host = typeof location !== "undefined" ? location.hostname : "";
  const port = typeof location !== "undefined" ? location.port : "";
  const local = host === "localhost" || host === "127.0.0.1";
  const staticPreview = port === "8080";
  window.CEME_CHECKOUT = {
    apiUrl: local
      ? staticPreview
        ? `${location.protocol}//${host}:3001`
        : location.origin
      : RENDER_API_URL,
    mpPublicKey: "",
    maxInstallments: 3,
    freeShippingFrom: 360,
  };
})();
