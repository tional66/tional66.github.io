/**
 * ============================================================
 * MOTEUR DE PRÉVISUALISATION DÉCLARATIF – DOCUMENTS JURIDIQUES
 * ============================================================
 *
 * OBJECTIF
 * --------
 * Fournir un moteur JavaScript générique qui :
 * - lit les champs du formulaire
 * - remplit automatiquement les textes à trous
 * - affiche / masque des phrases ou blocs entiers
 * - permet l’imbrication des conditions
 *
 * Le JS NE CONTIENT AUCUNE LOGIQUE MÉTIER.
 * Toute la logique est portée par le HTML via data-*.
 *
 * ------------------------------------------------------------
 * CONVENTIONS HTML
 * ------------------------------------------------------------
 *
 * 1. VALEURS SIMPLES
 *    <input id="champ">
 *    <span data-bind="champ" data-default="..."></span>
 *
 * 2. CONDITIONS
 *    <div data-if="champ=valeur">...</div>
 *
 * 3. CONDITIONS BOOLÉENNES (checkbox)
 *    data-if="champ=true" / data-if="champ=false"
 *
 * 4. CONDITIONS IMBRIQUÉES
 *    → supportées nativement par le DOM
 *
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  /**
   * ------------------------------------------------------------
   * SÉLECTION DES CHAMPS DU FORMULAIRE
   * ------------------------------------------------------------
   * Tous les champs standards sont pris en compte.
   * Aucun besoin de les déclarer explicitement.
   */
  const fields = document.querySelectorAll(
    "input, textarea, select"
  );

  /**
   * ------------------------------------------------------------
   * RÉCUPÉRATION D’UNE VALEUR LOGIQUE DE CHAMP
   * ------------------------------------------------------------
   * - checkbox → "true" / "false"
   * - autres champs → valeur brute
   */
  function getFieldValue(field) {
    if (field.type === "checkbox") {
      return field.checked.toString();
    }
    return field.value;
  }

  /**
   * ------------------------------------------------------------
   * MISE À JOUR DES TEXTES À TROUS (data-bind)
   * ------------------------------------------------------------
   * Associe automatiquement :
   *   champ.id  → data-bind
   */
  function updateBindings() {

    document.querySelectorAll("[data-bind]").forEach(element => {

      const fieldId = element.dataset.bind;
      const field = document.getElementById(fieldId);

      // Sécurité : champ inexistant
      if (!field) return;

      const value = field.value.trim();
      const defaultValue = element.dataset.default || "";

      element.textContent = value !== ""
        ? value
        : defaultValue;
    });
  }

  /**
   * ------------------------------------------------------------
   * ÉVALUATION DES CONDITIONS (data-if)
   * ------------------------------------------------------------
   * Syntaxe supportée :
   *   data-if="champ=valeur"
   *
   * Exemples :
   *   data-if="duree_type=determinee"
   *   data-if="ressources=true"
   */
  function updateConditions() {

    document.querySelectorAll("[data-if]").forEach(element => {

      const rule = element.dataset.if;

      // Sécurité : règle mal formée
      if (!rule.includes("=")) return;

      const [fieldId, expectedValue] = rule.split("=");
      const field = document.getElementById(fieldId);

      // Sécurité : champ inexistant
      if (!field) return;

      const actualValue = getFieldValue(field);

      // Application de la condition
      if (actualValue === expectedValue) {
        element.style.display = "";
      } else {
        element.style.display = "none";
      }
    });
  }

  /**
   * ------------------------------------------------------------
   * RAFRAÎCHISSEMENT GLOBAL
   * ------------------------------------------------------------
   * Appelé :
   * - au chargement
   * - à chaque modification d’un champ
   */
  function updateAll() {
    updateBindings();
    updateConditions();
  }

  /**
   * ------------------------------------------------------------
   * INITIALISATION
   * ------------------------------------------------------------
   * Permet de :
   * - remplir la preview avec les valeurs par défaut
   * - restaurer un état si le navigateur a conservé des champs
   */
  updateAll();

  /**
   * ------------------------------------------------------------
   * ÉCOUTE DES MODIFICATIONS UTILISATEUR
   * ------------------------------------------------------------
   * - input → texte, textarea
   * - change → select, checkbox
   */
  fields.forEach(field => {
    field.addEventListener("input", updateAll);
    field.addEventListener("change", updateAll);
  });

});
