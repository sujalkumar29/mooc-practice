/**
 * Wildlife Ecology Course Metadata and Configuration
 * 
 * Supports 13 weeks (Week 0 to Week 12) with a target of 10 questions per week (130 total).
 * Questions are stored separately in questions.js.
 */

export const wildlifeEcologyCourse = {
  id: 'wildlife-ecology',
  slug: 'wildlife-ecology',
  title: 'Wildlife Ecology',
  subtitle: 'Ecosystem Dynamics, Biodiversity & Wildlife Management',
  code: 'MOOC-ECOL-101',
  category: 'Ecology & Environmental Sciences',
  instructor: 'MOOC / NPTEL Equivalent Syllabus',
  coverImage: '/images/wildlife_ecology.jpg',
  accentColor: '#059669', // Emerald forest green
  badge: 'Featured Course',
  description: 'Master ecological principles, species interactions, wildlife population dynamics, habitat management, and conservation technology through structured weekly practice tests and full-syllabus mock exams.',
  totalWeeks: 13,
  plannedQuestionsPerWeek: 10,
  totalPlannedQuestions: 130,
  status: 'Active',
  weeks: [
    {
      weekNumber: 0,
      title: 'Week 0: Prerequisites & Fundamentals of Ecology',
      topics: ['Ecological hierarchy', 'Biosphere components', 'Basic ecological definitions', 'Energy flow principles'],
      plannedQuestions: 10
    },
    {
      weekNumber: 1,
      title: 'Week 1: Introduction to Wildlife Ecology & Ecosystems',
      topics: ['Scope of wildlife ecology', 'Abiotic and biotic factors', 'Food webs and trophic levels', 'Ecological niches'],
      plannedQuestions: 10
    },
    {
      weekNumber: 2,
      title: 'Week 2: Population Ecology & Demographics',
      topics: ['Population growth models', 'Carrying capacity', 'Life tables and survivorship curves', 'Age structure'],
      plannedQuestions: 10
    },
    {
      weekNumber: 3,
      title: 'Week 3: Community Ecology & Species Interactions',
      topics: ['Predation and herbivory', 'Competition and niche partitioning', 'Symbiosis and mutualism', 'Keystone species'],
      plannedQuestions: 10
    },
    {
      weekNumber: 4,
      title: 'Week 4: Landscape Ecology & Habitat Fragmentation',
      topics: ['Landscape mosaic', 'Corridors and stepping stones', 'Edge effects', 'Island biogeography theory'],
      plannedQuestions: 10
    },
    {
      weekNumber: 5,
      title: 'Week 5: Behavioral Ecology & Foraging Strategies',
      topics: ['Optimal foraging theory', 'Mating systems and sexual selection', 'Territoriality', 'Social behavior and communication'],
      plannedQuestions: 10
    },
    {
      weekNumber: 6,
      title: 'Week 6: Conservation Biology & Threat Assessment',
      topics: ['IUCN Red List categories', 'Extinction vortices', 'Habitat destruction and invasive species', 'Overexploitation'],
      plannedQuestions: 10
    },
    {
      weekNumber: 7,
      title: 'Week 7: Wildlife Diseases & One Health Concept',
      topics: ['Zoonoses and wildlife pathogens', 'Disease transmission dynamics', 'Host-pathogen coevolution', 'One Health framework'],
      plannedQuestions: 10
    },
    {
      weekNumber: 8,
      title: 'Week 8: Wildlife Health, Monitoring & Genetics',
      topics: ['Conservation genetics', 'Inbreeding depression', 'Genetic drift and bottleneck effect', 'eDNA and non-invasive sampling'],
      plannedQuestions: 10
    },
    {
      weekNumber: 9,
      title: 'Week 9: Quantitative Methods & Census Techniques',
      topics: ['Line transect sampling', 'Mark-recapture models', 'Camera trapping and encounter rates', 'Occupancy modeling'],
      plannedQuestions: 10
    },
    {
      weekNumber: 10,
      title: 'Week 10: Human-Wildlife Conflict & Coexistence',
      topics: ['Causes and manifestations of conflict', 'Mitigation measures and deterrents', 'Community-based conservation', 'Ecosystem services valuation'],
      plannedQuestions: 10
    },
    {
      weekNumber: 11,
      title: 'Week 11: Protected Areas & Reserve Design',
      topics: ['SLOSS debate', 'National parks, sanctuaries, and biosphere reserves', 'Buffer zones and eco-sensitive corridors', 'Forest rights & wildlife acts'],
      plannedQuestions: 10
    },
    {
      weekNumber: 12,
      title: 'Week 12: Modern Technology & Future Frontiers',
      topics: ['Satellite telemetry and GIS', 'Drones and AI in wildlife tracking', 'Bioacoustics monitoring', 'Climate change resilience strategies'],
      plannedQuestions: 10
    }
  ]
};
