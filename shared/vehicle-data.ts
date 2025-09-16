// Vehicle data service for cascading dropdowns
export interface VehicleData {
  vehicleTypes: string[];
  makes: { [vehicleType: string]: string[] };
  models: { [key: string]: string[] }; // key format: "vehicleType-make"
  productionRanges: { [key: string]: { startYear: number; endYear: number | null } }; // key format: "vehicleType-make-model"
}

// Static vehicle data for the application
export const vehicleData: VehicleData = {
  vehicleTypes: [
    'Cars & Trucks',
    'Motorcycles',
    'Heavy Vehicles',
    'Marine Vehicles'
  ],
  
  makes: {
    'Cars & Trucks': [
      'Honda',
      'Toyota',
      'Nissan',
      'Ford',
      'Hyundai',
      'Mercedes-Benz',
      'BMW',
      'Audi',
      'Volkswagen',
      'Mazda',
      'Chevrolet',
      'Kia',
      'Peugeot'
    ],
    'Motorcycles': [
      'Honda',
      'Yamaha',
      'Suzuki',
      'Kawasaki',
      'Bajaj',
      'TVS',
      'Royal Enfield',
      'KTM',
      'Ducati',
      'Harley-Davidson'
    ],
    'Heavy Vehicles': [
      'Mercedes-Benz',
      'Volvo',
      'MAN',
      'Scania',
      'DAF',
      'Iveco',
      'Isuzu',
      'Mitsubishi Fuso'
    ],
    'Marine Vehicles': [
      'Yamaha',
      'Mercury',
      'Honda',
      'Suzuki',
      'Johnson',
      'Evinrude',
      'Tohatsu'
    ]
  },
  
  models: {
    // Cars & Trucks - Honda
    'Cars & Trucks-Honda': [
      'Accord', 'Civic', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Ridgeline', 'Passport', 'Insight', 'Odyssey'
    ],
    // Cars & Trucks - Toyota
    'Cars & Trucks-Toyota': [
      'Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', '4Runner', 'Sienna', 'Avalon'
    ],
    // Cars & Trucks - Nissan
    'Cars & Trucks-Nissan': [
      'Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier', 'Titan', 'Versa', 'Murano', 'Armada', 'Leaf'
    ],
    // Cars & Trucks - Ford
    'Cars & Trucks-Ford': [
      'F-150', 'Escape', 'Explorer', 'Focus', 'Mustang', 'Edge', 'Expedition', 'Ranger', 'Fusion', 'Bronco'
    ],
    // Cars & Trucks - Hyundai
    'Cars & Trucks-Hyundai': [
      'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Palisade', 'Kona', 'Venue', 'Genesis', 'Veloster'
    ],
    // Cars & Trucks - Mercedes-Benz
    'Cars & Trucks-Mercedes-Benz': [
      'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'A-Class', 'CLA', 'GLA', 'G-Class'
    ],
    // Cars & Trucks - BMW
    'Cars & Trucks-BMW': [
      '3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7', '1 Series', 'X1', 'Z4', 'i3'
    ],
    
    // Motorcycles - Honda
    'Motorcycles-Honda': [
      'CBR600RR', 'CBR1000RR', 'CB650R', 'CB1000R', 'CRF450L', 'Gold Wing', 'Rebel 500', 'Africa Twin', 'CBR300R', 'Grom'
    ],
    // Motorcycles - Yamaha
    'Motorcycles-Yamaha': [
      'YZF-R1', 'YZF-R6', 'MT-07', 'MT-09', 'YZ450F', 'FJR1300', 'Bolt', 'Tenere 700', 'YZF-R3', 'VMAX'
    ],
    // Motorcycles - Suzuki
    'Motorcycles-Suzuki': [
      'GSX-R1000', 'GSX-R600', 'SV650', 'V-Strom 650', 'Hayabusa', 'Boulevard', 'DR-Z400SM', 'GSX-S750', 'Katana', 'RM-Z450'
    ],
    // Motorcycles - Kawasaki
    'Motorcycles-Kawasaki': [
      'Ninja ZX-10R', 'Ninja ZX-6R', 'Z900', 'Versys 650', 'KX450', 'Vulcan', 'Ninja 400', 'Z650', 'KLR650', 'Concours 14'
    ],
    
    // Heavy Vehicles - Mercedes-Benz
    'Heavy Vehicles-Mercedes-Benz': [
      'Actros', 'Antos', 'Arocs', 'Atego', 'Econic', 'Sprinter', 'Vito', 'Citan'
    ],
    // Heavy Vehicles - Volvo
    'Heavy Vehicles-Volvo': [
      'FH', 'FM', 'FE', 'FL', 'VNL', 'VNR', 'VHD', 'VAH'
    ],
    
    // Marine Vehicles - Yamaha
    'Marine Vehicles-Yamaha': [
      'F25', 'F40', 'F60', 'F90', 'F115', 'F150', 'F200', 'F250', 'F300', 'F350'
    ],
    // Marine Vehicles - Mercury
    'Marine Vehicles-Mercury': [
      'FourStroke 25', 'FourStroke 40', 'FourStroke 60', 'FourStroke 90', 'FourStroke 115', 'Verado 200', 'Verado 250', 'Verado 300'
    ]
  },

  // Production ranges for year-aware filtering
  productionRanges: {
    // Cars & Trucks - Honda
    'Cars & Trucks-Honda-Accord': { startYear: 1976, endYear: null },
    'Cars & Trucks-Honda-Civic': { startYear: 1972, endYear: null },
    'Cars & Trucks-Honda-CR-V': { startYear: 1995, endYear: null },
    'Cars & Trucks-Honda-Pilot': { startYear: 2003, endYear: null },
    'Cars & Trucks-Honda-Fit': { startYear: 2007, endYear: 2020 },
    'Cars & Trucks-Honda-HR-V': { startYear: 2016, endYear: null },
    'Cars & Trucks-Honda-Ridgeline': { startYear: 2006, endYear: null },
    'Cars & Trucks-Honda-Passport': { startYear: 2019, endYear: null },
    'Cars & Trucks-Honda-Insight': { startYear: 1999, endYear: null },
    'Cars & Trucks-Honda-Odyssey': { startYear: 1995, endYear: null },

    // Cars & Trucks - Toyota
    'Cars & Trucks-Toyota-Camry': { startYear: 1982, endYear: null },
    'Cars & Trucks-Toyota-Corolla': { startYear: 1966, endYear: null },
    'Cars & Trucks-Toyota-RAV4': { startYear: 1994, endYear: null },
    'Cars & Trucks-Toyota-Highlander': { startYear: 2001, endYear: null },
    'Cars & Trucks-Toyota-Prius': { startYear: 1997, endYear: null },
    'Cars & Trucks-Toyota-Tacoma': { startYear: 1995, endYear: null },
    'Cars & Trucks-Toyota-Tundra': { startYear: 2000, endYear: null },
    'Cars & Trucks-Toyota-4Runner': { startYear: 1984, endYear: null },
    'Cars & Trucks-Toyota-Sienna': { startYear: 1998, endYear: null },
    'Cars & Trucks-Toyota-Avalon': { startYear: 1995, endYear: 2022 },

    // Cars & Trucks - Ford
    'Cars & Trucks-Ford-F-150': { startYear: 1975, endYear: null },
    'Cars & Trucks-Ford-Escape': { startYear: 2001, endYear: null },
    'Cars & Trucks-Ford-Explorer': { startYear: 1991, endYear: null },
    'Cars & Trucks-Ford-Focus': { startYear: 1998, endYear: 2018 },
    'Cars & Trucks-Ford-Mustang': { startYear: 1964, endYear: null },
    'Cars & Trucks-Ford-Edge': { startYear: 2007, endYear: null },
    'Cars & Trucks-Ford-Expedition': { startYear: 1997, endYear: null },
    'Cars & Trucks-Ford-Ranger': { startYear: 1983, endYear: null },
    'Cars & Trucks-Ford-Fusion': { startYear: 2006, endYear: 2020 },
    'Cars & Trucks-Ford-Bronco': { startYear: 1966, endYear: null },

    // Motorcycles - Honda
    'Motorcycles-Honda-CBR600RR': { startYear: 2003, endYear: null },
    'Motorcycles-Honda-CBR1000RR': { startYear: 2004, endYear: null },
    'Motorcycles-Honda-CB650R': { startYear: 2019, endYear: null },
    'Motorcycles-Honda-CB1000R': { startYear: 2008, endYear: null },
    'Motorcycles-Honda-CRF450L': { startYear: 2019, endYear: null },
    'Motorcycles-Honda-Gold Wing': { startYear: 1975, endYear: null },
    'Motorcycles-Honda-Rebel 500': { startYear: 2017, endYear: null },
    'Motorcycles-Honda-Africa Twin': { startYear: 2016, endYear: null },
    'Motorcycles-Honda-CBR300R': { startYear: 2015, endYear: null },
    'Motorcycles-Honda-Grom': { startYear: 2014, endYear: null },

    // Motorcycles - Yamaha
    'Motorcycles-Yamaha-YZF-R1': { startYear: 1998, endYear: null },
    'Motorcycles-Yamaha-YZF-R6': { startYear: 1999, endYear: null },
    'Motorcycles-Yamaha-MT-07': { startYear: 2014, endYear: null },
    'Motorcycles-Yamaha-MT-09': { startYear: 2014, endYear: null },
    'Motorcycles-Yamaha-YZ450F': { startYear: 2003, endYear: null },
    'Motorcycles-Yamaha-FJR1300': { startYear: 2001, endYear: null },
    'Motorcycles-Yamaha-Bolt': { startYear: 2014, endYear: null },
    'Motorcycles-Yamaha-Tenere 700': { startYear: 2020, endYear: null },
    'Motorcycles-Yamaha-YZF-R3': { startYear: 2015, endYear: null },
    'Motorcycles-Yamaha-VMAX': { startYear: 1985, endYear: null },

    // Marine Vehicles - Yamaha
    'Marine Vehicles-Yamaha-F25': { startYear: 2005, endYear: null },
    'Marine Vehicles-Yamaha-F40': { startYear: 2000, endYear: null },
    'Marine Vehicles-Yamaha-F60': { startYear: 2004, endYear: null },
    'Marine Vehicles-Yamaha-F90': { startYear: 2006, endYear: null },
    'Marine Vehicles-Yamaha-F115': { startYear: 2000, endYear: null },
    'Marine Vehicles-Yamaha-F150': { startYear: 2004, endYear: null },
    'Marine Vehicles-Yamaha-F200': { startYear: 2002, endYear: null },
    'Marine Vehicles-Yamaha-F250': { startYear: 2007, endYear: null },
    'Marine Vehicles-Yamaha-F300': { startYear: 2011, endYear: null },
    'Marine Vehicles-Yamaha-F350': { startYear: 2014, endYear: null }
  }
};

