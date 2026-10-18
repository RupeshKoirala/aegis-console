// Done for you: the French translations, as `ng extract-i18n --format json` + a translator would produce them.
// Keys are the message IDs. Placeholders ({$INTERPOLATION}, {$name}, {$ICU}, VAR_PLURAL…) must be kept as-is.
export const FR: Record<string, string> = {
  'alerts.title': 'Alertes ouvertes',
  'alerts.count': '{VAR_PLURAL, plural, =0 {Aucune alerte ouverte} =1 {Une alerte ouverte} other {{INTERPOLATION} alertes ouvertes}}',
  'alerts.worst': 'Gravité maximale : {$ICU}',
  // A NESTED ICU gets an auto-generated ID (a hash of its English text). Change the English and this ID changes.
  '6667639775233959310': '{VAR_SELECT, select, CRITICAL {critique} HIGH {élevée} other {normale}}',
  'alerts.search': 'Rechercher des alertes',
  'alerts.greeting': 'Bonjour {$INTERPOLATION}, voici votre file.',
  'alert.status.new': 'Nouvelle',
  'alert.status.triaged': 'Qualifiée',
  'alert.status.resolved': 'Résolue',
  'alert.assigned': 'Assignée à {$name}',
};
