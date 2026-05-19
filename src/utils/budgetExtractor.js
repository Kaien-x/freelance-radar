/**
 * Extract budget information from job title and description
 * Looks for patterns like $100-$500, $50/hr, $100 per hour, etc.
 */
export function extractBudgetFromText(text) {
  if (!text) return null;

  const lowerText = text.toLowerCase();
  
  // Pattern for hourly rates: $X/hr, $X per hour, $X/hour
  const hourlyPatterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:\/|\sPer\s)(?:hr|hour)/gi,
    /(?:^|\s)(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:\/|\sPer\s)(?:hr|hour)/gi,
  ];

  for (const pattern of hourlyPatterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[0].replace(/[$,]/g, '').split(/[/\s]/)[0]);
      if (value > 0) {
        return {
          min: Math.floor(value),
          max: Math.floor(value * 1.2),
          type: 'hourly',
          source: 'extracted'
        };
      }
    }
  }

  // Pattern for fixed prices: $X-$Y, $X to $Y, budget is $X
  const fixedPatterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:\-|to)\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /budget[:\s]+\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:\-|to)?\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)?/gi,
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g, // Single dollar amount
  ];

  for (const pattern of fixedPatterns) {
    const match = text.match(pattern);
    if (match) {
      if (pattern === fixedPatterns[2]) {
        // Single dollar amount - use as both min and max
        const value = parseFloat(match[0].replace(/[$,]/g, ''));
        if (value > 0) {
          return {
            min: Math.floor(value),
            max: Math.floor(value),
            type: 'fixed',
            source: 'extracted'
          };
        }
      } else {
        // Range pattern
        const numbers = match[0]
          .replace(/[^\d,.-]/g, '')
          .split(/[\s\-to]+/)
          .map(n => parseFloat(n.replace(/,/g, '')))
          .filter(n => !isNaN(n) && n > 0);

        if (numbers.length >= 2) {
          return {
            min: Math.floor(numbers[0]),
            max: Math.floor(numbers[1]),
            type: 'fixed',
            source: 'extracted'
          };
        } else if (numbers.length === 1) {
          return {
            min: Math.floor(numbers[0]),
            max: Math.floor(numbers[0]),
            type: 'fixed',
            source: 'extracted'
          };
        }
      }
    }
  }

  return null;
}

/**
 * Get effective budget from job object, extracting from text if needed
 */
export function getEffectiveBudget(job) {
  // If job already has budget with values, return it
  if (job.budget && (job.budget.min > 0 || job.budget.max > 0)) {
    return {
      ...job.budget,
      source: 'existing'
    };
  }

  // Try to extract from title and description
  let extracted = extractBudgetFromText(job.title);
  if (extracted) return extracted;

  extracted = extractBudgetFromText(job.description);
  if (extracted) return extracted;

  // No budget found
  return null;
}

/**
 * Format budget for display
 */
export function formatBudget(budget) {
  if (!budget) {
    return 'Negotiable';
  }

  if (budget.type === 'hourly') {
    if (budget.min === budget.max) {
      return `$${budget.min.toLocaleString()}/hr`;
    }
    return `$${budget.min.toLocaleString()}-$${budget.max.toLocaleString()}/hr`;
  }

  if (budget.min === budget.max) {
    return `$${budget.min.toLocaleString()}`;
  }

  return `$${budget.min.toLocaleString()}-$${budget.max.toLocaleString()}`;
}