// Helper functions for cascading dropdown logic
export class VehicleDataService {
  // Get all available vehicle types
  static getVehicleTypes(): string[] {
    return vehicleData.vehicleTypes;
  }
  
  // Get all available years (current year back 30 years)
  static getAllYears(): number[] {
    return Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  }
  
  // Get available years for a specific vehicle type
  static getYearsForVehicleType(vehicleType: string): number[] {
    const allYears = this.getAllYears();
    const makes = vehicleData.makes[vehicleType] || [];
    
    // Find all years where at least one model was available for this vehicle type
    const availableYears = new Set<number>();
    
    makes.forEach(make => {
      const models = vehicleData.models[`${vehicleType}-${make}`] || [];
      models.forEach(model => {
        const rangeKey = `${vehicleType}-${make}-${model}`;
        const range = vehicleData.productionRanges[rangeKey];
        if (range) {
          const endYear = range.endYear || new Date().getFullYear();
          for (let year = range.startYear; year <= endYear && year <= new Date().getFullYear(); year++) {
            if (allYears.includes(year)) {
              availableYears.add(year);
            }
          }
        }
      });
    });
    
    return Array.from(availableYears).sort((a, b) => b - a);
  }
  
  // Get available makes for a specific vehicle type
  static getMakesByVehicleType(vehicleType: string): string[] {
    return vehicleData.makes[vehicleType] || [];
  }
  
