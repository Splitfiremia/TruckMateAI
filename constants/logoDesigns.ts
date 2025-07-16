export interface LogoDesign {
  id: string;
  name: string;
  description: string;
  prompt: string;
  style: 'modern' | 'classic' | 'tech' | 'bold' | 'minimal';
  colors: string[];
}

export const logoDesigns: LogoDesign[] = [
  {
    id: 'modern-gradient',
    name: 'TruckMate AI - Modern Gradient',
    description: 'Clean, modern design with subtle gradient and tech elements',
    prompt: 'A modern, professional logo for "TruckMate AI" featuring a stylized truck silhouette integrated with AI circuit patterns. Use a blue to teal gradient background. Clean, sans-serif typography. Minimalist design with subtle tech elements. Corporate and trustworthy feel.',
    style: 'modern',
    colors: ['#2563eb', '#0891b2']
  },
  {
    id: 'classic-shield',
    name: 'TruckMate AI - Classic Shield',
    description: 'Traditional shield design conveying trust and reliability',
    prompt: 'A classic, professional logo for "TruckMate AI" with a shield emblem containing a truck icon and AI neural network pattern. Deep navy blue and gold colors. Bold, serif typography. Traditional corporate design that conveys trust, reliability, and authority.',
    style: 'classic',
    colors: ['#1e3a8a', '#f59e0b']
  },
  {
    id: 'tech-circuit',
    name: 'TruckMate AI - Tech Circuit',
    description: 'Futuristic design emphasizing AI and technology',
    prompt: 'A futuristic, high-tech logo for "TruckMate AI" featuring a truck outline made of glowing circuit board patterns and AI nodes. Electric blue and bright green colors. Modern, geometric typography. Emphasizes artificial intelligence and cutting-edge technology.',
    style: 'tech',
    colors: ['#3b82f6', '#10b981']
  },
  {
    id: 'bold-industrial',
    name: 'TruckMate AI - Bold Industrial',
    description: 'Strong, industrial design with bold typography',
    prompt: 'A bold, industrial logo for "TruckMate AI" with a powerful truck silhouette and gear/cog elements. Orange and dark gray colors. Heavy, bold typography. Strong, masculine design that appeals to trucking industry professionals. Emphasizes strength and reliability.',
    style: 'bold',
    colors: ['#ea580c', '#374151']
  },
  {
    id: 'minimal-icon',
    name: 'TruckMate AI - Minimal Icon',
    description: 'Clean, minimal design with simple iconography',
    prompt: 'A minimal, clean logo for "TruckMate AI" with a simple truck icon and AI brain symbol. Monochromatic design in deep blue. Light, modern typography. Very clean and professional. Focuses on simplicity and clarity.',
    style: 'minimal',
    colors: ['#1e40af']
  },
  {
    id: 'road-journey',
    name: 'TruckMate AI - Road Journey',
    description: 'Dynamic design showing movement and journey',
    prompt: 'A dynamic logo for "TruckMate AI" featuring a truck on a stylized road with AI data streams flowing alongside. Warm orange to red gradient. Modern typography with slight italic. Conveys movement, journey, and smart technology assistance.',
    style: 'modern',
    colors: ['#f97316', '#dc2626']
  },
  {
    id: 'hexagon-tech',
    name: 'TruckMate AI - Hexagon Tech',
    description: 'Geometric hexagon design with tech elements',
    prompt: 'A geometric logo for "TruckMate AI" with a hexagonal badge containing a truck and AI hexagon pattern. Teal and dark blue colors. Clean, technical typography. Modern geometric design that suggests precision, technology, and professional service.',
    style: 'tech',
    colors: ['#0891b2', '#1e3a8a']
  },
  {
    id: 'vintage-badge',
    name: 'TruckMate AI - Vintage Badge',
    description: 'Retro-inspired badge design with modern AI twist',
    prompt: 'A vintage-inspired badge logo for "TruckMate AI" with classic truck illustration and modern AI elements. Burgundy and cream colors. Retro typography with modern touches. Combines traditional trucking heritage with cutting-edge AI technology.',
    style: 'classic',
    colors: ['#991b1b', '#fef3c7']
  }
];

export const getLogoDesignById = (id: string): LogoDesign | undefined => {
  return logoDesigns.find(design => design.id === id);
};

export const getLogoDesignsByStyle = (style: LogoDesign['style']): LogoDesign[] => {
  return logoDesigns.filter(design => design.style === style);
};