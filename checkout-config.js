(function () {
  const host = typeof location !== "undefined" ? location.hostname : "";
  const local = host === "localhost" || host === "127.0.0.1";
  window.CEME_CHECKOUT = {
    // Em localhost aponta para a API de teste (pasta server/, porta 3001).
    // Em produção fica vazio até publicar a API e colar a URL aqui.
    apiUrl: local ? `${location.protocol}//${host}:3001` : "",
    mpPublicKey: "",
    maxInstallments: 3,
    freeShippingFrom: 360,
  };
})();