  // Get available makes for a specific vehicle type and year
  static getMakesForVehicleTypeAndYear(vehicleType: string, year: number): string[] {
    const makes = vehicleData.makes[vehicleType] || [];
    
    // Filter makes that have at least one model available in the specified year
    return makes.filter(make => {
      const models = vehicleData.models[`${vehicleType}-${make}`] || [];
      return models.some(model => {
        const rangeKey = `${vehicleType}-${make}-${model}`;
        const range = vehicleData.productionRanges[rangeKey];
        if (!range) return false;
        
        const endYear = range.endYear || new Date().getFullYear();
        return year >= range.startYear && year <= endYear;
      });
    });
  }
  
  // Get available models for vehicle type and make (all years)
  static getModelsByVehicleTypeAndMake(vehicleType: string, make: string): string[] {
    const key = `${vehicleType}-${make}`;
    return vehicleData.models[key] || [];
  }
  
  // Get available models for vehicle type, year, and make
  static getModelsForVehicleTypeYearAndMake(vehicleType: string, year: number, make: string): string[] {
    const models = this.getModelsByVehicleTypeAndMake(vehicleType, make);
    
    // Filter models that were available in the specified year
    return models.filter(model => {
      const rangeKey = `${vehicleType}-${make}-${model}`;
      const range = vehicleData.productionRanges[rangeKey];
      if (!range) return false;
      
      const endYear = range.endYear || new Date().getFullYear();
      return year >= range.startYear && year <= endYear;
    });
  }
  
  // Get next available options based on current selection
  static getNextOptions(selection: {
    vehicleType?: string;
    year?: number;
    make?: string;
  }): {
    years: number[];
    makes: string[];
    models: string[];
  } {
    const { vehicleType, year, make } = selection;
    
    let years: number[] = [];
    let makes: string[] = [];
    let models: string[] = [];
    
    if (vehicleType) {
      years = this.getYearsForVehicleType(vehicleType);
      
      if (year) {
        makes = this.getMakesForVehicleTypeAndYear(vehicleType, year);
        
        if (make) {
          models = this.getModelsForVehicleTypeYearAndMake(vehicleType, year, make);
        }
      } else {
        makes = this.getMakesByVehicleType(vehicleType);
      }
    }
    
    return { years, makes, models };
  }
  
  // Validate a complete vehicle selection
  static isValidVehicleSelection(vehicleType: string, year: number, make: string, model: string): boolean {
    if (!vehicleData.vehicleTypes.includes(vehicleType)) return false;
    
    const availableYears = this.getYearsForVehicleType(vehicleType);
    if (!availableYears.includes(year)) return false;
    
    const makes = this.getMakesForVehicleTypeAndYear(vehicleType, year);
    if (!makes.includes(make)) return false;
    
    const models = this.getModelsForVehicleTypeYearAndMake(vehicleType, year, make);
    if (!models.includes(model)) return false;
    
    return true;
  }
}