// Transparent Session Recommendation Engine
// Formula: score = 0.45*interest + 0.25*accessibility + 0.15*time + 0.15*crowd
// All 4 sub-scores normalized between 0 and 1
// Transparent sub-scores + final weighted score + one-line rationale

export const ROUTE_DNA_PROFILES = {
  'mobility-friendly': {
    id: 'mobility-friendly',
    label: 'Mobility-Friendly',
    description: 'Step-free access, 100% elevators & wide ramps, avoids steep inclines & temporary barriers',
    weightAccessibility: 1.0,
    speedMultiplier: 0.85,
    tagPreference: 'Accessibility',
  },
  'low-sensory': {
    id: 'low-sensory',
    label: 'Low-Sensory',
    description: 'Avoids loud echo corridors, flashing signage & crowded food concourses; favors quiet routes',
    weightAccessibility: 0.95,
    speedMultiplier: 0.9,
    tagPreference: 'Health',
  },
  'fast': {
    id: 'fast',
    label: 'Fast / Shortest Path',
    description: 'Direct transit, uses central stairwells and main thoroughfares for minimal walking minutes',
    weightAccessibility: 0.8,
    speedMultiplier: 1.25,
    tagPreference: 'AI',
  },
  'safety-first': {
    id: 'safety-first',
    label: 'Safety-First',
    description: 'High-visibility corridors passing active staff kiosks, well-lit exits & medical stations',
    weightAccessibility: 0.9,
    speedMultiplier: 1.0,
    tagPreference: 'Urban Tech',
  },
};

/**
 * Computes recommendation score for a session based on user preferences,
 * active zone statuses, and Route DNA profile.
 * 
 * Returns normalized sub-scores (0–1), final weighted score (0–100), and rationale.
 */
export function scoreSession(session, preferences, zones) {
  const currentRouteDna = ROUTE_DNA_PROFILES[preferences.routeDna] || ROUTE_DNA_PROFILES['mobility-friendly'];
  const userInterests = preferences.interests || ['AI', 'Accessibility', 'Urban Tech'];

  // 1. Interest Sub-Score (0.0 - 1.0)
  // Matching attendee interests with session tags
  let matchingTags = 0;
  if (session.tags && session.tags.length > 0) {
    matchingTags = session.tags.filter(tag => userInterests.includes(tag)).length;
  }
  const tagRatio = session.tags?.length ? matchingTags / session.tags.length : 0.5;
  const interest = Number(Math.min(1.0, Math.max(0.1, (session.interestBase * 0.5) + (tagRatio * 0.5))).toFixed(2));

  // 2. Accessibility Sub-Score (0.0 - 1.0)
  // Evaluates session venue + any active barrier along the zone
  const targetZone = zones.find(z => z.id === session.zoneId);
  let zonePenalty = 0;
  if (targetZone) {
    if (targetZone.status === 'red') zonePenalty = 0.45;
    else if (targetZone.status === 'orange') zonePenalty = 0.25;
    else if (targetZone.status === 'yellow') zonePenalty = 0.1;
  }

  // Adjust by Route DNA profile
  let accessibilityRaw = session.accessibilityBase;
  if (preferences.routeDna === 'mobility-friendly') {
    // Highly sensitive to ramp/elevator blocks
    accessibilityRaw = Math.max(0.1, accessibilityRaw - zonePenalty * 1.4);
  } else if (preferences.routeDna === 'low-sensory') {
    // Sensitive to sensory levels of the room
    const sensoryPenalty = targetZone?.sensoryLevel === 'high' ? 0.3 : 0;
    accessibilityRaw = Math.max(0.1, accessibilityRaw - sensoryPenalty - zonePenalty * 0.5);
  } else {
    accessibilityRaw = Math.max(0.1, accessibilityRaw - zonePenalty * 0.8);
  }
  const accessibility = Number(Math.min(1.0, Math.max(0.0, accessibilityRaw)).toFixed(2));

  // 3. Time Sub-Score (0.0 - 1.0)
  // Proximity & schedule convenience
  let timeScore = session.timeScore || 0.8;
  if (preferences.routeDna === 'fast') {
    timeScore = Math.min(1.0, timeScore * 1.15);
  }
  const time = Number(Math.min(1.0, Math.max(0.1, timeScore)).toFixed(2));

  // 4. Crowd Sub-Score (0.0 - 1.0)
  // Higher value = less crowded / smoother experience
  let crowdRaw = session.crowdScore || 0.85;
  if (targetZone?.status === 'orange') crowdRaw *= 0.65;
  if (targetZone?.status === 'red') crowdRaw *= 0.4;
  if (preferences.routeDna === 'low-sensory') {
    crowdRaw = Math.max(0.1, crowdRaw * 0.85); // low sensory users value calm spaces even higher
  }
  const crowd = Number(Math.min(1.0, Math.max(0.05, crowdRaw)).toFixed(2));

  // Final Weighted Formula
  // score = 0.45*interest + 0.25*accessibility + 0.15*time + 0.15*crowd
  const rawWeighted = (0.45 * interest) + (0.25 * accessibility) + (0.15 * time) + (0.15 * crowd);
  const finalScore = Math.round(rawWeighted * 100);

  // Generate transparent 1-line explanation
  let rationale = '';
  if (interest >= 0.85 && accessibility >= 0.85) {
    rationale = `Strong ${Math.round(interest * 100)}% interest match and verified ${preferences.routeDna} step-free access (${Math.round(accessibility * 100)}%).`;
  } else if (targetZone?.status === 'red' || targetZone?.status === 'orange') {
    rationale = `High topic match (${Math.round(interest * 100)}%), but accessibility is affected by current ${targetZone.status} status in ${targetZone.name}.`;
  } else if (preferences.routeDna === 'low-sensory' && targetZone?.sensoryLevel === 'very-low') {
    rationale = `Calm sensory room profile with high comfort rating (${Math.round(crowd * 100)}%) and ideal timing.`;
  } else if (time >= 0.85) {
    rationale = `Ideal timing schedule (${Math.round(time * 100)}%) with optimal transit time from your current location.`;
  } else {
    rationale = `Balanced match across interests (${Math.round(interest * 100)}%) and venue capacity (${Math.round(crowd * 100)}%).`;
  }

  return {
    score: finalScore,
    interest,
    accessibility,
    time,
    crowd,
    formulaBreakdown: `0.45×${interest} + 0.25×${accessibility} + 0.15×${time} + 0.15×${crowd}`,
    rationale,
  };
}
