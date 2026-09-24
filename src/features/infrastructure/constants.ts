import type { ElementType } from 'react';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EmergencyIcon from '@mui/icons-material/Emergency';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrainIcon from '@mui/icons-material/Train';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

export const infrastructureCategoryColors: Record<string, string> = {
  hospital: '#e53935',
  grocery: '#ca6f00',
  bus_stop: '#9a8216',
  railway_station: '#99126c',
  police: '#011ccc',
  fire_station: '#d81b60',
  pharmacy: '#3c9245',
  water_source: '#2798cc',
  water_body: '#1e88e5',
  forest: '#43a047',
  protected_area: '#00897b',
  power_line: '#ffb300',
  road_accessibility: '#546e7a',
  geographic_position: '#6d4c41',
};

export const infrastructurePointCategoryIcons: Record<string, ElementType> = {
  hospital: EmergencyIcon,
  grocery: ShoppingCartIcon,
  bus_stop: DirectionsBusIcon,
  railway_station: TrainIcon,
  police: LocalPoliceIcon,
  fire_station: LocalFireDepartmentIcon,
  pharmacy: LocalHospitalIcon,
  water_source: WaterDropIcon,
  geographic_position: GpsFixedIcon,
};

export const getCategoryColor = (category: string): string =>
  infrastructureCategoryColors[category] ?? '#607d8b';

export const getCategoryIcon = (category: string): ElementType | null =>
  infrastructurePointCategoryIcons[category] ?? null;
