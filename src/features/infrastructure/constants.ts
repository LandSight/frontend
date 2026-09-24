export const infrastructureCategoryColors: Record<string, string> = {
  hospital: '#e53935',
  grocery: '#fb8c00',
  bus_stop: '#fdd835',
  railway_station: '#8d6e63',
  police: '#3949ab',
  fire_station: '#d81b60',
  pharmacy: '#00acc1',
  water_source: '#29b6f6',
  water_body: '#1e88e5',
  forest: '#43a047',
  protected_area: '#00897b',
  power_line: '#ffb300',
  road_accessibility: '#546e7a',
  geographic_position: '#6d4c41',
};

export const getCategoryColor = (category: string): string =>
  infrastructureCategoryColors[category] ?? '#607d8b';
