// Route DNA Navigation & Quiet Mode Calculator

export function calculateFacilityWalkTime(facility, routeDna, zones) {
  const baseMinutes = facility.walkTimeMinutes || 3;
  const targetZone = zones.find(z => z.id === facility.zoneId);

  let multiplier = 1.0;
  let penaltyMinutes = 0;

  if (targetZone?.status === 'red') {
    penaltyMinutes += 5; // Major bottleneck / detour
  } else if (targetZone?.status === 'orange') {
    penaltyMinutes += 2;
  }

  switch (routeDna) {
    case 'mobility-friendly':
      multiplier = 1.15; // Prefers accessible elevators / gentle ramps
      if (targetZone?.type === 'ramp' && targetZone?.status === 'red') {
        penaltyMinutes += 6; // Ramp block requires detour via east lift
      }
      break;
    case 'low-sensory':
      // Detours around loud zones
      if (targetZone?.sensoryLevel === 'high') {
        penaltyMinutes += 3;
      }
      multiplier = 1.1;
      break;
    case 'fast':
      multiplier = 0.85; // Uses central stairs and direct cuts
      break;
    case 'safety-first':
      multiplier = 1.05; // Sticks to main monitored corridors
      break;
    default:
      multiplier = 1.0;
  }

  const finalMinutes = Math.max(1, Math.round(baseMinutes * multiplier + penaltyMinutes));
  return {
    minutes: finalMinutes,
    hasDetour: penaltyMinutes > 0,
    note: penaltyMinutes > 0 ? 'Detour around active friction point' : 'Direct accessible route',
  };
}

/**
 * Quiet Mode: "Take me somewhere calm"
 * Computes nearest calm sanctuary and compares direct noisy vs calm low-sensory route
 */
export function getCalmSanctuaryRoute(zones) {
  const quietZone = zones.find(z => z.type === 'quiet') || zones.find(z => z.id === 'zone-quiet-room');

  const foodCourtZone = zones.find(z => z.id === 'zone-food-court');
  const foodCourtStatus = foodCourtZone?.status || 'orange';

  return {
    destination: {
      id: quietZone?.id || 'zone-quiet-room',
      name: quietZone?.name || 'Quiet Room (Zen Haven)',
      type: 'Sensory Sanctuary & Acoustic Haven',
      status: quietZone?.status || 'green',
      currentNoiseLevel: '34 dB (Whisper Quiet)',
      features: ['Acoustic drapes', 'Dimmed lighting', 'Sensory relief chairs', 'No loud announcements'],
    },
    directPath: {
      name: 'Direct Central Path',
      timeMinutes: 3,
      sensoryExposure: 'High (Cuts directly past Food Court & Chai Concourse)',
      crowdRisk: foodCourtStatus === 'orange' ? 'High friction (Chai queue spillover)' : 'Moderate',
      isRecommended: false,
    },
    calmPath: {
      name: 'Calm Low-Sensory Route',
      timeMinutes: 5,
      deltaMinutes: '+2 min',
      sensoryExposure: 'Low (< 42 dB ambient, indirect soft-lit corridors)',
      crowdRisk: 'Minimal — verified step-free and quiet',
      isRecommended: true,
      steps: [
        'Exit your current zone via the North Skywalk corridor.',
        'Follow tactile floor guides past Workshop B (acoustic buffer wall).',
        'Bypass the Food Court perimeter via the quiet glass atrium.',
        'Enter Quiet Room (Zen Haven) through double acoustic entryway.'
      ],
    }
  };
}
