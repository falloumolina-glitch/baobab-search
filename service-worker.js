<script>
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => {
      console.log("Baobab Search installé avec succès");
    })
    .catch((error) => {
      console.log("Erreur d'installation :", error);
    });
}
</script>
