(function () {
  const host = typeof location !== "undefined" ? location.hostname : "";
  const port = typeof location !== "undefined" ? location.port : "";
  const local = host === "localhost" || host === "127.0.0.1";
  const sameOriginApi = port === "3001" || port === "80" || port === "";
  window.CEME_CHECKOUT = {
    // Local: loja e API juntas em :3001 (ou API em :3001 se o HTML estiver noutra porta).
    // GitHub Pages é estático — usa a API publicada (Render).
    // Se a própria API servir o HTML (Render/Railway), usa a mesma origem.
    apiUrl: local
      ? sameOriginApi
        ? location.origin
        : `${location.protocol}//${host}:3001`
      : host.endsWith("github.io")
        ? "https://ceme-checkout.onrender.com"
        : location.origin,
    mpPublicKey: "",
    maxInstallments: 3,
    freeShippingFrom: 0,
  };
})();
