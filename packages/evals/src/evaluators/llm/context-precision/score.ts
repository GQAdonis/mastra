import { roundToTwoDecimals } from '../../scoring/utils';
import type { Outcome } from '../types';

/**
 * Calculates a context precision score based on outcomes
 * @param param0 The outcomes, scale, and uncertainty weight
 * @returns A score between 0 and scale
 */
export function calculateContextPrecisionScore({
  outcomes,
  scale,
}: {
  outcomes: Outcome[];
  scale: number;
  uncertaintyWeight: number;
  context?: string[];
}): number {
  const totalOutcomes = outcomes?.length || 0;
  if (totalOutcomes === 0) {
    return 0;
  }

  // Convert to binary scores (1 for yes, 0 for no)
  const binaryScores = outcomes.map(v => (v.outcome.trim().toLowerCase() === 'yes' ? 1 : 0));

  let weightedPrecisionSum = 0;
  let relevantCount = 0;

  // Calculate weighted precision at each position
  binaryScores.forEach((isRelevant, index) => {
    if (isRelevant) {
      relevantCount++;
      const currentPrecision = relevantCount / (index + 1);
      weightedPrecisionSum += currentPrecision * isRelevant;
    }
  });

  if (relevantCount === 0) {
    return 0;
  }

  const finalScore = weightedPrecisionSum / relevantCount;
  return roundToTwoDecimals(finalScore * scale);
}
