(function () {
  const host = typeof location !== "undefined" ? location.hostname : "";
  const port = typeof location !== "undefined" ? location.port : "";
  const local = host === "localhost" || host === "127.0.0.1";
  const sameOriginApi = port === "3001" || port === "80" || port === "";
  window.CEME_CHECKOUT = {
    // No seu computador: a loja e a API sobem juntas em :3001.
    // Se o site estiver em outra porta (ex.: 8080), chama a API em :3001.
    // Em produção fica vazio até publicar a API e colar a URL aqui.
    apiUrl: !local
      ? ""
      : sameOriginApi
        ? location.origin
        : `${location.protocol}//${host}:3001`,
    mpPublicKey: "",
    maxInstallments: 3,
    freeShippingFrom: 0,
  };
})();
